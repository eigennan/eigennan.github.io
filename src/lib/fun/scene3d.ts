import type * as ThreeNamespace from "three"

import { type Palette, onThemeChange, readPalette } from "./theme"
import { addPointerDrag, addZoom } from "./pointer"
import { clamp } from "./numeric"

export type Three = typeof ThreeNamespace

let threePromise: Promise<Three> | null = null

/**
 * Loads Three.js on demand. Only the two genuinely three-dimensional toys pay
 * for it; every 2D page on /fun stays dependency-free.
 */
export function loadThree(): Promise<Three> {
  threePromise ??= import("three")
  return threePromise
}

export interface OrbitState {
  /** Rotation about the vertical (z) axis, in radians. */
  azimuth: number
  /** Angle up from the xy-plane, clamped away from the poles. */
  elevation: number
  distance: number
  target: [number, number, number]
}

export interface Scene3DHandle {
  readonly three: Three
  readonly scene: ThreeNamespace.Scene
  readonly camera: ThreeNamespace.PerspectiveCamera
  readonly palette: Palette
  readonly orbit: OrbitState
  /** Schedule one frame. */
  redraw: () => void
  setAnimating: (on: boolean) => void
  readonly reducedMotion: boolean
  dispose: () => void
}

export interface Scene3DOptions {
  canvas: HTMLCanvasElement
  /** Build the scene graph. Re-run whenever the theme changes. */
  build: (handle: Scene3DHandle) => void
  /** Per-frame hook; `elapsed` is seconds of animating time. */
  update?: (handle: Scene3DHandle, elapsed: number) => void
  orbit?: Partial<OrbitState>
  animate?: boolean
  /** Distance limits for wheel and pinch zoom. */
  distanceRange?: [number, number]
}

const MIN_ELEVATION = -1.45
const MAX_ELEVATION = 1.45

/**
 * A small orbiting WebGL stage: device-pixel-ratio sizing, drag-to-orbit,
 * wheel and pinch zoom, theme-aware rebuilds, an animation loop that pauses
 * offscreen, and a dispose that releases every geometry and material.
 *
 * Deliberately not Three's OrbitControls — the camera here is three numbers,
 * and hand-rolling it keeps the examples/jsm subpath out of the bundle.
 */
