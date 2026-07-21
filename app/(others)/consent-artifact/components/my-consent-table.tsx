"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRightLeft, ChevronLeft, ChevronRight, ListRestart, Search } from "lucide-react";
import { useDebounce } from "react-use";

type MyConsentTableProps = {
  data: UserConsentType[];
  columns: ColumnDef<UserConsentType>[];
};

const MyConsentTable = ({ data, columns }: MyConsentTableProps) => {
  const [filter, setFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  useDebounce(() => setGlobalFilter(filter), 500, [filter]);

  const resetFilters = () => {
    setFilter("");
    setGlobalFilter("");
    setColumnVisibility({});
    setSorting([]);
  };

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    sortDescFirst: false,
    state: { columnVisibility, globalFilter, pagination, sorting },
  });

  return (
    <>
      <div className="flex w-full flex-col items-center justify-end gap-1 py-3 sm:flex-row">
        <Input
          placeholder="Search consents..."
          startContent={<Search size={16} />}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 max-w-sm"
        />
        <div className="mt-2 flex w-full flex-col items-center gap-2 sm:mt-0 sm:w-auto sm:flex-row">
          <Button variant="outline" onClick={resetFilters} className="w-full lg:w-auto">
            <ListRestart size={16} />
            Reset
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full lg:w-auto">
                <ArrowRightLeft size={16} />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full flex-1 rounded-md border">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 font-bold text-gray-700">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-gray-50 hover:bg-gray-50/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-32 text-center text-gray-400">
                  No consents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4 py-8 text-sm text-muted-foreground font-medium">
        <div className="order-2 sm:order-1">
          {`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount() || 1}`}
        </div>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            variant="outline"
            className="h-10 px-4 rounded-lg border-gray-200 font-bold"
          >
            <ChevronLeft size={16} className="mr-1" />
            Prev
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="outline"
            className="h-10 px-4 rounded-lg border-gray-200 font-bold"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default MyConsentTable;
