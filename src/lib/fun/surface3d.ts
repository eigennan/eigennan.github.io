import type * as ThreeNamespace from "three"

import type { Three } from "./scene3d"

export type Vec3 = [number, number, number]
/** A parametrized surface patch: (u, v) in the domain to a point in space. */
export type Surface = (u: number, v: number) => Vec3
/** A vector field on space. */
export type Field3 = (x: number, y: number, z: number) => Vec3
/** A parametrized space curve. */
export type Curve3 = (t: number) => Vec3

export interface Domain {
  uMin: number
  uMax: number
  vMin: number
  vMax: number
}

export const sub3 = (a: Vec3, b: Vec3): Vec3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
]
export const add3 = (a: Vec3, b: Vec3): Vec3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
]
export const scale3 = (a: Vec3, k: number): Vec3 => [
  a[0] * k,
  a[1] * k,
  a[2] * k,
]
export const dot3 = (a: Vec3, b: Vec3) =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross3 = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
export const norm3 = (a: Vec3) => Math.hypot(a[0], a[1], a[2])

export function unit3(a: Vec3): Vec3 {
  const length = norm3(a)
  return length > 1e-12 ? scale3(a, 1 / length) : [0, 0, 1]
}

const STEP = 1e-4

/**
 * Centre and enclosing radius of a set of points, for aiming an orbit camera.
 * Targeting the origin instead leaves off-centre shapes running out of frame.
 */
export function boundsOf(samples: Vec3[]): { center: Vec3; radius: number } {
  const min: Vec3 = [Infinity, Infinity, Infinity]
  const max: Vec3 = [-Infinity, -Infinity, -Infinity]
  for (const point of samples) {
    for (let k = 0; k < 3; k++) {
      if (!Number.isFinite(point[k])) continue
      if (point[k] < min[k]) min[k] = point[k]
      if (point[k] > max[k]) max[k] = point[k]
    }
  }
  if (!Number.isFinite(min[0])) return { center: [0, 0, 0], radius: 1 }
  return {
    center: [
      (min[0] + max[0]) / 2,
      (min[1] + max[1]) / 2,
      (min[2] + max[2]) / 2,
    ],
    radius:
      Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2], 0.2) / 2,
  }
}

/** Samples a surface patch on a coarse lattice, for `boundsOf`. */
export function sampleSurface(r: Surface, d: Domain, n = 24): Vec3[] {
  const out: Vec3[] = []
  for (let j = 0; j <= n; j++) {
    for (let i = 0; i <= n; i++) {
      out.push(
        r(
          d.uMin + ((d.uMax - d.uMin) * i) / n,
          d.vMin + ((d.vMax - d.vMin) * j) / n,
        ),
      )
    }
  }
  return out
}

/** True area of a patch, by midpoint sum of |r_u x r_v| over its domain. */
export function patchArea(r: Surface, d: Domain, n = 40): number {
  const du = (d.uMax - d.uMin) / n
  const dv = (d.vMax - d.vMin) / n
  let total = 0
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      total +=
        norm3(
          normalVector(r, d.uMin + (i + 0.5) * du, d.vMin + (j + 0.5) * dv),
        ) *
        du *
        dv
    }
  }
  return total
}

/** ∂r/∂u by central difference. */
export function tangentU(r: Surface, u: number, v: number, h = STEP): Vec3 {
  return scale3(sub3(r(u + h, v), r(u - h, v)), 1 / (2 * h))
}

/** ∂r/∂v by central difference. */
export function tangentV(r: Surface, u: number, v: number, h = STEP): Vec3 {
  return scale3(sub3(r(u, v + h), r(u, v - h)), 1 / (2 * h))
}

/**
 * The surface normal r_u x r_v. Its *length* is the area element — the factor
 * that turns du dv into dS — so callers generally want both the direction and
 * the magnitude, and it is deliberately not normalized here.
 */
export function normalVector(r: Surface, u: number, v: number): Vec3 {
  return cross3(tangentU(r, u, v), tangentV(r, u, v))
}

export interface MeshResult {
  geometry: ThreeNamespace.BufferGeometry
  /** One entry per quad, in row-major (v outer, u inner) order. */
  faces: {
    center: Vec3
    normal: Vec3
    /** |r_u x r_v| du dv for this quad. */
    area: number
  }[]
}

/**
 * Builds a triangulated patch from a parametrization, plus the per-quad
 * centres, normals and areas the flux tools need. Normals come from the
 * parametrization itself rather than from `computeVertexNormals`, so the
 * orientation the maths implies is the orientation that gets drawn.
 */
