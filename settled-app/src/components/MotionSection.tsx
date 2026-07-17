"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  /** Order in the page stagger sequence (0-based). */
  index?: number;
  delayStep?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

const ease = [0.25, 0.1, 0.25, 1] as const;

export function MotionSection({
  children,
  className,
  index = 0,
  delayStep = 0.07,
  ...rest
}: MotionSectionProps) {
  return (
    <motion.div
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
    </motion.div>
  );
}
