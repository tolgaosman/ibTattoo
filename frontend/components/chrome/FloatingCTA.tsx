"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Stands in for the navbar we removed. The hero already carries its own
 * scattered section links, and the contact section is itself the booking form —
 * so this only exists for the stretch in between, and hides at both ends.
 *
 * Scroll-driven rather than IntersectionObserver: the two conditions are "past
 * the hero" and "contact not yet in reach", both of which are positions, not
 * visibility. One rAF-throttled handler reads them together.
 */
export function FloatingCTA() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let queued = false;

    const measure = () => {
      queued = false;
      const contact = document.getElementById("iletisim");
      const pastHero = window.scrollY > window.innerHeight * 0.75;
      const contactInReach = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.7
        : false;
      setShown(pastHero && !contactInReach);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className={clsx(
        "fixed right-4 top-4 z-40 transition-[opacity,transform] duration-300 ease-out sm:right-6 sm:top-6",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
      )}
    >
      <ButtonLink
        href="#iletisim"
        size="sm"
        data-cursor="book"
        tabIndex={shown ? undefined : -1}
        className="shadow-[0_10px_30px_-12px_rgba(0,0,0,0.85)]"
      >
        Randevu Al
      </ButtonLink>
    </div>
  );
}
