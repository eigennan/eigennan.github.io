import { type Palette, onThemeChange, readPalette } from "./theme"

export interface FunContext {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  /** Logical (CSS pixel) size; the backing store is this times `dpr`. */
  readonly width: number
  readonly height: number
  readonly dpr: number
  readonly palette: Palette
  readonly reducedMotion: boolean
  /** Schedule one frame. Safe to call many times per tick. */
  redraw: () => void
  /** Turn the continuous animation loop on or off. */
  setAnimating: (on: boolean) => void
  readonly animating: boolean
}

export interface FunAppHandle {
  redraw: () => void
  setAnimating: (on: boolean) => void
  readonly animating: boolean
  dispose: () => void
}

export interface FunAppOptions {
  canvas: HTMLCanvasElement
  /** Called once, before the first draw, to wire up controls. */
  setup?: (context: FunContext) => void
  /** `elapsed` is seconds of *animating* time, paused while offscreen. */
  draw: (context: FunContext, elapsed: number) => void
  /** Start with the animation loop running. */
  animate?: boolean
}

/**
 * Mounts a canvas visualization: device-pixel-ratio sizing, resize handling,
 * theme-aware repaints, an animation loop that pauses when the canvas scrolls
 * out of view, and a `dispose` that unwinds all of it.
 */
export function mountFunApp(options: FunAppOptions): FunAppHandle {
  const { canvas, setup, draw } = options
  const maybeContext = canvas.getContext("2d")
  if (!maybeContext) {
    return {
      redraw() {},
      setAnimating() {},
      animating: false,
      dispose() {},
    }
  }
  const ctx = maybeContext

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    palette: readPalette(),
    animating: Boolean(options.animate) && !motionQuery.matches,
    reducedMotion: motionQuery.matches,
    elapsed: 0,
    visible: true,
    frame: 0,
    last: 0,
    disposed: false,
  }

  const context: FunContext = {
    canvas,
    ctx,
    get width() {
      return state.width
    },
    get height() {
      return state.height
    },
    get dpr() {
      return state.dpr
    },
    get palette() {
      return state.palette
    },
    get reducedMotion() {
      return state.reducedMotion
    },
    get animating() {
      return state.animating
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
  }

  function resize(): void {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))
    if (width === state.width && height === state.height && dpr === state.dpr) {
      return
    }
    state.width = width
    state.height = height
    state.dpr = dpr
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
  }

  function paint(): void {
    if (state.disposed) return
    resize()
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0)
    ctx.clearRect(0, 0, state.width, state.height)
    draw(context, state.elapsed)
  }

  function redraw(): void {
    if (state.disposed || state.frame) return
    state.frame = requestAnimationFrame(() => {
      state.frame = 0
      paint()
      if (state.animating && state.visible) pump()
    })
  }

  function pump(): void {
    if (state.disposed || state.frame || !state.animating || !state.visible) {
      return
    }
    state.frame = requestAnimationFrame((now) => {
      state.frame = 0
      const delta = state.last ? (now - state.last) / 1000 : 0
      state.last = now
      // Clamp so a backgrounded tab doesn't resume with a huge jump.
      state.elapsed += Math.min(delta, 1 / 15)
      paint()
      pump()
    })
  }

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
    redraw()
  })

  const onMotionChange = () => {
    state.reducedMotion = motionQuery.matches
    if (state.reducedMotion) state.animating = false
    redraw()
  }
  motionQuery.addEventListener("change", onMotionChange)

  resize()
  setup?.(context)
  redraw()
  if (state.animating) pump()

  return {
    redraw,
    setAnimating: (on: boolean) => {
      context.setAnimating(on)
    },
    get animating() {
      return state.animating
    },
    dispose() {
      state.disposed = true
      if (state.frame) cancelAnimationFrame(state.frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      stopThemeWatch()
      motionQuery.removeEventListener("change", onMotionChange)
    },
  }
}

/**
 * Wires an initializer to Astro's view transitions.
 *
 * `<ClientRouter />` is enabled site-wide, so `astro:page-load` and
 * `astro:after-swap` both fire per navigation. The `data-fun-mounted` flag on
 * the (freshly swapped in) root keeps the second call from double-binding, and
 * resets naturally on the next real navigation.
 */
export function registerFunApp(
  rootSelector: string,
  mount: (root: HTMLElement) => () => void,
): void {
  let dispose: (() => void) | null = null

  const init = () => {
    const root = document.querySelector<HTMLElement>(rootSelector)
    if (!root || root.dataset.funMounted === "true") return
    root.dataset.funMounted = "true"
    dispose = mount(root)
  }

  const teardown = () => {
    dispose?.()
    dispose = null
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true })
  } else {
    init()
  }
  document.addEventListener("astro:page-load", init)
  document.addEventListener("astro:after-swap", init)
  document.addEventListener("astro:before-swap", teardown)
}
