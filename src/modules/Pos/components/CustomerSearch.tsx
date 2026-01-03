import { useState } from 'react';
import { Search } from 'lucide-react';
import { useClientes } from '@/modules/Customers/hooks/useClientes';
import type { Cliente } from '@/modules/Customers/interfaces';
import { Input } from '@/components/ui/input';

interface CustomerSearchProps {
  selectedCustomer: Cliente | null;
  onSelectCustomer: (customer: Cliente | null) => void;
}

export function CustomerSearch({ selectedCustomer, onSelectCustomer }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: clientesData, isLoading } = useClientes(1, 50);

  const filteredCustomers = clientesData?.data.clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.dni?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSelectCustomer = (customer: Cliente) => {
    onSelectCustomer(customer);
    setSearchTerm(customer.nombre);
    setShowDropdown(false);
  };

  const handleClearCustomer = () => {
    onSelectCustomer(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Cliente
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input  
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Buscar por nombre o DNI..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-gray-500">Cargando...</div>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-gray-900">{customer.nombre}</div>
                  {customer.dni && (
                    <div className="text-sm text-gray-500">DNI: {customer.dni}</div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500">No se encontraron clientes</div>
            )}
          </div>
        )}
      </div>

      {/* Selected Customer Info */}
      {selectedCustomer && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <label className="text-xs font-medium text-gray-600">Nombre</label>
            <p className="text-sm font-semibold text-gray-900">{selectedCustomer.nombre}</p>
          </div>
          {selectedCustomer.dni && (
            <div>
              <label className="text-xs font-medium text-gray-600">DNI</label>
              <p className="text-sm font-semibold text-gray-900">{selectedCustomer.dni}</p>
            </div>
          )}
          {selectedCustomer.telefono && (
            <div>
              <label className="text-xs font-medium text-gray-600">Teléfono</label>
              <p className="text-sm font-semibold text-gray-900">{selectedCustomer.telefono}</p>
            </div>
          )}
          {selectedCustomer.direccion && (
            <div>
              <label className="text-xs font-medium text-gray-600">Dirección</label>
              <p className="text-sm font-semibold text-gray-900">{selectedCustomer.direccion}</p>
            </div>
          )}
          <div className="col-span-2 md:col-span-4 flex justify-end">
            <button
              onClick={handleClearCustomer}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Cambiar Cliente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
