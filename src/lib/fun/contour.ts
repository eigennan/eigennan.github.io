import type { Scalar2 } from "./numeric"

export interface Bounds {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export interface Grid extends Bounds {
  /** Row-major, `ny + 1` rows of `nx + 1` samples, y increasing with row. */
  values: Float64Array
  nx: number
  ny: number
  min: number
  max: number
}

/** Sample `f` on a regular lattice once, so many levels share the work. */
export function sampleGrid(
  f: Scalar2,
  bounds: Bounds,
  nx: number,
  ny: number,
): Grid {
  const values = new Float64Array((nx + 1) * (ny + 1))
  const dx = (bounds.xMax - bounds.xMin) / nx
  const dy = (bounds.yMax - bounds.yMin) / ny
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY

  for (let j = 0; j <= ny; j++) {
    const y = bounds.yMin + j * dy
    for (let i = 0; i <= nx; i++) {
      const value = f(bounds.xMin + i * dx, y)
      values[j * (nx + 1) + i] = value
      if (Number.isFinite(value)) {
        if (value < min) min = value
        if (value > max) max = value
      }
    }
  }

  if (!Number.isFinite(min)) {
    min = 0
    max = 1
  }
  return { ...bounds, values, nx, ny, min, max }
}

/** A contour piece as `[x0, y0, x1, y1]` in world coordinates. */
export type Segment = [number, number, number, number]

/**
 * Marching squares. Saddle cells (cases 5 and 10) are resolved by the sign of
 * the cell's center average, which is what keeps a hyperbolic level set from
 * connecting across the wrong diagonal.
 */
export function contourSegments(grid: Grid, level: number): Segment[] {
  const { values, nx, ny } = grid
  const stride = nx + 1
  const dx = (grid.xMax - grid.xMin) / nx
  const dy = (grid.yMax - grid.yMin) / ny
  const segments: Segment[] = []

  const cross = (v0: number, v1: number) => {
    const denominator = v1 - v0
    return denominator === 0 ? 0.5 : (level - v0) / denominator
  }

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const a = values[j * stride + i]
      const b = values[j * stride + i + 1]
      const c = values[(j + 1) * stride + i + 1]
      const d = values[(j + 1) * stride + i]
      if (
        !Number.isFinite(a) ||
        !Number.isFinite(b) ||
        !Number.isFinite(c) ||
        !Number.isFinite(d)
      ) {
        continue
      }

      let code = 0
      if (a > level) code |= 1
      if (b > level) code |= 2
      if (c > level) code |= 4
      if (d > level) code |= 8
      if (code === 0 || code === 15) continue

      const x0 = grid.xMin + i * dx
      const y0 = grid.yMin + j * dy
      // Crossing points on the bottom, right, top and left edges.
      const bottom: [number, number] = [x0 + cross(a, b) * dx, y0]
      const right: [number, number] = [x0 + dx, y0 + cross(b, c) * dy]
      const top: [number, number] = [x0 + cross(d, c) * dx, y0 + dy]
      const left: [number, number] = [x0, y0 + cross(a, d) * dy]

      const push = (p: [number, number], q: [number, number]) => {
        segments.push([p[0], p[1], q[0], q[1]])
      }

      switch (code) {
        case 1:
        case 14:
          push(left, bottom)
          break
        case 2:
        case 13:
          push(bottom, right)
          break
        case 3:
        case 12:
          push(left, right)
          break
        case 4:
        case 11:
          push(right, top)
          break
        case 6:
        case 9:
          push(bottom, top)
          break
        case 7:
        case 8:
          push(left, top)
          break
        case 5:
        case 10: {
          const center = (a + b + c + d) / 4
          const connected = code === 5 ? center > level : center <= level
          if (connected) {
            push(bottom, right)
            push(left, top)
          } else {
            push(left, bottom)
            push(right, top)
          }
          break
        }
      }
    }
  }

  return segments
}

/** Evenly spaced levels spanning the grid, excluding the exact extremes. */
export function levelsFor(grid: Grid, count: number): number[] {
  const levels: number[] = []
  const span = grid.max - grid.min
  if (!(span > 0)) return levels
  for (let k = 1; k <= count; k++) {
    levels.push(grid.min + (span * k) / (count + 1))
  }
  return levels
}

export type ColorRamp = (t: number) => [number, number, number]

/**
 * Renders the grid as a smooth raster on an offscreen canvas, ready to
 * `drawImage` under the contour lines. Cheaper and better-looking than filling
 * marching-squares polygons, and it's what makes contour *spacing* read as
 * steepness.
 */
export function gridToImage(
  grid: Grid,
  ramp: ColorRamp,
  alpha = 255,
): HTMLCanvasElement {
  const width = grid.nx + 1
  const height = grid.ny + 1
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const image = ctx.createImageData(width, height)
  const span = grid.max - grid.min || 1

  for (let j = 0; j < height; j++) {
    // Canvas rows run top-down; the grid's rows run bottom-up.
    const row = height - 1 - j
    for (let i = 0; i < width; i++) {
      const value = grid.values[row * width + i]
      const offset = (j * width + i) * 4
      if (!Number.isFinite(value)) {
        image.data[offset + 3] = 0
        continue
      }
      const [r, g, b] = ramp((value - grid.min) / span)
      image.data[offset] = r
      image.data[offset + 1] = g
      image.data[offset + 2] = b
      image.data[offset + 3] = alpha
    }
  }

  ctx.putImageData(image, 0, 0)
  return canvas
}
