import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import type { PaginationState, Table } from "@tanstack/react-table";

interface Props<T>{
    table: Table<T>;
    pagination: PaginationState;
}

export const Pagination = <T,>({ table, pagination }: Props<T>) => {
  return (
    <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
          <ChevronRight />
        </Button>

        <span className="flex items-center gap-1 text-sm text-gray-600">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>

        <Select value={`${pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder={`Mostrar ${pagination.pageSize}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filas por página</SelectLabel>
              {[3, 5, 10, 20, 50].map((size) => (
                <SelectItem
                  key={size}
                  value={`${size}`}
                >{size}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
  )
}
