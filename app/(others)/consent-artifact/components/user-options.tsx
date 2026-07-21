"use client";

import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, LayoutDashboard, ShieldOff } from "lucide-react";

type Props = {
  row: UserConsentType;
};

const UserOptions = ({ row }: Props) => {
  const router = useRouter();
  const isGranted = row.status === "GRANTED";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Update
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            router.push(`/consent-artifact/${row?.uuid}`)
          }
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Preference Center
        </DropdownMenuItem>
        {isGranted && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <ShieldOff className="mr-2 h-4 w-4" />
              Revoke
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserOptions;
