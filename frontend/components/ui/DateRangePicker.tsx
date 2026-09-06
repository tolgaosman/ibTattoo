"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { tr } from "date-fns/locale";
import { format } from "date-fns";
import { Popover } from "@base-ui/react";
import clsx from "clsx";
import "react-day-picker/style.css";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
  hasError?: boolean;
}

export function DateRangePicker({ value, onChange, className, hasError }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  // Formatting the selected dates for the input display
  const displayValue = value?.from
    ? value.to
      ? `${format(value.from, "d MMM yyyy", { locale: tr })} - ${format(value.to, "d MMM yyyy", { locale: tr })}`
      : format(value.from, "d MMM yyyy", { locale: tr })
    : "";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={clsx(
          "w-full rounded-[var(--radius-md)] border px-4 py-2 text-left text-xl text-ink",
          "transition-[border-color,box-shadow,background-color] duration-300 ease-out",
          "focus:outline-none",
          // The background should match the other inputs
          "bg-parchment/60",
          hasError
            ? "border-[rgba(248,113,113,0.5)] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
            : "border-[var(--hairline)] focus:border-[var(--hairline-warm)] focus:shadow-[0_0_0_4px_rgba(209,140,64,0.1)]",
          !displayValue && "text-muted/60",
          className
        )}
      >
        {displayValue || "Tarih aralığı seçin"}
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup
            className={clsx(
              "z-50 rounded-[var(--radius-md)] border border-[var(--hairline)] bg-parchment p-4 shadow-xl",
              // Some basic overrides for react-day-picker to fit the amber theme
              "[&_.rdp-day_button:hover]:bg-sand [&_.rdp-day_button:hover]:text-amber-light",
              "[&_.rdp-selected]:bg-amber/20 [&_.rdp-selected]:text-amber [&_.rdp-selected]:font-bold",
              "[&_.rdp-range_middle]:bg-amber/10 [&_.rdp-range_middle]:text-ink",
              "[&_.rdp-day_button]:text-lg [&_.rdp-day_button]:font-hand",
              "[&_.rdp-caption_label]:font-hand [&_.rdp-caption_label]:text-2xl [&_.rdp-caption_label]:text-amber",
              "[&_.rdp-nav_button]:text-amber hover:[&_.rdp-nav_button]:text-amber-light"
            )}
          >
            <DayPicker
              mode="range"
              selected={value}
              onSelect={onChange}
              locale={tr}
              numberOfMonths={1}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
