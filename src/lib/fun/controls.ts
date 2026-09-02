import { tryCompile } from "./expr"

/**
 * Thin bindings between the markup the Fun* components emit and an app's
 * state. Each returns a live handle plus its own listener, and the app's
 * disposer calls `dispose` so nothing survives a view transition.
 */

export interface Binding {
  dispose(): void
}

export interface SliderHandle extends Binding {
  readonly value: number
  set(value: number): void
}

export function bindSlider(
  root: HTMLElement,
  name: string,
  options: {
    onInput?(value: number): void
    /** Text for the readout beside the label. */
    format?(value: number): string
  } = {},
): SliderHandle {
  const input = root.querySelector<HTMLInputElement>(
    `[data-fun-input="${name}"]`,
  )
  const output = root.querySelector<HTMLElement>(`[data-fun-output="${name}"]`)
  let value = input ? Number(input.value) : 0

  const render = () => {
    if (output) output.textContent = options.format?.(value) ?? String(value)
  }

  const onInput = () => {
    if (!input) return
    value = Number(input.value)
    render()
    options.onInput?.(value)
  }

  input?.addEventListener("input", onInput)
  render()

  return {
    get value() {
      return value
    },
    set(next: number) {
      value = next
      if (input) input.value = String(next)
      render()
    },
    dispose() {
      input?.removeEventListener("input", onInput)
    },
  }
}

export interface SelectHandle extends Binding {
  readonly value: string
  set(value: string): void
}

export function bindSelect(
  root: HTMLElement,
  name: string,
  onChange?: (value: string) => void,
): SelectHandle {
  const select = root.querySelector<HTMLSelectElement>(
    `[data-fun-select="${name}"]`,
  )
  let value = select?.value ?? ""

  const handler = () => {
    if (!select) return
    value = select.value
    onChange?.(value)
  }

  select?.addEventListener("change", handler)

  return {
    get value() {
      return value
    },
    set(next: string) {
      value = next
      if (select) select.value = next
    },
    dispose() {
      select?.removeEventListener("change", handler)
    },
  }
}

export interface ToggleHandle extends Binding {
  readonly on: boolean
  set(on: boolean): void
}

export function bindToggle(
  root: HTMLElement,
  name: string,
  onChange?: (on: boolean) => void,
): ToggleHandle {
  const button = root.querySelector<HTMLButtonElement>(
    `[data-fun-toggle="${name}"]`,
  )
  let on = button?.getAttribute("aria-pressed") === "true"

  const apply = () => {
    button?.setAttribute("aria-pressed", on ? "true" : "false")
  }

  const handler = () => {
    on = !on
    apply()
    onChange?.(on)
  }

  button?.addEventListener("click", handler)

  return {
    get on() {
      return on
    },
    set(next: boolean) {
      on = next
      apply()
    },
    dispose() {
      button?.removeEventListener("click", handler)
    },
  }
}

export interface FormulaHandle<T> extends Binding {
  /** The last expression that compiled; never null after construction. */
  readonly fn: T
}

/**
 * Live-compiles a typed formula. The previous working function is kept while
 * the text is mid-edit and invalid, so the plot never blanks out under the
 * user's hands — the error message alone reports the problem.
 */
export function bindFormula(
  root: HTMLElement,
  name: string,
  variables: readonly string[],
  fallback: (...args: number[]) => number,
  onChange?: () => void,
): FormulaHandle<(...args: number[]) => number> {
  const input = root.querySelector<HTMLInputElement>(
    `[data-fun-formula="${name}"]`,
  )
  const errorEl = root.querySelector<HTMLElement>(
    `[data-fun-formula-error="${name}"]`,
  )

  let fn = fallback

  const compileNow = () => {
    if (!input) return
    const result = tryCompile(input.value, variables)
    if (errorEl) errorEl.textContent = result.error ?? ""
    input.setAttribute("aria-invalid", result.error ? "true" : "false")
    if (result.fn) {
      fn = result.fn
      onChange?.()
    }
  }

  input?.addEventListener("input", compileNow)
  compileNow()

  return {
    get fn() {
      return fn
    },
    dispose() {
      input?.removeEventListener("input", compileNow)
    },
  }
}

/** Collects bindings so an app's disposer is a single call. */
export function disposeAll(bindings: Binding[]): () => void {
  return () => {
    for (const binding of bindings) binding.dispose()
  }
}
