"use client";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { CalendarDays, ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { type DateRange as Range, DayPicker, Matcher } from "react-day-picker";
import {
  ComponentProps,
  ComponentRef,
  ReactNode,
  Ref,
  useEffect,
  useState,
} from "react";

export type DateRange = Range;

export type CalendarProps = ComponentProps<typeof DayPicker>;

export interface DateRangePickerProps extends Omit<
  CalendarProps,
  "classNames" | "disabled" | "mode" | "onSelect" | "selected"
> {
  disabled?: boolean;
  disabledRange?: Matcher | Matcher[];
  endContent?: ReactNode;
  onChange?: (dateRange?: DateRange) => void;
  placeholder?: string;
  required?: boolean;
  startContent?: ReactNode;
  value?: DateRange;
}

const DateRangePicker = ({
  ref,
  className,
  disabledRange,
  disabled,
  endContent,
  onChange,
  placeholder,
  required,
  startContent,
  value,
  ...props
}: DateRangePickerProps & {
  ref?: Ref<ComponentRef<typeof PopoverPrimitive.Content>>;
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<DateRange | undefined>(
    value,
  );

  const defaultDisabledRange = (date: Date) => {
    return date < new Date("1900-01-01");
  };

  const onSelect = (dateRange?: DateRange) => {
    setSelectedValue(dateRange);
    if (onChange) {
      onChange(dateRange);
    }
  };

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "border-border bg-input hover:bg-input w-full justify-between border px-3 py-2 text-sm font-normal disabled:pointer-events-auto disabled:cursor-not-allowed",
            !selectedValue && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
          size="lg"
          variant={"outline"}
        >
          {startContent ?? <CalendarDays size={16} />}
          <span className="w-full truncate text-left">
            {selectedValue?.from && selectedValue?.to
              ? `${format(new Date(selectedValue?.from), "MMM do, yyyy")} - ${format(new Date(selectedValue?.to), "MMM do, yyyy")}`
              : placeholder}
          </span>
          {endContent ?? <ChevronDown size={16} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-auto p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
        ref={ref}
      >
        <Calendar
          disabled={disabledRange ?? defaultDisabledRange}
          mode="range"
          onSelect={onSelect}
          required={required ?? true}
          selected={selectedValue}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
