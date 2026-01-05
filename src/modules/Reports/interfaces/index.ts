export interface ReporteInventarioItem {
  id: string;
  codigo: string;
  nombre: string;
  stock: number;
  stockMinimo: number;
  precioCompra: string;
  precioVenta: string;
  estado: boolean;
  categoria: {
    id: string;
    nombre: string;
  };
}

export interface ReporteInventarioResumen {
  totalProductos: number;
  productosBajoStock: number;
  valorTotalInventario: number;
}

export interface ReporteInventario {
  resumen: ReporteInventarioResumen;
  productos: ReporteInventarioItem[];
}

export interface ReporteVentasResumen {
  totalVentas: number;
  montoTotalVentas: number;
  promedioVenta: number;
  ventasPorFormaPago: Record<string, number>;
}

export interface ReporteVentas {
  resumen: ReporteVentasResumen;
  ventas: any[];
}

export interface ReporteComprasResumen {
  totalCompras: number;
  montoTotalCompras: number;
  promedioCompra: number;
}

export interface ReporteCompras {
  resumen: ReporteComprasResumen;
  compras: any[];
}
