"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ArrowUpDown, Link2 } from "lucide-react";
import Link from "next/link";
import Options from "./options";


const getStatusVariant = (status: string) => {
  if (status === "ACTIVE") return "success";
  if (status === "REVOKED") return "destructive";
  if (status === "EXPIRED") return "warning";
  return "default";
};

export const columns: ColumnDef<ConsentRecordType>[] = [
  {
    accessorKey: "consentId",
    accessorFn: row => row?.consentId,
    cell: ({ row }) => {
      const consentId = row?.original?.consentId;
      return <div className="ml-4 font-semibold text-slate-900 tracking-tight">{consentId}</div>;
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Consent ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "purpose",
    accessorFn: row => row?.purpose,
    cell: ({ row }) => {
      const purpose = row?.original?.purpose;
      return <div className="ml-4 text-slate-600 font-medium">{purpose}</div>;
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Purpose
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "notice",
    accessorFn: row => row?.notice,
    cell: () => {
      return (
        <div className="flex justify-center">
          <Link href="/consent-artifact/newsletter" className="text-primary hover:text-primary/80">
            <Link2 size={18} />
          </Link>
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Notice
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "platform",
    accessorFn: row => row?.platform,
    cell: ({ row }) => {
      const platform = row?.original?.platform;
      return <div className="ml-4 text-slate-600">{platform}</div>;
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Platform
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    accessorFn: row => row?.status,
    cell: ({ row }) => {
      const status = row?.original?.status;
      return (
        <div className="ml-4">
          <Badge variant={getStatusVariant(status)} className="whitespace-nowrap">
            {status}
          </Badge>
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    accessorFn: row => row?.date,
    cell: ({ row }) => {
      const date = row?.original?.date;
      return <div className="ml-4 text-slate-600">{date}</div>;
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Options record={row?.original} />,
    enableHiding: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
];
