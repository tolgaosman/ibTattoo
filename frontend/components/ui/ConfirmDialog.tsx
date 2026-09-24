"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface PendingConfirm extends Required<Omit<ConfirmOptions, "title">> {
  title?: string;
  resolve: (value: boolean) => void;
}

type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? "Sil",
        cancelLabel: options.cancelLabel ?? "İptal",
        danger: options.danger ?? true,
        resolve,
      });
    });
  }, []);

  const close = useCallback(
    (value: boolean) => {
      pending?.resolve(value);
      setPending(null);
    },
    [pending],
  );

  useEffect(() => {
    if (!pending) return;
    confirmButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pending, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {pending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => close(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-message"
              onClick={(e) => e.stopPropagation()}
              className="soft-card w-full max-w-sm p-6"
            >
              <div className="flex items-start gap-3">
                {pending.danger && (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                )}
                <div>
                  {pending.title && (
                    <h2 id="confirm-dialog-title" className="font-serif text-xl text-amber-light">
                      {pending.title}
                    </h2>
                  )}
                  <p id="confirm-dialog-message" className="mt-1 text-sm text-ink">
                    {pending.message}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="px-4 py-2 text-sm text-muted hover:text-ink"
                >
                  {pending.cancelLabel}
                </button>
                <button
                  ref={confirmButtonRef}
                  type="button"
                  onClick={() => close(true)}
                  className={`soft-card--link rounded-md px-6 py-2 text-sm font-medium ${
                    pending.danger
                      ? "bg-red-500/90 text-white hover:bg-red-500"
                      : "bg-amber text-paper-deep hover:bg-amber-light"
                  }`}
                >
                  {pending.confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within a ConfirmProvider");
  return ctx;
}
