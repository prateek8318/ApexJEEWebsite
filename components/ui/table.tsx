import { cn } from "@lib/utils";
import { HTMLAttributes, Ref, TdHTMLAttributes, ThHTMLAttributes } from "react";

const Table = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLTableElement> & {
  ref?: Ref<HTMLTableElement>;
}) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
);
Table.displayName = "Table";

const TableHeader = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: Ref<HTMLTableSectionElement>;
}) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

const TableBody = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: Ref<HTMLTableSectionElement>;
}) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
);
TableBody.displayName = "TableBody";

const TableFooter = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: Ref<HTMLTableSectionElement>;
}) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-muted/50 border-t font-medium last:[&>tr]:border-b-0",
      className,
    )}
    {...props}
  />
);
TableFooter.displayName = "TableFooter";

const TableRow = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & {
  ref?: Ref<HTMLTableRowElement>;
}) => (
  <tr
    ref={ref}
    className={cn(
      "data-[state=selected]:bg-muted hover:bg-muted/50 border-b transition-colors",
      className,
    )}
    {...props}
  />
);
TableRow.displayName = "TableRow";

const TableHead = ({
  ref,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement>;
}) => (
  <th
    ref={ref}
    className={cn(
      "text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
);
TableHead.displayName = "TableHead";

const TableCell = ({
  ref,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement>;
}) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
);
TableCell.displayName = "TableCell";

const TableCaption = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement> & {
  ref?: Ref<HTMLTableCaptionElement>;
}) => (
  <caption
    ref={ref}
    className={cn("text-muted-foreground mt-4 text-sm", className)}
    {...props}
  />
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
