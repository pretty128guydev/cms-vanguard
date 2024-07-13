
"use client";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";
import Link from "next/link";
import { useAuthContext } from "@/context/auth-provider";
import LoadingScreen from "@/components/shared/Loader";

export function ClaimTable({ columns, data, totalPages, tableDataLoading }) {
  const { isAdmin, isSuperAdmin, isAdjuster, userLoading } = useAuthContext();
  const [sorting, setSorting] = React.useState([]);
  const [claimFilters, setClaimFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setClaimFilters,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    state: {
      sorting,
      claimFilters,
      columnVisibility,
    },
  });
  const redirectLinkOnClickingRow = (row) => {
    // console.log(row);
    if (isAdmin || isSuperAdmin) {
      return `/claims/edit/${row.original.$id}`;
    } else if (isAdjuster) return `/claims/inspect/${row.original.$id}`;
    else return "/claims";
  };

  return (
    <div className="mt-4 shadow-lg px-4 rounded-md">
      {/* <div className=" flex md:hidden items-center">
        <Input
          placeholder="Filter Claim Number..."
          value={
            table.getColumn("carrier_claim_number")?.getFilterValue() ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("carrier_claim_number")
              ?.setFilterValue(event.target.value)
          }
          className="w-full ring-2 ring-neutral-800"
        />
      </div> */}
      <section className="flex justify-between py-4 items-center gap-2">
        {/* Search field */}
        {/* <div className=" hidden md:flex items-center">
          <Input
            placeholder="Filter Claim Number..."
            value={
              (table.getColumn("carrier_claim_number")?.getFilterValue()) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("carrier_claim_number")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm ring-2 ring-neutral-800"
          />
        </div> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto outline-none hover:bg-[#2F374B]">
              Filter Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-none mt-2" align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.header}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {!userLoading && (isAdmin || isSuperAdmin) && (
          <Button
            onClick={() => {
              !isAdjuster && router.push("/claims/create");
            }}
          >
            Create Claim
          </Button>
        )}
      </section>

      {/* This is the main table */}
      <div>
        <Table className="">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="text-md  uppercase " key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="font-[800] tracking-tight text-neutral-800"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-neutral-800">
            {table?.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={(e) => {
                    if (
                      e.target.tagName == "TD" ||
                      e.target.tagName == "TH" ||
                      e.target.tagName == "P"
                    ) {
                      const link = redirectLinkOnClickingRow(row);
                      const newTab = isAdmin || isSuperAdmin; // Check if it's admin or super admin
                      if (newTab) {
                        window.open(link, "_blank"); // Open in a new tab
                      } else {
                        router.push(link);
                      }
                    }
                  }}
                  className="odd:bg-[#ededed] cursor-pointer border-0 hover:bg-[#ededed] even:hover:bg-white"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Claims.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination of the table */}
      <Pagination totalPages={totalPages} table={table} />
    </div>
  );
}