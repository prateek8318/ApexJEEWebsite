"use client";
import { cn } from "@lib/utils";
import { Button } from "./button";
import { Separator } from "./separator";
import { Badge, BadgeProps } from "./badge";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Check, ChevronDown, Square, SquareCheckBig, X } from "lucide-react";
import {
  ButtonHTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useState,
} from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface Option {
  uuid: string;
  label: string;
  value: string;
  icon?: ReactNode;
}

interface CommonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  className?: string;
  emptyLabel?: string;
  endContent?: ReactNode;
  label?: string;
  options: Option[];
  placeholder?: string;
  startContent?: ReactNode;
}

interface SingleSelectProps extends CommonProps {
  maxItems?: never;
  onChange?: (value: string) => void;
  multiple?: false;
  value?: string;
  variant?: never;
}

interface MultiSelectProps extends CommonProps {
  maxItems?: number;
  onChange?: (value: string[]) => void;
  multiple: true;
  value?: string[];
  variant?: BadgeProps["variant"];
}

export type ComboboxProps = SingleSelectProps | MultiSelectProps;

export const Combobox = ({
  ref,
  className,
  emptyLabel,
  endContent,
  label,
  maxItems = 1,
  multiple,
  onChange,
  options,
  placeholder,
  startContent,
  value,
  variant,
  ...props
}: ComboboxProps & {
  ref?: Ref<HTMLButtonElement>;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    multiple ? value || [] : value || "",
  );

  const toggleOption = (value: string) => {
    if (multiple && typeof selectedValue === "object") {
      const newSelectedValue = selectedValue.includes(value)
        ? selectedValue.filter((currentValue) => currentValue !== value)
        : [...selectedValue, value];
      setSelectedValue(newSelectedValue);
      if (onChange) {
        onChange(newSelectedValue);
      }
    } else if (!multiple && typeof selectedValue === "string") {
      const newSelectedValue = selectedValue !== value ? value : "";
      setSelectedValue(newSelectedValue);
      if (onChange) {
        onChange(newSelectedValue);
      }
      setIsPopoverOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedValue(multiple ? [] : "");
    if (onChange) {
      if (multiple) {
        onChange([]);
      } else {
        onChange("");
      }
    }
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen((prevPopoverOpen) => !prevPopoverOpen);
  };

  const clearExtraOptions = () => {
    if (multiple && typeof selectedValue === "object") {
      const newSelectedValue = selectedValue.slice(0, maxItems);
      setSelectedValue(newSelectedValue);
      if (onChange) {
        onChange(newSelectedValue);
      }
    }
  };

  const toggleAll = () => {
    if (multiple && typeof selectedValue === "object") {
      if (selectedValue.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option?.value);
        setSelectedValue(allValues);
        if (onChange) {
          onChange(allValues);
        }
      }
    }
  };

  useEffect(() => {
    setSelectedValue(multiple ? value || [] : value || "");
  }, [multiple, value]);

  return (
    <div className={cn("w-full", className)}>
      <Popover
        modal={true}
        onOpenChange={setIsPopoverOpen}
        open={isPopoverOpen}
      >
        <PopoverTrigger asChild>
          <Button
            aria-expanded={isPopoverOpen}
            className={cn(
              "border-border bg-input hover:bg-input w-full justify-between border px-3 py-2 text-sm font-normal disabled:pointer-events-auto disabled:cursor-not-allowed",
              multiple && "h-auto min-h-12",
              selectedValue.length === 0 && "text-muted-foreground",
            )}
            onClick={handleTogglePopover}
            ref={ref}
            role="combobox"
            size="lg"
            variant="ghost"
            {...props}
          >
            {startContent}
            {multiple && typeof selectedValue === "object" ? (
              selectedValue.length > 0 ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1 overflow-x-hidden">
                    {selectedValue.slice(0, maxItems).map((value) => {
                      const option = options.find(
                        (option) => option?.value === value,
                      );
                      return (
                        <Badge
                          className="xs:max-w-32 max-w-20 text-[10px]"
                          key={option?.uuid}
                          variant={variant}
                        >
                          <span className="truncate">{option?.label}</span>
                          <X
                            className="cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleOption(value);
                            }}
                            size={12}
                          />
                        </Badge>
                      );
                    })}
                    {selectedValue.length > maxItems && (
                      <Badge
                        className="xs:max-w-32 max-w-20 text-[10px]"
                        variant={variant}
                      >
                        <span className="truncate">{`+ ${selectedValue.length - maxItems} more`}</span>
                        <X
                          className="cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            clearExtraOptions();
                          }}
                          size={12}
                        />
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <X
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClear();
                      }}
                      size={16}
                    />
                    <Separator
                      orientation="vertical"
                      className="flex h-full min-h-6"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex w-full items-center justify-between overflow-x-hidden">
                  <span className="truncate">{placeholder}</span>
                </div>
              )
            ) : (
              <div className="flex w-full items-center gap-1 overflow-x-hidden">
                {selectedValue ? (
                  <>
                    <span className="shrink-0">
                      {
                        options.find(
                          (option) => option?.value === selectedValue,
                        )?.icon
                      }
                    </span>
                    <span className="truncate">
                      {
                        options.find(
                          (option) => option?.value === selectedValue,
                        )?.label
                      }
                    </span>
                  </>
                ) : (
                  <span className="truncate">{placeholder}</span>
                )}
              </div>
            )}
            {endContent ?? <ChevronDown size={16} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-full p-0"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command className="max-w-64">
            <CommandInput placeholder="Search..." />
            <CommandList className="max-h-72">
              <CommandEmpty>
                {emptyLabel ? emptyLabel : "No results found!"}
              </CommandEmpty>
              {multiple && Array.isArray(selectedValue) ? (
                <CommandGroup heading={label}>
                  <CommandItem
                    key="all"
                    onSelect={toggleAll}
                    className="cursor-pointer"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 w-full">
                          {selectedValue.length === options.length ? (
                            <SquareCheckBig size={16} />
                          ) : (
                            <Square size={16} />
                          )}
                          <span>Select All</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Select All</span>
                      </TooltipContent>
                    </Tooltip>
                  </CommandItem>
                  {options?.map((option) => {
                    const isSelected = selectedValue.includes(option?.value);
                    return (
                      <CommandItem
                        className="cursor-pointer"
                        key={option?.uuid}
                        onSelect={() => toggleOption(option?.value)}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 w-full">
                              {isSelected ? (
                                <SquareCheckBig size={16} />
                              ) : (
                                <Square size={16} />
                              )}
                              {option.icon}
                              <span>{option?.label}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>{option?.label}</span>
                          </TooltipContent>
                        </Tooltip>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : (
                <CommandGroup heading={label}>
                  {options?.map((option) => {
                    const isSelected = selectedValue === option?.value;
                    return (
                      <CommandItem
                        key={option?.uuid}
                        onSelect={() => toggleOption(option?.value)}
                        value={option?.value}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 w-full">
                              <Check
                                className={cn(
                                  isSelected ? "visible" : "invisible",
                                )}
                                size={16}
                              />
                              {option.icon}
                              <span className="flex-1 truncate text-sm">
                                {option?.label}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>{option?.label}</span>
                          </TooltipContent>
                        </Tooltip>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

Combobox.displayName = "Combobox";
