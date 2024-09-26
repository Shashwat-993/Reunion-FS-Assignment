"use client"

import React, { useState } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactSlider from 'react-slider'
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

  const [priceRange, setPriceRange] = useState([0, 100]) // Price range state
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]) // Date range state
  const [startDate, endDate] = dateRange

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
      cell: ({ row }) => {
        const date = row.getValue("createdAt")
        return moment(date).format('DD-MMM-YYYY HH:mm')
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        const date = row.getValue("updatedAt")
        return moment(date).format('DD-MMM-YYYY HH:mm')
      },
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
        
        {/* Show/Hide Columns Button */}
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

        {/* Sort Columns Button */}
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

        {/* Filter Columns Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Filter Columns</h3>

              {/* Date Range Filter */}
              <h4 className="text-sm font-medium">Created At</h4>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(dates) => setDateRange(dates as [Date | null, Date | null])}
                isClearable
              />

              {/* Price Range Filter */}
              <h4 className="text-sm font-medium">Price Range</h4>
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                min={0}
                max={100}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
              />
              <div>Price: {priceRange[0]} - {priceRange[1]}</div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Group Columns Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <Group className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Group Columns</h3>
              {table.getAllLeafColumns().map((column) => {
                return (
                  <Button
                    key={column.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => column.toggleGrouping()}
                  >
                    {column.id}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => table.resetGrouping()}
              >
                Clear Grouping
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table Rendering */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
        <Select
          value={table.getState().pagination.pageSize}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
