import { useState, useCallback } from 'react';
import type { Producto } from '@/modules/Products/interfaces';
import type { CartItem, Cart, FormaPago, CreateVentaDto } from '../interfaces';
import { ventasService } from '../services/ventas.service';

export const usePOS = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [selectedCliente, setSelectedCliente] = useState<string | undefined>(undefined);
  const [formaPago, setFormaPago] = useState<FormaPago>('Efectivo' as FormaPago);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToCart = useCallback((producto: Producto, cantidad: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.producto.id === producto.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si el producto ya existe
        newItems = [...prevCart.items];
        const newCantidad = newItems[existingItemIndex].cantidad + cantidad;
        
        // Validar stock
        if (newCantidad > producto.stock) {
          alert(`Stock insuficiente. Disponible: ${producto.stock}`);
          return prevCart;
        }

        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          cantidad: newCantidad,
          subtotal: newCantidad * Number(producto.precioVenta),
        };
      } else {
        // Validar stock antes de agregar
        if (cantidad > producto.stock) {
          alert(`Stock insuficiente. Disponible: ${producto.stock}`);
          return prevCart;
        }

        // Agregar nuevo producto
        const newItem: CartItem = {
          producto,
          cantidad,
          subtotal: cantidad * Number(producto.precioVenta),
        };
        newItems = [...prevCart.items, newItem];
      }

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.cantidad, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    });
  }, []);

  const removeFromCart = useCallback((productoId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.producto.id !== productoId
      );
      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.cantidad, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    });
  }, []);

  const updateQuantity = useCallback((productoId: string, cantidad: number) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.items.findIndex(
        (item) => item.producto.id === productoId
      );

      if (itemIndex < 0) return prevCart;

      const item = prevCart.items[itemIndex];

      // Validar stock
      if (cantidad > item.producto.stock) {
        alert(`Stock insuficiente. Disponible: ${item.producto.stock}`);
        return prevCart;
      }

      if (cantidad <= 0) {
        // Remover item si la cantidad es 0 o negativa
        return {
          items: prevCart.items.filter((_, index) => index !== itemIndex),
          total: prevCart.total - item.subtotal,
          itemCount: prevCart.itemCount - item.cantidad,
        };
      }

      const newItems = [...prevCart.items];
      newItems[itemIndex] = {
        ...item,
        cantidad,
        subtotal: cantidad * Number(item.producto.precioVenta),
      };

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.cantidad, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
    setSelectedCliente(undefined);
    setFormaPago('Efectivo' as FormaPago);
  }, []);

  const processSale = useCallback(async () => {
    if (cart.items.length === 0) {
      alert('El carrito está vacío');
      return null;
    }

    setIsProcessing(true);

    try {
      const ventaDto: CreateVentaDto = {
        clienteId: selectedCliente,
        fechaVenta: new Date().toISOString(),
        formaPago,
        detalles: cart.items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: Number(item.producto.precioVenta),
        })),
      };

      const venta = await ventasService.create(ventaDto);
      clearCart();
      return venta;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al procesar la venta';
      alert(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [cart, selectedCliente, formaPago, clearCart]);

  return {
    cart,
    selectedCliente,
    formaPago,
    isProcessing,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSelectedCliente,
    setFormaPago,
    processSale,
  };
};
