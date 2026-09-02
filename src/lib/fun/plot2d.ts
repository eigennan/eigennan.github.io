import type { Bounds } from "./contour"
import { niceStep } from "./numeric"
import { alpha } from "./theme"

export interface StrokeOptions {
  color: string
  width?: number
  dash?: number[]
  cap?: CanvasLineCap
}

export interface ArrowOptions extends StrokeOptions {
  /** Arrowhead length in screen pixels, so heads stay legible at any zoom. */
  head?: number
}

export interface TextOptions {
  color: string
  size?: number
  align?: CanvasTextAlign
  baseline?: CanvasTextBaseline
  weight?: string
  /** Paint a rounded plate behind the text so it stays readable over a plot. */
  plate?: string
  /** Use the site's monospace stack — for numeric readouts that must not jitter. */
  mono?: boolean
}

/**
 * A square-aspect world/screen mapping for 2D canvas plots. `fit` is called
 * once per frame, so the plot survives resizes without any cached geometry.
 */
export class Plot2D {
  scale = 1
  originX = 0
  originY = 0
  width = 0
  height = 0
  bounds: Bounds = { xMin: -1, xMax: 1, yMin: -1, yMax: 1 }

  /** Resolved once and reused; reading computed styles per label is costly. */
  private sansFamily = ""
  private monoFamily = ""

  constructor(readonly ctx: CanvasRenderingContext2D) {}

  private families(): { sans: string; mono: string } {
    if (!this.sansFamily) {
      const styles = getComputedStyle(this.ctx.canvas)
      this.sansFamily = styles.fontFamily || "system-ui, sans-serif"
      this.monoFamily =
        styles.getPropertyValue("--font-mono").trim() ||
        "ui-monospace, monospace"
    }
    return { sans: this.sansFamily, mono: this.monoFamily }
  }

  /** Map `bounds` into a `width` x `height` box, preserving aspect ratio. */
  fit(width: number, height: number, bounds: Bounds, padding = 0): this {
    this.width = width
    this.height = height
    this.bounds = bounds
    const spanX = bounds.xMax - bounds.xMin || 1
    const spanY = bounds.yMax - bounds.yMin || 1
    this.scale = Math.min(
      (width - 2 * padding) / spanX,
      (height - 2 * padding) / spanY,
    )
    this.originX = width / 2 - ((bounds.xMin + bounds.xMax) / 2) * this.scale
    this.originY = height / 2 + ((bounds.yMin + bounds.yMax) / 2) * this.scale
    return this
  }

  sx(x: number): number {
    return this.originX + x * this.scale
  }

  sy(y: number): number {
    return this.originY - y * this.scale
  }

  wx(px: number): number {
    return (px - this.originX) / this.scale
  }

  wy(py: number): number {
    return (this.originY - py) / this.scale
  }

  /** Distance in screen pixels between two world points. */
  pixelsBetween(x0: number, y0: number, x1: number, y1: number): number {
    return Math.hypot(this.sx(x1) - this.sx(x0), this.sy(y1) - this.sy(y0))
  }

  private stroke(options: StrokeOptions): void {
    const { ctx } = this
    ctx.strokeStyle = options.color
    ctx.lineWidth = options.width ?? 1.5
    ctx.lineCap = options.cap ?? "round"
    ctx.lineJoin = "round"
    ctx.setLineDash(options.dash ?? [])
    ctx.stroke()
    ctx.setLineDash([])
  }

  /** Faint background lattice at "nice" world intervals. */
  grid(color: string, step?: number): void {
    const { ctx, bounds } = this
    const gap = step ?? niceStep((bounds.xMax - bounds.xMin) / 8)
    ctx.beginPath()
    for (
      let x = Math.ceil(bounds.xMin / gap) * gap;
      x <= bounds.xMax;
      x += gap
    ) {
      ctx.moveTo(this.sx(x), this.sy(bounds.yMin))
      ctx.lineTo(this.sx(x), this.sy(bounds.yMax))
    }
    for (
      let y = Math.ceil(bounds.yMin / gap) * gap;
      y <= bounds.yMax;
      y += gap
    ) {
      ctx.moveTo(this.sx(bounds.xMin), this.sy(y))
      ctx.lineTo(this.sx(bounds.xMax), this.sy(y))
    }
    this.stroke({ color, width: 1 })
  }

  axes(color: string, labels?: { x?: string; y?: string }): void {
    const { ctx, bounds } = this
    ctx.beginPath()
    if (bounds.yMin <= 0 && bounds.yMax >= 0) {
      ctx.moveTo(this.sx(bounds.xMin), this.sy(0))
      ctx.lineTo(this.sx(bounds.xMax), this.sy(0))
    }
    if (bounds.xMin <= 0 && bounds.xMax >= 0) {
      ctx.moveTo(this.sx(0), this.sy(bounds.yMin))
      ctx.lineTo(this.sx(0), this.sy(bounds.yMax))
    }
    this.stroke({ color, width: 1.25 })

    if (labels?.x) {
      this.text(labels.x, bounds.xMax, 0, {
        color,
        align: "right",
        baseline: "top",
        size: 12,
      })
    }
    if (labels?.y) {
      this.text(labels.y, 0, bounds.yMax, {
        color,
        align: "left",
        baseline: "top",
        size: 12,
      })
    }
  }

