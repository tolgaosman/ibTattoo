"use client";

import { motion, useReducedMotion } from "motion/react";
import { pageTransition, pageTransitionSpec } from "@/lib/motion";

/**
 * Re-mounted on every navigation by the App Router. Gives each page a short,
 * honest enter animation — fade + a small rise, nothing users will see
 * hundreds of times a day, so a little motion here earns its keep.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransitionSpec}
    >
      {children}
    </motion.div>
  );
}
