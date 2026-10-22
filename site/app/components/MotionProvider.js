"use client";

import { MotionConfig } from "motion/react";

// Honors the OS reduced-motion setting: sliding pills snap into place, fades stay.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