  polyline(points: ArrayLike<number>, options: StrokeOptions): void {
    if (points.length < 4) return
    const { ctx } = this
    ctx.beginPath()
    ctx.moveTo(this.sx(points[0]), this.sy(points[1]))
    for (let i = 2; i < points.length; i += 2) {
      ctx.lineTo(this.sx(points[i]), this.sy(points[i + 1]))
    }
    this.stroke(options)
  }

  segments(
    list: ArrayLike<[number, number, number, number]>,
    o: StrokeOptions,
  ): void {
    const { ctx } = this
    ctx.beginPath()
    for (let i = 0; i < list.length; i++) {
      const [x0, y0, x1, y1] = list[i]
      ctx.moveTo(this.sx(x0), this.sy(y0))
      ctx.lineTo(this.sx(x1), this.sy(y1))
    }
    this.stroke(o)
  }

  /** Arrow from one world point to another, with a screen-sized head. */
  arrow(x0: number, y0: number, x1: number, y1: number, o: ArrowOptions): void {
    const { ctx } = this
    const px0 = this.sx(x0)
    const py0 = this.sy(y0)
    const px1 = this.sx(x1)
    const py1 = this.sy(y1)
    const dx = px1 - px0
    const dy = py1 - py0
    const length = Math.hypot(dx, dy)
    if (length < 0.5) return

    const head = Math.min(o.head ?? 9, length * 0.5)
    const ux = dx / length
    const uy = dy / length
    // Stop the shaft short so the head's point lands exactly on the tip.
    const shaftX = px1 - ux * head * 0.85
    const shaftY = py1 - uy * head * 0.85

    ctx.beginPath()
    ctx.moveTo(px0, py0)
    ctx.lineTo(shaftX, shaftY)
    this.stroke(o)

    ctx.beginPath()
    ctx.moveTo(px1, py1)
    ctx.lineTo(shaftX - uy * head * 0.45, shaftY + ux * head * 0.45)
    ctx.lineTo(shaftX + uy * head * 0.45, shaftY - ux * head * 0.45)
    ctx.closePath()
    ctx.fillStyle = o.color
    ctx.fill()
  }

  disc(
    x: number,
    y: number,
    radius: number,
    options: { fill?: string; stroke?: string; width?: number },
  ): void {
    const { ctx } = this
    ctx.beginPath()
    ctx.arc(this.sx(x), this.sy(y), radius, 0, Math.PI * 2)
    if (options.fill) {
      ctx.fillStyle = options.fill
      ctx.fill()
    }
    if (options.stroke) {
      this.stroke({ color: options.stroke, width: options.width ?? 2 })
    }
  }

  /** A circle whose radius is given in world units, not pixels. */
  worldCircle(x: number, y: number, radius: number, o: StrokeOptions): void {
    const { ctx } = this
    ctx.beginPath()
    ctx.arc(this.sx(x), this.sy(y), radius * this.scale, 0, Math.PI * 2)
    this.stroke(o)
  }

  fillPath(points: ArrayLike<number>, color: string): void {
    if (points.length < 6) return
    const { ctx } = this
    ctx.beginPath()
    ctx.moveTo(this.sx(points[0]), this.sy(points[1]))
    for (let i = 2; i < points.length; i += 2) {
      ctx.lineTo(this.sx(points[i]), this.sy(points[i + 1]))
    }
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  text(value: string, x: number, y: number, options: TextOptions): void {
    this.screenText(value, this.sx(x), this.sy(y), options)
  }

  screenText(
    value: string,
    px: number,
    py: number,
    options: TextOptions,
  ): void {
    const { ctx } = this
    const size = options.size ?? 13
    const { sans, mono } = this.families()
    ctx.font = `${options.weight ?? "450"} ${size}px ${options.mono ? mono : sans}`
    ctx.textAlign = options.align ?? "center"
    ctx.textBaseline = options.baseline ?? "middle"

    if (options.plate) {
      const metrics = ctx.measureText(value)
      const padX = 5
      const padY = 3
      const w = metrics.width + padX * 2
      const h = size + padY * 2
      const left =
        ctx.textAlign === "right"
          ? px - w + padX
          : ctx.textAlign === "left"
            ? px - padX
            : px - w / 2
      const top =
        ctx.textBaseline === "top"
          ? py - padY
          : ctx.textBaseline === "bottom"
            ? py - h + padY
            : py - h / 2
      ctx.beginPath()
      ctx.roundRect(left, top, w, h, 4)
      ctx.fillStyle = options.plate
      ctx.fill()
    }

    ctx.fillStyle = options.color
    ctx.fillText(value, px, py)
  }

  /** Soft plate behind a block of readouts pinned to a plot corner. */
  panel(
    px: number,
    py: number,
    w: number,
    h: number,
    palette: {
      background: string
      border: string
    },
  ): void {
    const { ctx } = this
    ctx.beginPath()
    ctx.roundRect(px, py, w, h, 8)
    ctx.fillStyle = alpha(palette.background, 0.86)
    ctx.fill()
    ctx.strokeStyle = alpha(palette.border, 0.9)
    ctx.lineWidth = 1
    ctx.stroke()
  }
}
