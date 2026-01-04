// src/components/app-sidebar.tsx
import { 
  Home, 
  Users, 
  Settings, 
  Package, 
  Tags, 
  UsersRound, 
  ShoppingCart, 
  ShoppingBag,
  Wallet,
  ArrowLeftRight,
  Truck,
  Monitor
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Inicio', path: '/', group: 'Principal' },
  { icon: Wallet, label: 'Caja', path: '/caja', group: 'Transacciones' },
  { icon: Monitor, label: 'POS', path: '/pos', group: 'Transacciones' },
  { icon: Package, label: 'Productos', path: '/productos', group: 'Inventario' },
  { icon: Tags, label: 'Categorías', path: '/categorias', group: 'Inventario' },
  { icon: ArrowLeftRight, label: 'Movimientos', path: '/movimientos-almacen', group: 'Inventario' },
  { icon: ShoppingBag, label: 'Ventas', path: '/ventas', group: 'Transacciones' },
  { icon: ShoppingCart, label: 'Compras', path: '/compras', group: 'Transacciones' },
  { icon: UsersRound, label: 'Clientes', path: '/clientes', group: 'Gestión' },
  { icon: Truck, label: 'Proveedores', path: '/proveedores', group: 'Gestión' },
  { icon: Users, label: 'Usuarios', path: '/usuarios', group: 'Gestión' },
  { icon: Settings, label: 'Configuración', path: '/configuracion', group: 'Gestión' },
];

const groupedMenuItems = menuItems.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof menuItems>);

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Sistema Librería</span>
            <span className="text-xs text-muted-foreground">v1.0.2</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {Object.entries(groupedMenuItems).map(([group, items]) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground border-t">
          © 2025 Sistema Librería
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}