export function parametricMesh(
  three: Three,
  r: Surface,
  domain: Domain,
  nu: number,
  nv: number,
): MeshResult {
  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []
  const faces: MeshResult["faces"] = []

  const du = (domain.uMax - domain.uMin) / nu
  const dv = (domain.vMax - domain.vMin) / nv

  for (let j = 0; j <= nv; j++) {
    const v = domain.vMin + j * dv
    for (let i = 0; i <= nu; i++) {
      const u = domain.uMin + i * du
      const point = r(u, v)
      const n = unit3(normalVector(r, u, v))
      positions.push(point[0], point[1], point[2])
      normals.push(n[0], n[1], n[2])
    }
  }

  const stride = nu + 1
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * stride + i
      const b = a + 1
      const c = a + stride + 1
      const d = a + stride
      indices.push(a, b, c, a, c, d)

      const uMid = domain.uMin + (i + 0.5) * du
      const vMid = domain.vMin + (j + 0.5) * dv
      const cross = normalVector(r, uMid, vMid)
      faces.push({
        center: r(uMid, vMid),
        normal: unit3(cross),
        area: norm3(cross) * du * dv,
      })
    }
  }

  const geometry = new three.BufferGeometry()
  geometry.setAttribute(
    "position",
    new three.Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute("normal", new three.Float32BufferAttribute(normals, 3))
  geometry.setIndex(indices)
  return { geometry, faces }
}

export interface FluxResult {
  total: number
  /** F·n per quad, aligned with `MeshResult.faces`. */
  perFace: number[]
  /** Largest |F·n|, for scaling a colour ramp. */
  peak: number
}

/**
 * ∬ F · (r_u x r_v) du dv by the midpoint rule, evaluated on the same quad
 * centres `parametricMesh` reports — so the number in the readout and the
 * colours on the surface are computed from identical samples.
 */
export function fluxThrough(
  field: Field3,
  faces: MeshResult["faces"],
  flip = false,
): FluxResult {
  const perFace: number[] = []
  let total = 0
  let peak = 0
  const sign = flip ? -1 : 1

  for (const face of faces) {
    const [x, y, z] = face.center
    const value = sign * dot3(field(x, y, z), face.normal)
    perFace.push(value)
    total += value * face.area
    peak = Math.max(peak, Math.abs(value))
  }

  return { total, perFace, peak: peak || 1 }
}

/**
 * The flux total alone, on a grid as fine as you like — decoupled from the
 * mesh that gets drawn. The midpoint rule's error grows with how sharply the
 * integrand varies, and a display mesh chosen for smooth shading is not always
 * fine enough to make a *comparison* between two integrals convincing.
 */
export function fluxIntegral(
  field: Field3,
  r: Surface,
  domain: Domain,
  nu: number,
  nv: number,
): number {
  const du = (domain.uMax - domain.uMin) / nu
  const dv = (domain.vMax - domain.vMin) / nv
  let total = 0

  for (let j = 0; j < nv; j++) {
    const v = domain.vMin + (j + 0.5) * dv
    for (let i = 0; i < nu; i++) {
      const u = domain.uMin + (i + 0.5) * du
      const cross = normalVector(r, u, v)
      const [x, y, z] = r(u, v)
      total += dot3(field(x, y, z), cross) * du * dv
    }
  }

  return total
}

/** Gauss-Legendre nodes on [0,1]; four is exact through degree seven. */
const NODES = [0.0694318442, 0.3300094782, 0.6699905218, 0.9305681558]
const WEIGHTS = [0.1739274226, 0.3260725774, 0.3260725774, 0.1739274226]

/**
 * ∮ F · dr along a parametrized curve, by composite Gauss-Legendre over `n`
 * panels. Accurate enough that a Stokes comparison can be reported to four
 * decimals without the quadrature error showing up as disagreement.
 */
export function circulation(
  field: Field3,
  curve: Curve3,
  tMin: number,
  tMax: number,
  n = 240,
): number {
  const h = (tMax - tMin) / n
  let total = 0

  for (let panel = 0; panel < n; panel++) {
    const t0 = tMin + panel * h
    for (let k = 0; k < NODES.length; k++) {
      const t = t0 + NODES[k] * h
      const derivative = scale3(
        sub3(curve(t + STEP), curve(t - STEP)),
        1 / (2 * STEP),
      )
      const [x, y, z] = curve(t)
      total += WEIGHTS[k] * h * dot3(field(x, y, z), derivative)
    }
  }

  return total
}

/** curl F by central differences. */
export function curl3(field: Field3, x: number, y: number, z: number): Vec3 {
  const h = 1e-4
  const fxp = field(x + h, y, z)
  const fxm = field(x - h, y, z)
  const fyp = field(x, y + h, z)
  const fym = field(x, y - h, z)
  const fzp = field(x, y, z + h)
  const fzm = field(x, y, z - h)
  return [
    (fyp[2] - fym[2]) / (2 * h) - (fzp[1] - fzm[1]) / (2 * h),
    (fzp[0] - fzm[0]) / (2 * h) - (fxp[2] - fxm[2]) / (2 * h),
    (fxp[1] - fxm[1]) / (2 * h) - (fyp[0] - fym[0]) / (2 * h),
  ]
}

/** div F by central differences. */
export function divergence3(
  field: Field3,
  x: number,
  y: number,
  z: number,
): number {
  const h = 1e-4
  return (
    (field(x + h, y, z)[0] - field(x - h, y, z)[0]) / (2 * h) +
    (field(x, y + h, z)[1] - field(x, y - h, z)[1]) / (2 * h) +
    (field(x, y, z + h)[2] - field(x, y, z - h)[2]) / (2 * h)
  )
}
