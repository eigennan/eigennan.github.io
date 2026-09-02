export interface PointerInfo {
  /** Position in CSS pixels, relative to the element's top-left corner. */
  x: number
  y: number
  event: PointerEvent
}

export interface DragHandlers {
  /** Return false to let the gesture through untouched. */
  onDown?(info: PointerInfo): boolean | void
  onMove?(info: PointerInfo): void
  onUp?(info: PointerInfo): void
  /** Fires for pointer movement while no button is held. */
  onHover?(info: PointerInfo): void
  onLeave?(): void
}

function infoFor(element: HTMLElement, event: PointerEvent): PointerInfo {
  const rect = element.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    event,
  }
}

/**
 * One drag implementation for mouse, touch and pen. Pointer capture keeps the
 * gesture alive when the finger leaves the canvas, which matters on phones
 * where the plot fills most of the screen.
 *
 * The element needs `touch-action: none` in CSS or the browser will scroll the
 * page instead of reporting the drag.
 */
export function addPointerDrag(
  element: HTMLElement,
  handlers: DragHandlers,
): () => void {
  let activeId: number | null = null

  const onPointerDown = (event: PointerEvent) => {
    if (activeId !== null) return
    const info = infoFor(element, event)
    if (handlers.onDown?.(info) === false) return
    activeId = event.pointerId
    element.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const onPointerMove = (event: PointerEvent) => {
    const info = infoFor(element, event)
    if (activeId === event.pointerId) {
      handlers.onMove?.(info)
      event.preventDefault()
    } else if (activeId === null) {
      handlers.onHover?.(info)
    }
  }

  const finish = (event: PointerEvent) => {
    if (activeId !== event.pointerId) return
    activeId = null
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId)
    }
    handlers.onUp?.(infoFor(element, event))
  }

  const onPointerLeave = () => {
    if (activeId === null) handlers.onLeave?.()
  }

  element.addEventListener("pointerdown", onPointerDown)
  element.addEventListener("pointermove", onPointerMove)
  element.addEventListener("pointerup", finish)
  element.addEventListener("pointercancel", finish)
  element.addEventListener("pointerleave", onPointerLeave)

  return () => {
    element.removeEventListener("pointerdown", onPointerDown)
    element.removeEventListener("pointermove", onPointerMove)
    element.removeEventListener("pointerup", finish)
    element.removeEventListener("pointercancel", finish)
    element.removeEventListener("pointerleave", onPointerLeave)
  }
}

/**
 * Wheel and pinch zoom. `onZoom` receives a multiplicative factor and the
 * gesture's focal point in element-relative CSS pixels.
 */
export function addZoom(
  element: HTMLElement,
  onZoom: (factor: number, x: number, y: number) => void,
): () => void {
  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    const rect = element.getBoundingClientRect()
    const factor = Math.exp(-event.deltaY * 0.0015)
    onZoom(factor, event.clientX - rect.left, event.clientY - rect.top)
  }

  const points = new Map<number, { x: number; y: number }>()
  let lastSpread = 0

  const onDown = (event: PointerEvent) => {
    points.set(event.pointerId, { x: event.clientX, y: event.clientY })
    lastSpread = 0
  }

  const onMove = (event: PointerEvent) => {
    if (!points.has(event.pointerId)) return
    points.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (points.size !== 2) return

    const [a, b] = [...points.values()]
    const spread = Math.hypot(a.x - b.x, a.y - b.y)
    if (lastSpread > 0 && spread > 0) {
      const rect = element.getBoundingClientRect()
      onZoom(
        spread / lastSpread,
        (a.x + b.x) / 2 - rect.left,
        (a.y + b.y) / 2 - rect.top,
      )
    }
    lastSpread = spread
  }

  const onUp = (event: PointerEvent) => {
    points.delete(event.pointerId)
    lastSpread = 0
  }

  element.addEventListener("wheel", onWheel, { passive: false })
  element.addEventListener("pointerdown", onDown)
  element.addEventListener("pointermove", onMove)
  element.addEventListener("pointerup", onUp)
  element.addEventListener("pointercancel", onUp)

  return () => {
    element.removeEventListener("wheel", onWheel)
    element.removeEventListener("pointerdown", onDown)
    element.removeEventListener("pointermove", onMove)
    element.removeEventListener("pointerup", onUp)
    element.removeEventListener("pointercancel", onUp)
  }
}
