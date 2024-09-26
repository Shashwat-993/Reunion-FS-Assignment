"use client"

import React, { useState, useMemo } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnResizeMode,
  getGroupedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronRight, Eye, Filter, Group, SortAsc } from 'lucide-react'

type Product = {
  id: number
  name: string
  category: string
  subcategory: string
  createdAt: string
  updatedAt: string
  price: number
  salePrice: number | null
}

const data: Product[] = [
  {
    id: 1,
    name: "Nutrition Attachment",
    category: "Health",
    subcategory: "Nutrition",
    createdAt: "24-Mar-16",
    updatedAt: "24-Mar-16",
    price: 24.99,
    salePrice: 21.95,
  },
  // Add more sample data here...
]

export default function AdvancedDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [grouping, setGrouping] = useState<string[]>([])
  const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>('onChange')

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "subcategory",
      header: "Subcategory",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "salePrice",
      header: "Sale Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("salePrice"))
        const formatted = amount
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(amount)
          : "-"
        return <div className="font-medium">{formatted}</div>
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
      globalFilter,
    },
    enableColumnResizing: true,
    columnResizeMode,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto">
              <Eye className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Show/Hide Columns</h3>
              {table.getAllLeafColumns().map((column) => {
                return (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Switch
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {column.id}
                    </label>
                  </div>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <SortAsc className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sorting Options</h3>
              {table.getAllLeafColumns().map((column) => {
                return (
                  <Button
                    key={column.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => column.toggleSorting()}
                  >
                    {column.id}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => table.resetSorting()}
              >
                Clear Sort
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Filter Columns</h3>
              {table.getAllLeafColumns().map((column) => {
                return (
                  <div key={column.id}>
                    <h4 className="text-sm font-medium">{column.id}</h4>
                    <Input
                      placeholder={`Filter ${column.id}...`}
                      value={(column.getFilterValue() as string) ?? ""}
                      onChange={(event) => column.setFilterValue(event.target.value)}
                      className="max-w-sm mt-1"
                    />
                  </div>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <Group className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Create Groups</h3>
              <Select
                value={grouping[0]}
                onValueChange={(value) => setGrouping([value])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a column to group" />
                </SelectTrigger>
                <SelectContent>
                  {table.getAllLeafColumns().map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setGrouping([])}
              >
                Clear Grouping
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.getIsGrouped() ? (
                        <>
                          <Button
                            variant="ghost"
                            onClick={row.getToggleExpandedHandler()}
                            className="mr-2"
                          >
                            {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())} ({row.subRows.length})
                        </>
                      ) : cell.getIsAggregated() ? (
                        flexRender(
                          cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : cell.getIsPlaceholder() ? null : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}