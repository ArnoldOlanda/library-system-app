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
  Monitor,
  FileText,
  ChevronRight,
  ShieldCheck
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import { AbilityContext } from '@/rbac/AbilityContext';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  group: string;
  action?: string;
  subject?: string;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Inicio', path: '/', group: 'Principal' },
  { icon: Wallet, label: 'Caja', path: '/caja', group: 'Transacciones', action: 'read', subject: 'arqueo' },
  { icon: Monitor, label: 'POS', path: '/pos', group: 'Transacciones', action: 'create', subject: 'venta' },
  { icon: Package, label: 'Productos', path: '/productos', group: 'Inventario', action: 'read', subject: 'producto' },
  { icon: Tags, label: 'Categorías', path: '/categorias', group: 'Inventario', action: 'read', subject: 'categoria' },
  { icon: ArrowLeftRight, label: 'Movimientos', path: '/movimientos-almacen', group: 'Inventario', action: 'read', subject: 'producto' },
  { icon: ShoppingBag, label: 'Ventas', path: '/ventas', group: 'Transacciones', action: 'read', subject: 'venta' },
  { icon: ShoppingCart, label: 'Compras', path: '/compras', group: 'Transacciones', action: 'read', subject: 'compra' },
  { icon: UsersRound, label: 'Clientes', path: '/clientes', group: 'Gestión', action: 'read', subject: 'cliente' },
  { icon: Truck, label: 'Proveedores', path: '/proveedores', group: 'Gestión', action: 'read', subject: 'proveedor' },
  { icon: Users, label: 'Usuarios', path: '/usuarios', group: 'Gestión', action: 'read', subject: 'user' },
  { icon: Settings, label: 'Configuración', path: '/configuracion', group: 'Gestión', action: 'read', subject: 'user' },
  { icon: ShieldCheck, label: 'Roles y Permisos', path: '/roles', group: 'Gestión', action: 'read', subject: 'role' },
];

const reportesSubmenu = [
  { label: 'Inventario', path: '/reportes/inventario', icon: Package, action: 'read', subject: 'producto' },
  { label: 'Ventas', path: '/reportes/ventas', icon: ShoppingBag, action: 'read', subject: 'venta' },
  { label: 'Compras', path: '/reportes/compras', icon: ShoppingCart, action: 'read', subject: 'compra' },
];

export function AppSidebar() {
  const ability = useContext(AbilityContext);

  // Filtrar items del menú según permisos
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Si no tiene permisos definidos (como Inicio), mostrarlo siempre
      if (!item.action || !item.subject) return true;
      // Verificar si el usuario puede realizar la acción
      return ability.can(item.action, item.subject);
    });
  }, [ability]);

  // Filtrar reportes según permisos
  const filteredReportes = useMemo(() => {
    return reportesSubmenu.filter((report) => {
      return ability.can(report.action, report.subject);
    });
  }, [ability]);

  // Agrupar items filtrados
  const groupedMenuItems = useMemo(() => {
    return filteredMenuItems.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [filteredMenuItems]);

  // Verificar si debe mostrar el acordeón de reportes
  const showReportes = filteredReportes.length > 0;

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
                
                {/* Acordeón de Reportes en el grupo Gestión */}
                {group === 'Gestión' && showReportes && (
                  <Collapsible className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <FileText />
                          <span>Reportes</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {filteredReportes.map((submenu) => (
                            <SidebarMenuSubItem key={submenu.path}>
                              <SidebarMenuSubButton asChild>
                                <Link to={submenu.path}>
                                  <submenu.icon className="h-4 w-4" />
                                  <span>{submenu.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )}
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