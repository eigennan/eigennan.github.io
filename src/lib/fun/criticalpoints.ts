import { type Scalar2, gradient, hessian, hypot } from "./numeric.ts"

export type CriticalKind = "minimum" | "maximum" | "saddle" | "degenerate"

export interface CriticalPoint {
  x: number
  y: number
  kind: CriticalKind
  /** The discriminant f_xx f_yy − f_xy². */
  discriminant: number
  value: number
}

export interface SearchBounds {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

/**
 * Classify a stationary point by the second derivative test.
 *
 * The discriminant decides first: negative means the surface climbs one way
 * and falls the other, which is a saddle no matter what else is true. Only
 * once it is positive does the sign of f_xx separate a bowl from a dome. Zero
 * decides nothing at all, which is a real answer and not a failure.
 */
export function classify(
  fxx: number,
  fxy: number,
  fyy: number,
  tolerance = 1e-6,
): { kind: CriticalKind; discriminant: number } {
  const discriminant = fxx * fyy - fxy * fxy
  if (Math.abs(discriminant) <= tolerance)
    return { kind: "degenerate", discriminant }
  if (discriminant < 0) return { kind: "saddle", discriminant }
  return { kind: fxx > 0 ? "minimum" : "maximum", discriminant }
}

/**
 * Finds the stationary points of `f` in a rectangle: seed Newton's method for
 * ∇f = 0 from a coarse lattice, then drop anything that wandered out of the
 * box or landed on a neighbour already found.
 */
export function findCriticalPoints(
  f: Scalar2,
  bounds: SearchBounds,
  seeds = 26,
): CriticalPoint[] {
  const found: CriticalPoint[] = []
  const spanX = bounds.xMax - bounds.xMin
  const spanY = bounds.yMax - bounds.yMin
  const merge = Math.min(spanX, spanY) * 0.02

  for (let i = 0; i <= seeds; i++) {
    for (let j = 0; j <= seeds; j++) {
      let x = bounds.xMin + (spanX * i) / seeds
      let y = bounds.yMin + (spanY * j) / seeds
      let converged = false

      for (let step = 0; step < 40; step++) {
        const [gx, gy] = gradient(f, x, y)
        if (!Number.isFinite(gx) || !Number.isFinite(gy)) break
        if (hypot(gx, gy) < 1e-10) {
          converged = true
          break
        }
        const [fxx, fxy, fyy] = hessian(f, x, y)
        const determinant = fxx * fyy - fxy * fxy
        if (Math.abs(determinant) < 1e-12) break
        // One Newton step on the gradient: solve H d = -grad.
        const dx = (-gx * fyy + gy * fxy) / determinant
        const dy = (-gy * fxx + gx * fxy) / determinant
        x += dx
        y += dy
        if (!Number.isFinite(x) || !Number.isFinite(y)) break
        if (hypot(dx, dy) < 1e-12) {
          converged = true
          break
        }
      }

      if (!converged) continue
      if (
        x < bounds.xMin ||
        x > bounds.xMax ||
        y < bounds.yMin ||
        y > bounds.yMax
      ) {
        continue
      }
      if (found.some((p) => hypot(p.x - x, p.y - y) < merge)) continue

      const [fxx, fxy, fyy] = hessian(f, x, y)
      const { kind, discriminant } = classify(fxx, fxy, fyy)
      found.push({ x, y, kind, discriminant, value: f(x, y) })
    }
  }

  return found
}
