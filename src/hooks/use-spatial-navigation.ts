import { useEffect } from "react"

type Direction = "up" | "down" | "left" | "right"

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ")

const DIRECTION_KEYS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
}

function isVisible(el: HTMLElement): boolean {
  if (el.offsetWidth === 0 && el.offsetHeight === 0) return false
  const style = getComputedStyle(el)
  return style.visibility !== "hidden" && style.display !== "none"
}

// Small tolerance for sub-pixel rendering / adjacent elements
const EDGE_TOLERANCE = 2

interface ScoredResult {
  priority: number
  distance: number
}

/**
 * Two-tier scoring using edge-based geometry.
 *
 * Priority 0 (best): candidate is in the direction AND overlaps on the
 *   perpendicular axis (same row for left/right, same column for up/down).
 *   Scored by primary-axis edge gap only.
 *
 * Priority 1: candidate is in the direction but doesn't overlap on the
 *   cross-axis. Scored by edge gap + heavily weighted perpendicular gap
 *   so aligned elements are always preferred.
 */
function score(
  source: DOMRect,
  target: DOMRect,
  direction: Direction,
): ScoredResult | null {
  let primaryGap: number
  switch (direction) {
    case "right":
      primaryGap = target.left - source.right
      break
    case "left":
      primaryGap = source.left - target.right
      break
    case "down":
      primaryGap = target.top - source.bottom
      break
    case "up":
      primaryGap = source.top - target.bottom
      break
  }

  if (primaryGap < -EDGE_TOLERANCE) return null
  primaryGap = Math.max(0, primaryGap)

  const isHorizontal = direction === "left" || direction === "right"

  const perpOverlap = isHorizontal
    ? Math.min(source.bottom, target.bottom) - Math.max(source.top, target.top)
    : Math.min(source.right, target.right) - Math.max(source.left, target.left)

  if (perpOverlap > 0) {
    return { priority: 0, distance: primaryGap }
  }

  const perpGap = isHorizontal
    ? target.top > source.bottom
      ? target.top - source.bottom
      : source.top - target.bottom
    : target.left > source.right
      ? target.left - source.right
      : source.left - target.right
  const absPerpGap = Math.max(0, perpGap)

  return { priority: 1, distance: primaryGap + absPerpGap * 3 }
}

function navigate(direction: Direction) {
  const focused = document.activeElement as HTMLElement | null
  if (!focused || focused === document.body) return

  const sourceRect = focused.getBoundingClientRect()
  const candidates = document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)

  let best: HTMLElement | null = null
  let bestPriority = 2
  let bestDistance = Number.POSITIVE_INFINITY

  for (const el of candidates) {
    if (el === focused || !isVisible(el)) continue
    const result = score(sourceRect, el.getBoundingClientRect(), direction)
    if (result === null) continue

    if (
      result.priority < bestPriority ||
      (result.priority === bestPriority && result.distance < bestDistance)
    ) {
      bestPriority = result.priority
      bestDistance = result.distance
      best = el
    }
  }

  if (best) {
    best.focus({ preventScroll: false })
  }
}

export function useSpatialNavigation() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const direction = DIRECTION_KEYS[e.key]
      if (!direction) return

      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      e.preventDefault()
      navigate(direction)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
}
