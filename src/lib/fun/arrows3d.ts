import type * as ThreeNamespace from "three"

import type { Three } from "./scene3d"
import { type Vec3, norm3 } from "./surface3d"

export interface Arrow3D {
  origin: Vec3
  /** Need not be normalized; only its direction is used. */
  direction: Vec3
  length: number
}

export interface ArrowFieldOptions {
  color: string
  /** Shaft radius as a fraction of each arrow's length. */
  thickness?: number
  /** Head length as a fraction of each arrow's length. */
  head?: number
  opacity?: number
  /** Draw from the origin (default) or centred on it. */
  anchor?: "start" | "center"
}

/**
 * A field of solid 3D arrows.
 *
 * Not lines: WebGL rasterizes `LineSegments` at exactly one device pixel and
 * ignores `linewidth` entirely, so line-based arrows are hairlines that vanish
 * against a shaded surface. These are real geometry — a cylinder shaft and a
 * cone head — so they take lighting, occlude correctly, and stay legible at any
 * canvas size.
 *
 * Both meshes are instanced, so a lattice of several hundred arrows costs two
 * draw calls rather than growing a vertex buffer.
 */
export function arrowField(
  three: Three,
  arrows: Arrow3D[],
  options: ArrowFieldOptions,
): ThreeNamespace.Group {
  const group = new three.Group()
  if (arrows.length === 0) return group

  const thickness = options.thickness ?? 0.045
  const headFraction = options.head ?? 0.34
  const transparent = options.opacity !== undefined && options.opacity < 1

  const material = new three.MeshStandardMaterial({
    color: options.color,
    roughness: 0.55,
    metalness: 0,
    transparent,
    opacity: options.opacity ?? 1,
  })

  // Unit-length prototypes along +Y, so one matrix places and scales each.
  const shaftGeometry = new three.CylinderGeometry(1, 1, 1, 8)
  const headGeometry = new three.ConeGeometry(1, 1, 12)

  const shafts = new three.InstancedMesh(shaftGeometry, material, arrows.length)
  const heads = new three.InstancedMesh(headGeometry, material, arrows.length)

  const dummy = new three.Object3D()
  const up = new three.Vector3(0, 1, 0)
  const direction = new three.Vector3()
  const quaternion = new three.Quaternion()

  arrows.forEach((arrow, index) => {
    const magnitude = norm3(arrow.direction)
    const length = arrow.length
    if (!(magnitude > 1e-12) || !(length > 1e-12)) {
      // Instanced meshes have no per-instance visibility, so park unused
      // slots at zero scale rather than leaving stale identity matrices.
      dummy.scale.setScalar(0)
      dummy.position.set(0, 0, 0)
      dummy.updateMatrix()
      shafts.setMatrixAt(index, dummy.matrix)
      heads.setMatrixAt(index, dummy.matrix)
      return
    }

    direction.set(
      arrow.direction[0] / magnitude,
      arrow.direction[1] / magnitude,
      arrow.direction[2] / magnitude,
    )
    quaternion.setFromUnitVectors(up, direction)

    const headLength = length * headFraction
    const shaftLength = length - headLength
    const radius = length * thickness
    const base = new three.Vector3(...arrow.origin)
    if (options.anchor === "center") {
      base.addScaledVector(direction, -length / 2)
    }

    dummy.quaternion.copy(quaternion)

    dummy.scale.set(radius, shaftLength, radius)
    dummy.position.copy(base).addScaledVector(direction, shaftLength / 2)
    dummy.updateMatrix()
    shafts.setMatrixAt(index, dummy.matrix)

    dummy.scale.set(radius * 2.4, headLength, radius * 2.4)
    dummy.position
      .copy(base)
      .addScaledVector(direction, shaftLength + headLength / 2)
    dummy.updateMatrix()
    heads.setMatrixAt(index, dummy.matrix)
  })

  shafts.instanceMatrix.needsUpdate = true
  heads.instanceMatrix.needsUpdate = true
  group.add(shafts, heads)
  return group
}

/** A single arrow, for the handful of places that want exactly one. */
export function singleArrow(
  three: Three,
  origin: Vec3,
  direction: Vec3,
  length: number,
  options: ArrowFieldOptions,
): ThreeNamespace.Group {
  return arrowField(three, [{ origin, direction, length }], options)
}
