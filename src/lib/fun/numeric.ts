export type Scalar2 = (x: number, y: number) => number
export type Vector2 = (x: number, y: number) => [number, number]

/** Step used for every central difference below. */
const H = 1e-4

export function partialX(f: Scalar2, x: number, y: number, h = H): number {
  return (f(x + h, y) - f(x - h, y)) / (2 * h)
}

export function partialY(f: Scalar2, x: number, y: number, h = H): number {
  return (f(x, y + h) - f(x, y - h)) / (2 * h)
}

export function gradient(
  f: Scalar2,
  x: number,
  y: number,
  h = H,
): [number, number] {
  return [partialX(f, x, y, h), partialY(f, x, y, h)]
}

/** `[f_xx, f_xy, f_yy]` by central differences. */
export function hessian(
  f: Scalar2,
  x: number,
  y: number,
  h = 1e-3,
): [number, number, number] {
  const center = f(x, y)
  const fxx = (f(x + h, y) - 2 * center + f(x - h, y)) / (h * h)
  const fyy = (f(x, y + h) - 2 * center + f(x, y - h)) / (h * h)
  const fxy =
    (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) /
    (4 * h * h)
  return [fxx, fxy, fyy]
}

/** ∂P/∂x + ∂Q/∂y */
export function divergence(f: Vector2, x: number, y: number, h = H): number {
  const [px] = f(x + h, y)
  const [mx] = f(x - h, y)
  const [, py] = f(x, y + h)
  const [, my] = f(x, y - h)
  return (px - mx) / (2 * h) + (py - my) / (2 * h)
}

/** The scalar curl of a planar field: ∂Q/∂x − ∂P/∂y */
export function curl(f: Vector2, x: number, y: number, h = H): number {
  const [, qx] = f(x + h, y)
  const [, qmx] = f(x - h, y)
  const [py] = f(x, y + h)
  const [pmy] = f(x, y - h)
  return (qx - qmx) / (2 * h) - (py - pmy) / (2 * h)
}

/** One classical Runge-Kutta step of ẋ = F(x). */
export function rk4(
  field: Vector2,
  x: number,
  y: number,
  dt: number,
): [number, number] {
  const [k1x, k1y] = field(x, y)
  const [k2x, k2y] = field(x + (dt / 2) * k1x, y + (dt / 2) * k1y)
  const [k3x, k3y] = field(x + (dt / 2) * k2x, y + (dt / 2) * k2y)
  const [k4x, k4y] = field(x + dt * k3x, y + dt * k3y)
  return [
    x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y),
  ]
}

/** Gauss-Legendre nodes on [0,1]; four is exact through degree seven. */
const GL_NODES = [0.0694318442, 0.3300094782, 0.6699905218, 0.9305681558]
const GL_WEIGHTS = [0.1739274226, 0.3260725774, 0.3260725774, 0.1739274226]

export type Curve2 = (t: number) => [number, number]

/**
 * The line integral of F.dr along a plane curve, by composite Gauss-Legendre.
 * Accurate to well past display precision, so two paths that agree in theory
 * agree on screen too.
 */
export function lineIntegral(
  field: Vector2,
  curve: Curve2,
  tMin: number,
  tMax: number,
  panels = 160,
): number {
  const step = (tMax - tMin) / panels
  let total = 0

  for (let panel = 0; panel < panels; panel++) {
    const start = tMin + panel * step
    for (let k = 0; k < GL_NODES.length; k++) {
      const t = start + GL_NODES[k] * step
      const [ax, ay] = curve(t + H)
      const [bx, by] = curve(t - H)
      const dx = (ax - bx) / (2 * H)
      const dy = (ay - by) / (2 * H)
      const [x, y] = curve(t)
      const [p, q] = field(x, y)
      total += GL_WEIGHTS[k] * step * (p * dx + q * dy)
    }
  }

  return total
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function hypot(x: number, y: number): number {
  return Math.sqrt(x * x + y * y)
}

/**
 * Round to a "nice" number for axis ticks and level spacing: 1, 2, 5 or 10
 * times a power of ten.
 */
export function niceStep(raw: number): number {
  if (!(raw > 0) || !Number.isFinite(raw)) return 1
  const power = 10 ** Math.floor(Math.log10(raw))
  const scaled = raw / power
  const step = scaled < 1.5 ? 1 : scaled < 3 ? 2 : scaled < 7 ? 5 : 10
  return step * power
}

/**
 * Like `fmt`, but drops to exponential for values too small to show any
 * significant figures at fixed precision — a volume element of 8e-5 reads as
 * "0.00008", which looks like a rounding artefact rather than a measurement.
 */
export function fmtSmall(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "—"
  if (value !== 0 && Math.abs(value) < 0.001) return value.toExponential(3)
  return fmt(value, digits)
}

/** Format for on-canvas readouts: short, stable width, no `-0`. */
export function fmt(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—"
  const rounded = Number(value.toFixed(digits))
  return (Object.is(rounded, -0) ? 0 : rounded).toFixed(digits)
}
