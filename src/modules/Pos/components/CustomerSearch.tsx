import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useClientes } from '@/modules/Customers/hooks/useClientes';
import type { Cliente } from '@/modules/Customers/interfaces';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CustomerSearchProps {
  selectedCustomer: Cliente | null;
  onSelectCustomer: (customer: Cliente | null) => void;
}

export function CustomerSearch({ selectedCustomer, onSelectCustomer }: CustomerSearchProps) {
  const [open, setOpen] = useState(false);
  const { data: clientesData, isLoading } = useClientes(1, 100);

  const clientes = clientesData?.data.clientes || [];

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Buscar Cliente
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedCustomer ? selectedCustomer.nombre : "Seleccionar cliente..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar por nombre o DNI..." />
              <CommandList>
                <CommandEmpty>
                  {isLoading ? "Cargando..." : "No se encontraron clientes"}
                </CommandEmpty>
                <CommandGroup>
                  {clientes.map((cliente) => (
                    <CommandItem
                      key={cliente.id}
                      value={`${cliente.nombre} ${cliente.dni || ''}`}
                      onSelect={() => {
                        onSelectCustomer(cliente.id === selectedCustomer?.id ? null : cliente);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCustomer?.id === cliente.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{cliente.nombre}</span>
                        {cliente.dni && (
                          <span className="text-sm text-muted-foreground">DNI: {cliente.dni}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
