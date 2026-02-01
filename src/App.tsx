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
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="usuarios" element={<Users />} />
              <Route path="productos" element={<Productos />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="movimientos-almacen" element={<MovimientosAlmacen />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="compras" element={<Compras />} />
              <Route path="ventas" element={<Ventas />} />
              <Route path="pos" element={<PosPage />} />
              <Route path="caja" element={<ArqueosCaja />} />
              <Route path="reportes/inventario" element={<ReporteInventario />} />
              <Route path="reportes/ventas" element={<ReporteVentas />} />
              <Route path="reportes/compras" element={<ReporteCompras />} />
              <Route path="configuracion" element={<Settings />} />
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