export async function mountScene3D(
  options: Scene3DOptions,
): Promise<Scene3DHandle> {
  const { canvas, build, update } = options
  const three = await loadThree()

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  const [minDistance, maxDistance] = options.distanceRange ?? [2, 40]

  const orbit: OrbitState = {
    azimuth: options.orbit?.azimuth ?? -0.9,
    elevation: options.orbit?.elevation ?? 0.62,
    distance: options.orbit?.distance ?? 9,
    target: options.orbit?.target ?? [0, 0, 0],
  }

  const renderer = new three.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setClearColor(0x000000, 0)

  const scene = new three.Scene()
  const camera = new three.PerspectiveCamera(42, 1, 0.1, 400)
  // Z-up, so the maths convention and the picture agree.
  camera.up.set(0, 0, 1)

  const state = {
    palette: readPalette(),
    animating: Boolean(options.animate) && !motionQuery.matches,
    reducedMotion: motionQuery.matches,
    elapsed: 0,
    last: 0,
    frame: 0,
    visible: true,
    disposed: false,
    width: 0,
    height: 0,
  }

  function placeCamera() {
    const [tx, ty, tz] = orbit.target
    const cos = Math.cos(orbit.elevation)
    camera.position.set(
      tx + orbit.distance * cos * Math.cos(orbit.azimuth),
      ty + orbit.distance * cos * Math.sin(orbit.azimuth),
      tz + orbit.distance * Math.sin(orbit.elevation),
    )
    camera.lookAt(tx, ty, tz)
  }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))
    if (width === state.width && height === state.height) return
    state.width = width
    state.height = height
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const handle: Scene3DHandle = {
    three,
    scene,
    camera,
    orbit,
    get palette() {
      return state.palette
    },
    get reducedMotion() {
      return state.reducedMotion
    },
    redraw,
    setAnimating(on: boolean) {
      const next = on && !state.reducedMotion
      if (next === state.animating) return
      state.animating = next
      state.last = 0
      if (next) pump()
      else redraw()
    },
    dispose() {
      state.disposed = true
      if (state.frame) cancelAnimationFrame(state.frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      stopThemeWatch()
      stopDrag()
      stopZoom()
      motionQuery.removeEventListener("change", onMotionChange)
      disposeChildren(scene)
      renderer.dispose()
    },
  }

  function paint() {
    if (state.disposed) return
    resize()
    placeCamera()
    renderer.render(scene, camera)
  }

  function redraw() {
    if (state.disposed || state.frame) return
    state.frame = requestAnimationFrame(() => {
      state.frame = 0
      paint()
      if (state.animating && state.visible) pump()
    })
  }

  function pump() {
    if (state.disposed || state.frame || !state.animating || !state.visible) {
      return
    }
    state.frame = requestAnimationFrame((now) => {
      state.frame = 0
      const delta = state.last ? (now - state.last) / 1000 : 0
      state.last = now
      state.elapsed += Math.min(delta, 1 / 15)
      update?.(handle, state.elapsed)
      paint()
      pump()
    })
  }

  let dragging = false
  let lastX = 0
  let lastY = 0

  const stopDrag = addPointerDrag(canvas, {
    onDown(info) {
      dragging = true
      lastX = info.x
      lastY = info.y
    },
    onMove(info) {
      if (!dragging) return
      orbit.azimuth -= (info.x - lastX) * 0.008
      orbit.elevation = clamp(
        orbit.elevation + (info.y - lastY) * 0.008,
        MIN_ELEVATION,
        MAX_ELEVATION,
      )
      lastX = info.x
      lastY = info.y
      redraw()
    },
    onUp() {
      dragging = false
    },
  })

  const stopZoom = addZoom(canvas, (factor) => {
    orbit.distance = clamp(orbit.distance / factor, minDistance, maxDistance)
    redraw()
  })

  const resizeObserver = new ResizeObserver(redraw)
  resizeObserver.observe(canvas)

  const intersectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting)
    if (visible === state.visible) return
    state.visible = visible
    state.last = 0
    if (visible) pump()
  })
  intersectionObserver.observe(canvas)

  const stopThemeWatch = onThemeChange(() => {
    state.palette = readPalette()
    disposeChildren(scene)
    build(handle)
    redraw()
  })

  const onMotionChange = () => {
    state.reducedMotion = motionQuery.matches
    if (state.reducedMotion) state.animating = false
    redraw()
  }
  motionQuery.addEventListener("change", onMotionChange)

  resize()
  build(handle)
  redraw()
  if (state.animating) pump()

  return handle
}

/** Empties a scene, releasing the GPU resources its children hold. */
export function disposeChildren(root: ThreeNamespace.Object3D): void {
  // `remove` mutates `children`, so drain from the end rather than iterating.
  while (root.children.length > 0) {
    const child = root.children[root.children.length - 1]
    root.remove(child)
    disposeObject(child)
  }
}

function disposeObject(object: ThreeNamespace.Object3D): void {
  object.traverse((node) => {
    const mesh = node as Partial<ThreeNamespace.Mesh>
    mesh.geometry?.dispose()
    const material = mesh.material
    if (Array.isArray(material)) {
      for (const entry of material) entry.dispose()
    } else {
      material?.dispose()
    }
  })
}

/**
 * The three coordinate axes as one line object, drawn through the origin.
 * `zReach` is separate because a surface's vertical extent rarely matches its
 * footprint, and an axis spike far above the graph just looks like a mistake.
 */
export function makeAxes(
  three: Three,
  reach: number,
  color: string,
  zReach = reach,
): ThreeNamespace.LineSegments {
  const points = [
    -reach,
    0,
    0,
    reach,
    0,
    0,
    0,
    -reach,
    0,
    0,
    reach,
    0,
    0,
    0,
    -zReach * 0.7,
    0,
    0,
    zReach,
  ]
  const geometry = new three.BufferGeometry()
  geometry.setAttribute("position", new three.Float32BufferAttribute(points, 3))
  return new three.LineSegments(
    geometry,
    new three.LineBasicMaterial({ color, transparent: true, opacity: 0.45 }),
  )
}

/** Standard three-point-ish lighting that reads well in both themes. */
export function addLights(
  three: Three,
  scene: ThreeNamespace.Scene,
  strength = 1,
): void {
  scene.add(new three.AmbientLight(0xffffff, 0.72 * strength))
  const key = new three.DirectionalLight(0xffffff, 0.85 * strength)
  key.position.set(4, -6, 9)
  scene.add(key)
  const fill = new three.DirectionalLight(0xffffff, 0.35 * strength)
  fill.position.set(-6, 4, 3)
  scene.add(fill)
}
