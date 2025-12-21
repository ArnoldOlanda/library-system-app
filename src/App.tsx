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
import { Proveedores } from './modules/Suppliers/pages/Proveedores';
import { Compras } from './modules/Purchases/pages/Compras';
import { Ventas } from './modules/Sales/pages/Ventas';
import { ArqueosCaja } from './modules/Cash/pages/ArqueosCaja';
import { Layout } from './layout';

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<LoginPage />} />
          
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
            <Route path="clientes" element={<Clientes />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="compras" element={<Compras />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="arqueos-caja" element={<ArqueosCaja />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>

          {/* Ruta catch-all para redireccionar a login o home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;