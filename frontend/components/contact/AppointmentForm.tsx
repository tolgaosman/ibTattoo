"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { WHATSAPP_PHONE } from "@/lib/site";
import type { DateRange } from "react-day-picker";

interface FormValues {
  name: string;
  contact: string;
  idea: string;
  placement: string;
  size: string;
  dates: DateRange | undefined;
}

const INITIAL: FormValues = {
  name: "",
  contact: "",
  idea: "",
  placement: "",
  size: "",
  dates: undefined,
};

type Errors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = "Adını ve soyadını yazar mısın?";

  if (!values.idea.trim() || values.idea.trim().length < 10) {
    errors.idea = "Fikrini biraz daha anlatır mısın? En az birkaç cümle yeterli.";
  }

  if (!values.placement.trim()) errors.placement = "Vücutta hangi bölgeyi düşünüyorsun?";
  if (!values.size || isNaN(Number(values.size)) || Number(values.size) <= 0) {
    errors.size = "Lütfen santimetre cinsinden geçerli bir sayı gir.";
  }
  if (!values.dates?.from) {
    errors.dates = "Lütfen tercih ettiğin bir tarih aralığı seç.";
  }

  return errors;
}

export function AppointmentForm({ whatsappPhone = WHATSAPP_PHONE }: { whatsappPhone?: string }) {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const datesStr = values.dates?.from
      ? `${values.dates.from.toLocaleDateString("tr-TR")}${values.dates.to ? ` - ${values.dates.to.toLocaleDateString("tr-TR")}` : ""}`
      : undefined;

    setSubmitting(true);
    try {
      await fetch("/randevu-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          contact: values.contact,
          idea: values.idea,
          placement: values.placement,
          size: values.size,
          dates: datesStr,
        }),
      });
    } catch {
      // Kayıt başarısız olsa bile müşteriyi WhatsApp'a yönlendirmeye devam ediyoruz.
    } finally {
      setSubmitting(false);
    }

    const datesMessage = datesStr ? `\nTarih Aralığı: ${datesStr}` : "";
    const message = `Merhaba, dövme randevusu için yazıyorum.\n\nAd Soyad: ${values.name}\nİletişim: ${values.contact}\nBölge: ${values.placement}\nBoyut: ${values.size} cm\n\nFikir: ${values.idea}${datesMessage}`;

    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad Soyad *" error={errors.name}>
          <input
            type="text"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <Field label="İletişim (opsiyonel)" error={errors.contact} hint="Telefon veya Instagram">
          <input
            type="text"
            value={values.contact}
            onChange={(event) => update("contact", event.target.value)}
            className={inputClass(Boolean(errors.contact))}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bölge *" error={errors.placement} hint="Örn. ön kol, sırt, baldır">
          <input
            type="text"
            value={values.placement}
            onChange={(event) => update("placement", event.target.value)}
            className={inputClass(Boolean(errors.placement))}
          />
        </Field>

        <Field label="Yaklaşık Boyut (cm) *" error={errors.size}>
          <input
            type="number"
            min="1"
            placeholder="Örn. 15"
            value={values.size}
            onChange={(event) => update("size", event.target.value)}
            className={inputClass(Boolean(errors.size))}
          />
        </Field>
      </div>

      <Field label="Fikrini Anlat *" error={errors.idea} hint="Ne düşündüğünü, ilham aldığın şeyleri kısaca yaz.">
        <textarea
          rows={5}
          value={values.idea}
          onChange={(event) => update("idea", event.target.value)}
          className={inputClass(Boolean(errors.idea))}
        />
      </Field>

      <Field label="Tercih Ettiğin Tarih Aralığı *" error={errors.dates}>
        <DateRangePicker
          value={values.dates}
          onChange={(range) => update("dates", range)}
        />
      </Field>

      <Button
        type="submit"
        intent="whatsapp"
        size="sm"
        className="w-full sm:w-auto"
        disabled={submitting}
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
        WhatsApp&apos;tan Gönder
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return clsx(
    "w-full rounded-[var(--radius-md)] border bg-parchment/60 px-4 py-2 text-xl text-ink",
    "transition-[border-color,box-shadow,background-color] duration-300 ease-out",
    "placeholder:text-muted/60 focus:outline-none",
    // Focus warms the edge and lights a soft halo rather than snapping to a
    // hard amber rule. The :focus-visible ring in globals.css still covers
    // keyboard users on top of this.
    hasError
      ? "border-[rgba(248,113,113,0.5)] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
      : "border-[var(--hairline)] focus:border-[var(--hairline-warm)] focus:shadow-[0_0_0_4px_rgba(209,140,64,0.1)]",
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xl text-ink-soft">{label}</span>
      {children}
      {error ? (
        <span className="text-lg text-red-300/90">{error}</span>
      ) : hint ? (
        <span className="text-lg text-muted/80">{hint}</span>
      ) : null}
    </label>
  );
}
