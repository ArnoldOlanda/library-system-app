import { useEffect, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import type { Pagination } from '@/interfaces';

interface Params<T extends Pagination, U> {
  key: keyof T;
  data?: T;
  columns: ColumnDef<U>[];
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
}

export const useTable = <T extends Pagination, U>({
  key,
  data,
  columns,
  onPageSizeChange,
  onPageChange,
}: Params<T, U>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: data ? data.offset - 1 : 0,
    pageSize: data?.limit || 10,
  });

  const table = useReactTable({
    data: (data?.[key] ?? []) as U[],
    columns,
    pageCount: data?.pages || 0,
    rowCount: data?.total || 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;
      if (newPagination.pageSize !== pagination.pageSize) {
        onPageSizeChange(newPagination.pageSize);
      }
      if (newPagination.pageIndex !== pagination.pageIndex) {
        onPageChange(newPagination.pageIndex + 1);
      }
    },
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  useEffect(() => {
    if (data) {
      setPagination({
        pageIndex: data.offset - 1,
        pageSize: data.limit,
      });
    }
  }, [data]);

  return { pagination, setPagination, table };
};
