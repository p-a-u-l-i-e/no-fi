"use client";
// Vendored from @fluid/use-fluid-hover (fluidfunctionalism.com), transpiled to JS.
// Update by re-fetching the registry item, not by editing here.
import {
  motion,
  AnimatePresence,
  useReducedMotion
} from "motion/react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/springs";
const fade = { duration: 0.08 };
const snap = { duration: 0 };
function toTarget(rect) {
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
}
function resolveHighlightTransition(transition, reduceMotion) {
  const positional = transition === false || reduceMotion ? snap : transition ?? spring.fast;
  return { ...positional, opacity: fade };
}
function resolveHighlightSource(props) {
  if (props.hover) {
    const { activeIndex, itemRects, isMeasured, session } = props.hover;
    const rect = !props.hidden && isMeasured && activeIndex !== null ? itemRects[activeIndex] ?? null : null;
    return { rect, session };
  }
  return { rect: props.rect, session: props.session };
}
function FluidHoverHighlight(props) {
  const { from, className, transition } = props;
  const { rect, session } = resolveHighlightSource(props);
  const reduceMotion = useReducedMotion() ?? false;
  return <AnimatePresence>
      {rect && <motion.div
    key={session}
    data-slot="fluid-hover-highlight"
    className={cn(
      "pointer-events-none absolute left-0 top-0 bg-hover",
      className
    )}
    initial={{ opacity: 0, ...toTarget(from ?? rect) }}
    animate={{ opacity: 1, ...toTarget(rect) }}
    exit={{ opacity: 0, transition: spring.fast.exit }}
    transition={resolveHighlightTransition(transition, reduceMotion)}
  />}
    </AnimatePresence>;
}
export {
  FluidHoverHighlight,
  resolveHighlightSource,
  resolveHighlightTransition,
  toTarget
};
