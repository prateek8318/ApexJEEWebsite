"use client";
import { cn } from "@lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";
import { Input } from "@components/ui/input";
import { Badge, BadgeProps } from "@components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

const SPLITTER_REGEX = /[\n#?=&\t/-]+/;

const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g;

interface TagInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> {
  endContent?: ReactNode;
  onChange?: (value: string[]) => void;
  placeholder?: string;
  startContent?: ReactNode;
  value?: string[];
  variant?: BadgeProps["variant"];
}

export const TagInput = ({
  ref,
  className,
  dir = "ltr",
  disabled,
  endContent,
  onChange,
  placeholder,
  startContent,
  value,
  variant,
  ...props
}: TagInputProps & {
  ref?: Ref<HTMLInputElement>;
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [isValueSelected, setIsValueSelected] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(value ?? []);

  const onBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim() !== "") {
      event.preventDefault();
      onValueChange(inputValue);
      setInputValue("");
    }
  };

  const onRemove = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
      if (onChange) {
        onChange(selectedValues.filter((item) => item !== value));
      }
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const tags = event.clipboardData.getData("text").split(SPLITTER_REGEX);
    const newValue = [...selectedValues];
    tags.forEach((item) => {
      const parsedItem = item.replaceAll(FORMATTING_REGEX, "").trim();
      if (parsedItem.length > 0 && !newValue.includes(parsedItem)) {
        newValue.push(parsedItem);
      }
    });
    setSelectedValues(newValue);
    if (onChange) {
      onChange(newValue);
    }
    setInputValue("");
  };

  const onSelect = (event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const selection = target.value.substring(
      target.selectionStart ?? 0,
      target.selectionEnd ?? 0,
    );
    setSelectedValue(selection);
    setIsValueSelected(selection === inputValue);
  };

  const onKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const moveNext = () =>
      setActiveIndex(
        activeIndex + 1 > selectedValues.length - 1 ? -1 : activeIndex + 1,
      );
    const movePrev = () =>
      setActiveIndex(
        activeIndex - 1 < 0 ? selectedValues.length - 1 : activeIndex - 1,
      );
    const moveCurrent = () =>
      setActiveIndex(
        activeIndex - 1 <= 0
          ? selectedValues.length - 1 === 0
            ? -1
            : 0
          : activeIndex - 1,
      );

    const target = event.currentTarget;
    switch (event.key) {
      case "ArrowLeft": {
        if (dir === "rtl" && selectedValues.length > 0 && activeIndex !== -1) {
          moveNext();
        } else if (
          dir === "ltr" &&
          selectedValues.length > 0 &&
          target.selectionStart === 0
        ) {
          movePrev();
        }
        break;
      }
      case "ArrowRight": {
        if (
          dir === "rtl" &&
          selectedValues.length > 0 &&
          target.selectionStart === 0
        ) {
          movePrev();
        } else if (
          dir === "ltr" &&
          selectedValues.length > 0 &&
          activeIndex !== -1
        ) {
          moveNext();
        }
        break;
      }
      case "Enter": {
        if (inputValue.trim() !== "") {
          event.preventDefault();
          onValueChange(inputValue);
          setInputValue("");
        }
        break;
      }
      case "Backspace": {
        if (
          selectedValues.length > 0 &&
          activeIndex !== -1 &&
          activeIndex < selectedValues.length
        ) {
          onRemove(selectedValues[activeIndex]);
          moveCurrent();
        } else if (
          selectedValue.length === 0 &&
          target.selectionStart === 0 &&
          (selectedValue === inputValue || isValueSelected)
        ) {
          onRemove(selectedValues[selectedValues.length - 1]);
        }
        break;
      }
      case "Escape": {
        setActiveIndex(activeIndex === -1 ? selectedValues.length - 1 : -1);
        break;
      }
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onValueChange = (value: string) => {
    if (!selectedValues.includes(value)) {
      setSelectedValues([...selectedValues, value]);
      if (onChange) {
        onChange([...selectedValues, value]);
      }
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  useEffect(() => {
    setSelectedValues(value ?? []);
  }, [value]);

  return (
    <div
      className={cn(
        "has-[:disabled]focus:ring-0 has-[:disabled]focus:ring-transparent has-[:disabled]focus:ring-offset-0 border-border bg-input ring-offset-background has-focus:ring-ring flex max-h-24 min-h-12 justify-between gap-2 overflow-x-hidden rounded-xl border px-3 py-2 has-focus:ring-2 has-focus:ring-offset-2 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      {startContent && (
        <span className="flex max-h-7 items-center">{startContent}</span>
      )}
      <div
        className="flex w-full flex-wrap items-center gap-2 overflow-x-hidden"
        dir={dir}
        {...props}
      >
        {selectedValues?.map((item, index) => (
          <TooltipProvider key={item}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  aria-disabled={disabled}
                  className="aria-disabled:focus:ring-transparentaria-disabled:focus:ring-offset-0 data-[active='true']:ring-ring relative flex max-w-56 cursor-pointer items-center gap-1 rounded px-1 aria-disabled:pointer-events-none aria-disabled:focus:ring-0 aria-disabled:focus:ring-transparent data-[active='true']:ring-2"
                  data-active={activeIndex === index}
                  tabIndex={activeIndex !== -1 ? 0 : activeIndex}
                  variant={variant}
                >
                  <span className="truncate text-xs">{item}</span>
                  <Button
                    aria-label={`Remove ${item}`}
                    className="hover:text-destructive size-4 rounded-full hover:bg-transparent"
                    disabled={disabled}
                    onMouseDown={onMouseDown}
                    onClick={() => onRemove(item)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <span className="sr-only">{`Remove ${item}`}</span>
                    <X size={16} />
                  </Button>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <Input
          aria-label="Input"
          className={cn(
            "h-7 min-w-fit flex-1 border-none p-0 has-focus:ring-0 has-focus:ring-transparent has-focus:ring-offset-0",
            activeIndex !== -1 && "caret-transparent",
          )}
          disabled={disabled}
          onBlur={onBlur}
          onChange={activeIndex === -1 ? onInputChange : undefined}
          onClick={() => setActiveIndex(-1)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onSelect={onSelect}
          placeholder={selectedValues?.length === 0 ? placeholder : ""}
          ref={ref}
          tabIndex={0}
          value={inputValue}
        />
      </div>
      {endContent && (
        <span className="flex max-h-7 items-center">{endContent}</span>
      )}
    </div>
  );
};

TagInput.displayName = "TagInput";
