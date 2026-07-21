"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import UserOptions from "./user-options";

const getStatusVariant = (status: string) => {
  if (status === "GRANTED") return "success";
  if (status === "DENIED") return "destructive";
  if (status === "WITHDRAWN") return "warning";
  return "default";
};

const getStatusLabel = (status: string) => {
  if (status === "GRANTED") return "Granted";
  if (status === "DENIED") return "Denied";
  if (status === "WITHDRAWN") return "Withdrawn";
  return status;
};

export const myConsentColumns: ColumnDef<UserConsentType>[] = [
  {
    accessorKey: "consentId",
    cell: ({ row }) => (
      <div className="ml-4 font-semibold text-foreground tracking-tight">
        {row.original.consentId}
      </div>
    ),
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Consent Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "purpose",
    cell: ({ row }) => (
      <div className="ml-4 text-muted-foreground font-medium">{row.original.purpose}</div>
    ),
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Purpose
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    cell: ({ row }) => (
      <div className="ml-4">
        <Badge variant={getStatusVariant(row.original.status)}>
          {getStatusLabel(row.original.status)}
        </Badge>
      </div>
    ),
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "grantedDate",
    cell: ({ row }) => (
      <div className="ml-4 text-muted-foreground">{row.original.grantedDate}</div>
    ),
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Granted Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "expires",
    cell: ({ row }) => (
      <div className="ml-4 text-muted-foreground">{row.original.expires}</div>
    ),
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Expires
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div className="ml-4">
        <UserOptions row={row.original} />
      </div>
    ),
    header: () => <div className="ml-4 font-bold text-foreground">Actions</div>,
  },
];
