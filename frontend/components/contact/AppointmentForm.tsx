"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Label";

interface FormValues {
  name: string;
  contact: string;
  idea: string;
  placement: string;
  size: string;
  reference: string;
  dates: string;
}

const INITIAL: FormValues = {
  name: "",
  contact: "",
  idea: "",
  placement: "",
  size: "",
  reference: "",
  dates: "",
};

type Errors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = "Adını ve soyadını yazar mısın?";

  if (!values.contact.trim()) {
    errors.contact = "E-posta ya da telefon numaranı bırak, sana dönelim.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact) &&
    !/^[0-9+()\s-]{7,}$/.test(values.contact)
  ) {
    errors.contact = "Geçerli bir e-posta ya da telefon numarası gir.";
  }

  if (!values.idea.trim() || values.idea.trim().length < 10) {
    errors.idea = "Fikrini biraz daha anlatır mısın? En az birkaç cümle yeterli.";
  }

  if (!values.placement.trim()) errors.placement = "Vücutta hangi bölgeyi düşünüyorsun?";
  if (!values.size) errors.size = "Yaklaşık bir boyut seç.";

  if (values.reference.trim() && !/^https?:\/\//.test(values.reference.trim())) {
    errors.reference = "Referans bağlantısı http:// veya https:// ile başlamalı.";
  }

  return errors;
}

export function AppointmentForm() {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/randevu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("request-failed");
      setStatus("success");
      setValues(INITIAL);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-amber/40 bg-amber/5 p-8">
        <Eyebrow className="text-amber">Alındı</Eyebrow>
        <p className="mt-3 text-lg text-ink">
          Talebin ulaştı. Genelde 2–3 iş günü içinde e-posta ya da telefon ile dönüş yapılıyor.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field label="Ad Soyad" error={errors.name}>
        <input
          type="text"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          className={inputClass(Boolean(errors.name))}
        />
      </Field>

      <Field label="E-posta veya Telefon" error={errors.contact}>
        <input
          type="text"
          value={values.contact}
          onChange={(event) => update("contact", event.target.value)}
          className={inputClass(Boolean(errors.contact))}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Bölge" error={errors.placement} hint="Örn. ön kol, sırt, baldır">
          <input
            type="text"
            value={values.placement}
            onChange={(event) => update("placement", event.target.value)}
            className={inputClass(Boolean(errors.placement))}
          />
        </Field>

        <Field label="Yaklaşık Boyut" error={errors.size}>
          <select
            value={values.size}
            onChange={(event) => update("size", event.target.value)}
            className={inputClass(Boolean(errors.size))}
          >
            <option value="">Seç</option>
            <option value="kucuk">Küçük (avuç içi)</option>
            <option value="orta">Orta (ön kol)</option>
            <option value="buyuk">Büyük (birden çok seans)</option>
          </select>
        </Field>
      </div>

      <Field label="Fikrini Anlat" error={errors.idea} hint="Ne düşündüğünü, ilham aldığın şeyleri kısaca yaz.">
        <textarea
          rows={5}
          value={values.idea}
          onChange={(event) => update("idea", event.target.value)}
          className={inputClass(Boolean(errors.idea))}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Referans Görsel Bağlantısı" error={errors.reference} hint="Opsiyonel">
          <input
            type="text"
            value={values.reference}
            onChange={(event) => update("reference", event.target.value)}
            className={inputClass(Boolean(errors.reference))}
          />
        </Field>

        <Field label="Tercih Ettiğin Tarih Aralığı" hint="Opsiyonel">
          <input
            type="text"
            value={values.dates}
            onChange={(event) => update("dates", event.target.value)}
            className={inputClass(false)}
          />
        </Field>
      </div>

      {status === "error" ? (
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-red-400">
          Bir şeyler ters gitti. Lütfen tekrar dene ya da doğrudan e-posta gönder.
        </p>
      ) : null}

      <Button type="submit" disabled={status === "submitting"} className="self-start">
        {status === "submitting" ? "Gönderiliyor…" : "Talebi Gönder"}
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return clsx(
    "w-full border bg-transparent px-4 py-3.5 text-ink transition-colors duration-200 ease-out placeholder:text-muted/60",
    hasError ? "border-red-400/70" : "border-sand focus:border-amber",
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
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">{label}</span>
      {children}
      {error ? (
        <span className="font-mono text-[0.7rem] text-red-400">{error}</span>
      ) : hint ? (
        <span className="font-mono text-[0.7rem] text-muted/70">{hint}</span>
      ) : null}
    </label>
  );
}
