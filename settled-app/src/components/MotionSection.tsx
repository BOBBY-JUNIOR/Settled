"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay when using mount animation (index * delayStep). */
  index?: number;
  delayStep?: number;
  /**
   * `mount` — animate once on load (default for app pages).
   * `view` — fade/slide when first entering the viewport (landing sections).
   */
  mode?: "mount" | "view";
  as?: "div" | "section";
} & Omit<HTMLMotionProps<"div">, "children">;

const ease = [0.25, 0.1, 0.25, 1] as const;

export function MotionSection({
  children,
  className,
  index = 0,
  delayStep = 0.07,
  mode = "mount",
  as = "div",
  ...rest
}: MotionSectionProps) {
  const Component = as === "section" ? motion.section : motion.div;

  if (mode === "view") {
    return (
      <Component
        className={className}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
        transition={{
          duration: 0.5,
          delay: index * delayStep,
          ease,
        }}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * delayStep,
        ease,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
