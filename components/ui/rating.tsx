"use client";
import { cn } from "@lib/utils";
import { LucideProps, Star, StarHalf } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import {
  useState,
  useEffect,
  HTMLAttributes,
  ReactNode,
  MouseEvent,
  KeyboardEvent,
} from "react";

const ratingVariants = cva("", {
  variants: {
    variant: {
      default: "fill-primary stroke-primary",
      success: "fill-success stroke-success",
      warning: "fill-warning stroke-warning",
      destructive: "fill-destructive stroke-destructive",
      secondary: "fill-secondary stroke-secondary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const StarPlaceholder = ({
  variant,
  ...props
}: LucideProps & VariantProps<typeof ratingVariants>) => {
  return (
    <Star className={cn(ratingVariants({ variant }), "fill-none")} {...props} />
  );
};

StarPlaceholder.displayName = "StarPlaceholder";

const StarValue = ({
  className,
  fillValue = 0,
  variant,
  ...props
}: { fillValue: number } & LucideProps &
  VariantProps<typeof ratingVariants>) => {
  if (fillValue === 100) {
    return (
      <Star className={cn(ratingVariants({ variant }), className)} {...props} />
    );
  } else if (fillValue === 50) {
    return (
      <StarHalf
        className={cn(ratingVariants({ variant }), className)}
        {...props}
      />
    );
  } else {
    return null;
  }
};

StarValue.displayName = "StarValue";

interface CommonProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof ratingVariants> {
  max?: number;
  size?: LucideProps["size"];
  value?: number;
}

interface ReadableProps extends CommonProps {
  readonly: true;
}

interface WriteableProps extends Omit<CommonProps, "onChange"> {
  disabled?: boolean;
  endContent?: ReactNode;
  onChange?: (value: number) => void;
  readonly?: false;
  startContent?: ReactNode;
}

export type RatingProps = ReadableProps | WriteableProps;

const Rating = (props: RatingProps) => {
  const { value = 0 } = props;
  const [internalValue, setInternalValue] = useState<number>(value ?? 0);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  if (props.readonly === true) {
    const { className, max = 5, size = 12, variant } = props;
    const getFillValue = (index: number) => {
      const starValue = index + 1;
      if (value >= starValue) {
        return 100;
      } else if (value >= starValue - 0.5) {
        return 50;
      } else {
        return 0;
      }
    };

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn("flex items-center justify-center gap-1", className)}
          >
            {Array.from({ length: max })?.map((_, index) => (
              <div className="relative" key={index}>
                <StarPlaceholder size={size} variant={variant} />
                <StarValue
                  className="absolute inset-0"
                  fillValue={getFillValue(index)}
                  size={size}
                  variant={variant}
                />
              </div>
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {value} out of {max} stars
          </p>
        </TooltipContent>
      </Tooltip>
    );
  } else {
    const {
      className,
      disabled = false,
      endContent,
      max = 5,
      onChange,
      size = 16,
      startContent,
      variant,
      ...remainingProps
    } = props;

    const setValue = (newValue: number) => {
      if (!disabled) {
        setInternalValue(newValue);
        onChange?.(newValue);
      }
    };

    const getFillValue = (index: number) => {
      const currentValue = hoverValue ?? internalValue;
      const starValue = index + 1;

      if (currentValue >= starValue) {
        return 100;
      } else if (currentValue >= starValue - 0.5) {
        return 50;
      } else {
        return 0;
      }
    };

    const handleMouseMove = (
      event: MouseEvent<HTMLDivElement>,
      index: number,
    ) => {
      if (!disabled) {
        const { left, width } = event.currentTarget.getBoundingClientRect();
        const isHalf = event.clientX - left < width / 2;
        setHoverValue(isHalf ? index + 0.5 : index + 1);
      }
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
      if (!disabled) {
        const { left, width } = event.currentTarget.getBoundingClientRect();
        const isHalf = event.clientX - left < width / 2;
        setValue(isHalf ? index + 0.5 : index + 1);
      }
    };

    const handleMouseLeave = () => {
      if (!disabled) {
        setHoverValue(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!disabled) {
        const currentValue = internalValue;
        let newValue = currentValue;

        switch (event.key) {
          case "ArrowRight":
          case "ArrowUp":
            event.preventDefault();
            newValue = Math.min(currentValue + 0.5, max);
            break;
          case "ArrowLeft":
          case "ArrowDown":
            event.preventDefault();
            newValue = Math.max(currentValue - 0.5, 0);
            break;
          case "Home":
            event.preventDefault();
            newValue = 0;
            break;
          case "End":
            event.preventDefault();
            newValue = max;
            break;
          default:
            return;
        }
        setValue(newValue);
      }
    };

    return (
      <div
        className={cn(
          "has-focus:ring-ring border-border bg-input ring-offset-background flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 has-focus:ring-2 has-focus:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {startContent}
        <div
          aria-disabled={disabled}
          aria-label={`Rating: ${internalValue} out of ${max} stars`}
          aria-valuemax={max}
          aria-valuemin={0}
          aria-valuenow={internalValue}
          aria-valuetext={`${internalValue} out of ${max} stars`}
          className="flex w-full items-center justify-center gap-2 focus-visible:outline-none"
          onKeyDown={handleKeyDown}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          {...remainingProps}
        >
          {Array.from({ length: max })?.map((_, index) => (
            <div
              className="relative"
              key={index}
              onClick={(event) => handleClick(event, index)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={(event) => handleMouseMove(event, index)}
            >
              <StarPlaceholder size={size} variant={variant} />
              <StarValue
                className="absolute inset-0"
                fillValue={getFillValue(index)}
                size={size}
                variant={variant}
              />
            </div>
          ))}
        </div>
        {endContent}
      </div>
    );
  }
};

Rating.displayName = "Rating";

export { Rating };
