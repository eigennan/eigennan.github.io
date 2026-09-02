/**
 * Theme access for canvas-based visualizations.
 *
 * The site's color tokens are declared as `light-dark(...)` custom properties,
 * whose computed value is an unresolved token stream — reading
 * `getComputedStyle(root).getPropertyValue("--foreground")` gives back the
 * literal `light-dark(a, b)`, not a color. So we resolve them the same way
 * `src/pages/palette.astro` does: apply the var to a real property on a probe
 * element and read the used value back.
 */

export const THEME_TOKENS = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "accent",
  "accent-foreground",
  "muted",
  "muted-foreground",
  "border",
  "destructive",
] as const

export type ThemeToken = (typeof THEME_TOKENS)[number]
export type Palette = Record<ThemeToken, string>

let probe: HTMLDivElement | null = null

function getProbe(): HTMLDivElement {
  if (probe?.isConnected) return probe
  const el = document.createElement("div")
  el.setAttribute("aria-hidden", "true")
  el.style.position = "absolute"
  el.style.inlineSize = "0"
  el.style.blockSize = "0"
  el.style.opacity = "0"
  el.style.pointerEvents = "none"
  document.body.append(el)
  probe = el
  return el
}

/**
 * Resolve every theme token to a plain `rgb()` / `rgba()` string.
 *
 * Browsers report a computed `oklch()` color *as* `oklch(...)`, which is what
 * the tokens are authored in — so the values are normalized here, once, and
 * everything downstream can assume sRGB triples.
 */
export function readPalette(): Palette {
  const el = getProbe()
  const palette = {} as Palette
  for (const token of THEME_TOKENS) {
    el.style.backgroundColor = `var(--${token})`
    palette[token] = normalize(getComputedStyle(el).backgroundColor)
  }
  return palette
}

/**
 * Run `onChange` whenever the effective color scheme changes — both the
 * explicit toggle (`data-theme` on <html>) and the OS setting, which matters
 * while the toggle sits on "auto". Returns a disposer.
 */
export function onThemeChange(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class"],
  })

  const media = window.matchMedia("(prefers-color-scheme: dark)")
  media.addEventListener("change", onChange)

  return () => {
    observer.disconnect()
    media.removeEventListener("change", onChange)
  }
}

type Rgb = [number, number, number, number]

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

/** Linear-light channel to gamma-encoded sRGB, per the sRGB transfer curve. */
function encode(channel: number): number {
  const value =
    channel <= 0.0031308
      ? 12.92 * channel
      : 1.055 * clamp01(channel) ** (1 / 2.4) - 0.055
  return Math.round(clamp01(value) * 255)
}

/** OKLCh to sRGB, via OKLab and the LMS cone space. */
function oklchToRgb(l: number, c: number, hDegrees: number): Rgb {
  const h = (hDegrees * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)

  const lCone = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mCone = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const sCone = (l - 0.0894841775 * a - 1.291485548 * b) ** 3

  return [
    encode(4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone),
    encode(-1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone),
    encode(-0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone),
    1,
  ]
}

/** Last resort for any syntax not handled above: let the canvas rasterize it. */
let fallbackContext: CanvasRenderingContext2D | null | undefined

function viaCanvas(color: string): Rgb {
  if (fallbackContext === undefined) {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    fallbackContext = canvas.getContext("2d", { willReadFrequently: true })
  }
  if (!fallbackContext) return [0, 0, 0, 1]
  fallbackContext.clearRect(0, 0, 1, 1)
  fallbackContext.fillStyle = "#000"
  fallbackContext.fillStyle = color
  fallbackContext.fillRect(0, 0, 1, 1)
  const data = fallbackContext.getImageData(0, 0, 1, 1).data
  return [data[0], data[1], data[2], data[3] / 255]
}

function parse(color: string): Rgb {
  const numbers = color.match(/-?[\d.]+(?:e-?\d+)?%?/g)

  if (color.startsWith("oklch") && numbers && numbers.length >= 3) {
    const unit = (raw: string, scale: number) =>
      raw.endsWith("%") ? (Number.parseFloat(raw) / 100) * scale : Number(raw)
    const rgb = oklchToRgb(
      unit(numbers[0], 1),
      unit(numbers[1], 0.4),
      Number.parseFloat(numbers[2]),
    )
    if (numbers.length > 3) rgb[3] = unit(numbers[3], 1)
    return rgb
  }

  if (color.startsWith("rgb") && numbers && numbers.length >= 3) {
    return [
      Number(numbers[0]),
      Number(numbers[1]),
      Number(numbers[2]),
      numbers.length > 3
        ? numbers[3].endsWith("%")
          ? Number.parseFloat(numbers[3]) / 100
          : Number(numbers[3])
        : 1,
    ]
  }

  return viaCanvas(color)
}

/** Rewrite any CSS color as `rgb()` / `rgba()`. */
export function normalize(color: string): string {
  const [r, g, b, a] = parse(color)
  return a >= 1
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(4))})`
}

/** Same color at a different opacity. */
export function alpha(color: string, a: number): string {
  const [r, g, b, existing] = parse(color)
  return `rgba(${r}, ${g}, ${b}, ${existing * a})`
}

/** Linear blend; `t = 0` is `from`, `t = 1` is `to`. */
export function mix(from: string, to: string, t: number): string {
  const a = parse(from)
  const b = parse(to)
  const lerp = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t)
  return `rgb(${lerp(0)}, ${lerp(1)}, ${lerp(2)})`
}

/** True when the color reads as light, for picking a contrasting label. */
export function isLight(color: string): boolean {
  const [r, g, b] = parse(color)
  return r * 0.299 + g * 0.587 + b * 0.114 > 150
}
