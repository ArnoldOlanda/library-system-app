// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from './modules/Auth/pages/LoginPage';
import { Home } from './pages/Home';
import { Users } from './modules/Users/pages/Users';
import { Settings } from './modules/Settings/pages/Settings';
import { Productos } from './modules/Products/pages/Productos';
import { Categorias } from './modules/Categories/pages/Categorias';
import { Clientes } from './modules/Customers/pages/Clientes';
import Proveedores from './modules/Suppliers/pages/Proveedores';
import MovimientosAlmacen from './modules/InventoryMovements/pages/MovimientosAlmacen';
import { Compras } from './modules/Purchases/pages/Compras';
import { Ventas } from './modules/Sales/pages/Ventas';
import { PosPage } from './modules/Pos/pages/Pos';
import { ArqueosCaja } from './modules/Cash/pages/ArqueosCaja';
import { ReporteInventario } from './modules/Reports/pages/ReporteInventario';
import { ReporteVentas } from './modules/Reports/pages/ReporteVentas';
import { ReporteCompras } from './modules/Reports/pages/ReporteCompras';
import { Roles } from './modules/Roles/pages/Roles';
import BarcodeScanner from './pages/BarcodeScanner';
import { Layout } from './layout';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta pública de login */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Ruta del escáner (sin layout, diseño móvil) */}
            <Route
              path="/scanner"
              element={
                <BarcodeScanner />
              }
            />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <Layout />
              }
            >
              <Route index element={<Home />} />
              
              {/* Usuarios */}
              <Route 
                path="usuarios" 
                element={
                  <ProtectedRoute action="read" subject="user">
                    <Users />
                  </ProtectedRoute>
                } 
              />
              
              {/* Productos */}
              <Route 
                path="productos" 
                element={
                  <ProtectedRoute action="read" subject="producto">
                    <Productos />
                  </ProtectedRoute>
                } 
              />
              
              {/* Categorías */}
              <Route 
                path="categorias" 
                element={
                  <ProtectedRoute action="read" subject="categoria">
                    <Categorias />
                  </ProtectedRoute>
                } 
              />
              
              {/* Movimientos de Almacén */}
              <Route 
                path="movimientos-almacen" 
                element={
                  <ProtectedRoute action="read" subject="producto">
                    <MovimientosAlmacen />
                  </ProtectedRoute>
                } 
              />
              
              {/* Clientes */}
              <Route 
                path="clientes" 
                element={
                  <ProtectedRoute action="read" subject="cliente">
                    <Clientes />
                  </ProtectedRoute>
                } 
              />
              
              {/* Proveedores */}
              <Route 
                path="proveedores" 
                element={
                  <ProtectedRoute action="read" subject="proveedor">
                    <Proveedores />
                  </ProtectedRoute>
                } 
              />
              
              {/* Compras */}
              <Route 
                path="compras" 
                element={
                  <ProtectedRoute action="read" subject="compra">
                    <Compras />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ventas */}
              <Route 
                path="ventas" 
                element={
                  <ProtectedRoute action="read" subject="venta">
                    <Ventas />
                  </ProtectedRoute>
                } 
              />
              
              {/* Punto de Venta (POS) */}
              <Route 
                path="pos" 
                element={
                  <ProtectedRoute action="create" subject="venta">
                    <PosPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Arqueos de Caja */}
              <Route 
                path="caja" 
                element={
                  <ProtectedRoute action="read" subject="arqueo">
                    <ArqueosCaja />
                  </ProtectedRoute>
                } 
              />
              
              {/* Reportes */}
              <Route 
                path="reportes/inventario" 
                element={
                  <ProtectedRoute action="read" subject="producto">
                    <ReporteInventario />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reportes/ventas" 
                element={
                  <ProtectedRoute action="read" subject="venta">
                    <ReporteVentas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reportes/compras" 
                element={
                  <ProtectedRoute action="read" subject="compra">
                    <ReporteCompras />
                  </ProtectedRoute>
                } 
              />
              
              {/* Roles */}
              <Route 
                path="roles" 
                element={
                  <ProtectedRoute action="read" subject="role">
                    <Roles />
                  </ProtectedRoute>
                } 
              />
              
              {/* Configuración */}
              <Route 
                path="configuracion" 
                element={
                  <ProtectedRoute action="read" subject="user">
                    <Settings />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Ruta catch-all para redireccionar a login o home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;