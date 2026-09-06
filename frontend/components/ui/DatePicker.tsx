"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { tr } from "date-fns/locale";
import { format } from "date-fns";
import { Popover } from "@base-ui/react";
import clsx from "clsx";
import "react-day-picker/style.css";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
  hasError?: boolean;
}

export function DatePicker({ value, onChange, className, hasError }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const displayValue = value ? format(value, "d MMM yyyy", { locale: tr }) : "";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={clsx(
          "w-full rounded-[var(--radius-md)] border px-4 py-2 text-left text-ink font-sans",
          "transition-[border-color,box-shadow,background-color] duration-300 ease-out",
          "focus:outline-none",
          "bg-parchment/60",
          hasError
            ? "border-[rgba(248,113,113,0.5)] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
            : "border-[var(--hairline)] focus:border-amber focus:shadow-[0_0_0_1px_var(--color-amber)]",
          !displayValue && "text-muted/60",
          className
        )}
      >
        {displayValue || "Tarih seçin"}
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup
            className={clsx(
              "z-50 rounded-[var(--radius-md)] border border-[var(--hairline)] bg-parchment p-4 shadow-xl",
              "[&_.rdp-root]:[--rdp-accent-color:var(--color-amber)] [&_.rdp-root]:[--rdp-background-color:var(--color-sand)]",
              "[&_.rdp-day_button]:rounded-full [&_.rdp-day_button:hover]:bg-sand [&_.rdp-day_button:hover]:text-amber-light",
              "[&_.rdp-selected]:border [&_.rdp-selected]:border-amber [&_.rdp-selected]:text-amber [&_.rdp-selected]:bg-transparent",
              "[&_.rdp-today]:text-amber-light",
              "[&_.rdp-day_button]:text-lg [&_.rdp-day_button]:font-hand",
              "[&_.rdp-caption_label]:font-hand [&_.rdp-caption_label]:text-2xl [&_.rdp-caption_label]:text-amber",
              "[&_.rdp-nav_button]:text-amber hover:[&_.rdp-nav_button]:text-amber-light"
            )}
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
              locale={tr}
              numberOfMonths={1}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
