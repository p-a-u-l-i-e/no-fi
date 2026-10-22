"use client";
// Vendored from @fluid/use-fluid-hover (fluidfunctionalism.com), transpiled to JS.
// Update by re-fetching the registry item, not by editing here.
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect
} from "react";
function pickNearest({
  axis,
  point,
  rects,
  containerRect,
  scroll,
  border,
  layoutSize,
  isDisabled
}) {
  const scaleX = layoutSize.width > 0 ? containerRect.width / layoutSize.width : 1;
  const scaleY = layoutSize.height > 0 ? containerRect.height / layoutSize.height : 1;
  let closestIndex = null;
  let closestDistance = Infinity;
  let containingIndex = null;
  for (let index = 0; index < rects.length; index++) {
    const r = rects[index];
    if (!r) continue;
    if (isDisabled?.(index)) continue;
    if (axis === "xy") {
      const left = containerRect.left + (border.x + r.left - scroll.x) * scaleX;
      const top = containerRect.top + (border.y + r.top - scroll.y) * scaleY;
      const width = r.width * scaleX;
      const height = r.height * scaleY;
      if (point.x >= left && point.x <= left + width && point.y >= top && point.y <= top + height) {
        containingIndex = index;
      }
      const distance2 = Math.hypot(point.x - (left + width / 2), point.y - (top + height / 2));
      if (distance2 < closestDistance) {
        closestDistance = distance2;
        closestIndex = index;
      }
      continue;
    }
    const horizontal = axis === "x";
    const mousePos = horizontal ? point.x : point.y;
    const scale = horizontal ? scaleX : scaleY;
    const itemStart = (horizontal ? containerRect.left : containerRect.top) + ((horizontal ? border.x : border.y) + (horizontal ? r.left : r.top) - (horizontal ? scroll.x : scroll.y)) * scale;
    const itemSize = (horizontal ? r.width : r.height) * scale;
    if (mousePos >= itemStart && mousePos <= itemStart + itemSize) {
      containingIndex = index;
    }
    const distance = Math.abs(mousePos - (itemStart + itemSize / 2));
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }
  return containingIndex ?? closestIndex;
}
function isOwnEvent(e) {
  const { currentTarget, target } = e;
  if (!(currentTarget instanceof Node) || !(target instanceof Node)) return true;
  return currentTarget.contains(target);
}
const ACTIVE_ATTR = "data-fluid-hover-active";
const ACTIVE_INDEX_ATTR = "data-fluid-hover-active-index";
const ACTIVATOR_SELECTOR = "a[href], button, [role='menuitem'], [role='menuitemradio'], [role='menuitemcheckbox'], [role='option'], [role='radio'], [role='checkbox'], [role='tab'], [role='link'], [role='button']";
function resolveActivator(element) {
  if (element.matches(ACTIVATOR_SELECTOR) || element.hasAttribute("tabindex")) {
    return element;
  }
  return element.querySelector(ACTIVATOR_SELECTOR) ?? element;
}
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const measurementAttempts = 3;
function useFluidHover(containerRef, options = {}) {
  const { axis = "y", isItemDisabled, gapClick = true } = options;
  const gapClickMaxDistance = typeof gapClick === "object" ? gapClick.maxDistance ?? Infinity : Infinity;
  const itemsRef = useRef(/* @__PURE__ */ new Map());
  const [activeIndex, setActiveIndex] = useState(null);
  const activeIndexRef = useRef(null);
  useIsoLayoutEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  useEffect(() => {
    const container = containerRef.current;
    const items = itemsRef.current;
    if (activeIndex === null) container?.removeAttribute(ACTIVE_INDEX_ATTR);
    else container?.setAttribute(ACTIVE_INDEX_ATTR, String(activeIndex));
    const active = activeIndex === null ? void 0 : items.get(activeIndex);
    active?.setAttribute(ACTIVE_ATTR, "");
    return () => {
      active?.removeAttribute(ACTIVE_ATTR);
      if (activeIndex !== null) items.get(activeIndex)?.removeAttribute(ACTIVE_ATTR);
    };
  }, [activeIndex, containerRef]);
  const [itemRects, setItemRects] = useState([]);
  const [isMeasured, setIsMeasured] = useState(false);
  const itemRectsRef = useRef([]);
  const [session, setSession] = useState(0);
  const sessionRef = useRef(0);
  const sessionPendingRef = useRef(false);
  const rafIdRef = useRef(null);
  const remeasureRafIdRef = useRef(null);
  const runMeasurement = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    const rects = [];
    let everyItemHasLayout = true;
    itemsRef.current.forEach((element, index) => {
      const hasLayoutBox = element.offsetParent !== null || element.offsetWidth > 0 || element.offsetHeight > 0;
      if (!hasLayoutBox) {
        everyItemHasLayout = false;
        return;
      }
      let top = element.offsetTop;
      let left = element.offsetLeft;
      let ancestor = element.offsetParent;
      while (ancestor && ancestor !== container && container.contains(ancestor)) {
        top += ancestor.offsetTop + ancestor.clientTop;
        left += ancestor.offsetLeft + ancestor.clientLeft;
        ancestor = ancestor.offsetParent;
      }
      rects[index] = {
        top,
        height: element.offsetHeight,
        left,
        width: element.offsetWidth
      };
    });
    if (!everyItemHasLayout) return false;
    const prev = itemRectsRef.current;
    let changed = prev.length !== rects.length;
    for (let i = 0; !changed && i < rects.length; i++) {
      const p = prev[i];
      const r = rects[i];
      if (p === r) continue;
      changed = !p || !r || p.top !== r.top || p.left !== r.left || p.width !== r.width || p.height !== r.height;
    }
    if (changed) {
      itemRectsRef.current = rects;
      setItemRects(rects);
    }
    return true;
  }, [containerRef]);
  const measureItems = useCallback(() => {
    runMeasurement();
  }, [runMeasurement]);
  const scheduleMeasurement = useCallback(
    (attempts) => {
      const attempt = (attemptsLeft) => {
        if (remeasureRafIdRef.current !== null) {
          cancelAnimationFrame(remeasureRafIdRef.current);
        }
        remeasureRafIdRef.current = requestAnimationFrame(() => {
          remeasureRafIdRef.current = null;
          if (runMeasurement()) {
            setIsMeasured(true);
          } else if (attemptsLeft > 1) {
            attempt(attemptsLeft - 1);
          }
        });
      };
      attempt(attempts);
    },
    [runMeasurement]
  );
  const remeasure = useCallback(() => {
    setIsMeasured(false);
    scheduleMeasurement(measurementAttempts);
  }, [scheduleMeasurement]);
  const itemRoRef = useRef(null);
  const getItemRo = useCallback(() => {
    if (itemRoRef.current === null && typeof ResizeObserver !== "undefined") {
      itemRoRef.current = new ResizeObserver(
        () => scheduleMeasurement(measurementAttempts)
      );
    }
    return itemRoRef.current;
  }, [scheduleMeasurement]);
  const registerItem = useCallback(
    (index, element) => {
      if (element) {
        itemsRef.current.set(index, element);
        getItemRo()?.observe(element);
        if (index === activeIndexRef.current) element.setAttribute(ACTIVE_ATTR, "");
      } else {
        const previous = itemsRef.current.get(index);
        if (previous) itemRoRef.current?.unobserve(previous);
        previous?.removeAttribute(ACTIVE_ATTR);
        itemsRef.current.delete(index);
        if (index === activeIndexRef.current) {
          setActiveIndex(
            (current) => current === index && !itemsRef.current.has(index) ? null : current
          );
        }
      }
      remeasure();
    },
    [remeasure, getItemRo]
  );
  const handleMouseMove = useCallback(
    (e) => {
      if (!isOwnEvent(e)) return;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const container = containerRef.current;
        if (!container) return;
        const next = pickNearest({
          axis,
          point: { x: mouseX, y: mouseY },
          rects: itemRectsRef.current,
          containerRect: container.getBoundingClientRect(),
          scroll: { x: container.scrollLeft, y: container.scrollTop },
          border: { x: container.clientLeft, y: container.clientTop },
          layoutSize: { width: container.offsetWidth, height: container.offsetHeight },
          isDisabled: isItemDisabled ? (index) => {
            const el = itemsRef.current.get(index);
            return !!el && isItemDisabled(el);
          } : void 0
        });
        if (sessionPendingRef.current && next !== activeIndexRef.current) {
          sessionPendingRef.current = false;
          sessionRef.current += 1;
          setSession(sessionRef.current);
        }
        setActiveIndex(next);
      });
    },
    [axis, containerRef, isItemDisabled]
  );
  const handleMouseEnter = useCallback(() => {
    sessionPendingRef.current = true;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setActiveIndex(null);
  }, []);
  const handleClick = useCallback(
    (e) => {
      const target = e.target;
      if (!target) return;
      for (const element2 of itemsRef.current.values()) {
        if (element2.contains(target)) return;
      }
      if (!target.isConnected) return;
      if (!isOwnEvent(e)) return;
      const control = target.closest?.(
        "input, textarea, select, button, a, summary, [contenteditable], [role='textbox'], [role='searchbox'], [role='button']"
      );
      if (control) return;
      if (gapClick === false) return;
      const index = activeIndexRef.current;
      if (index === null) return;
      const element = itemsRef.current.get(index);
      if (!element || isItemDisabled?.(element)) return;
      if (gapClickMaxDistance !== Infinity) {
        const r = element.getBoundingClientRect();
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
        const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
        if (Math.hypot(dx, dy) > gapClickMaxDistance) return;
      }
      resolveActivator(element).click();
    },
    [isItemDisabled, gapClick, gapClickMaxDistance]
  );
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => scheduleMeasurement(measurementAttempts));
    ro.observe(container);
    return () => ro.disconnect();
  }, [containerRef, scheduleMeasurement]);
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (remeasureRafIdRef.current !== null) {
        cancelAnimationFrame(remeasureRafIdRef.current);
      }
      itemRoRef.current?.disconnect();
      itemRoRef.current = null;
    };
  }, []);
  return {
    activeIndex,
    setActiveIndex,
    itemRects,
    isMeasured,
    session,
    sessionRef,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick
    },
    registerItem,
    remeasure,
    measureItems
  };
}
function useRegisterFluidHoverItem(registerItem, index, ref) {
  useEffect(() => {
    if (!registerItem || index === void 0) return;
    registerItem(index, ref.current);
    return () => registerItem(index, null);
  }, [index, registerItem, ref]);
}
export {
  ACTIVE_ATTR,
  ACTIVE_INDEX_ATTR,
  isOwnEvent,
  pickNearest,
  useFluidHover,
  useRegisterFluidHoverItem
};
