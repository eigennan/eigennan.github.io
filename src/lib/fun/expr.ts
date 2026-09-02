/**
 * A tiny recursive-descent parser for the formula boxes.
 *
 * Deliberately not `eval` or `new Function`: student-typed text becomes a tree
 * of closures over a fixed scope, so nothing it contains can reach the page.
 * Implicit multiplication is supported (`2x`, `x y`, `3(x+1)`) because that is
 * how people actually write formulas by hand.
 */

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
}

type Fn1 = (value: number) => number
type Fn2 = (a: number, b: number) => number

const UNARY: Record<string, Fn1> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  log: Math.log,
  ln: Math.log,
  log10: Math.log10,
  log2: Math.log2,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  sign: Math.sign,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
}

const BINARY: Record<string, Fn2> = {
  atan2: Math.atan2,
  pow: Math.pow,
  min: Math.min,
  max: Math.max,
  hypot: Math.hypot,
  mod: (a, b) => a % b,
}

type Node = () => number

interface Token {
  kind: "number" | "name" | "op"
  value: string
  position: number
}

export class ExpressionError extends Error {}

function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < source.length) {
    const char = source[i]
    if (/\s/.test(char)) {
      i++
      continue
    }
    if (/[\d.]/.test(char)) {
      const start = i
      while (i < source.length && /[\d.]/.test(source[i])) i++
      // Scientific notation: 1e-3, 2.5E6
      if (/[eE]/.test(source[i] ?? "") && /[\d+-]/.test(source[i + 1] ?? "")) {
        i += 2
        while (i < source.length && /\d/.test(source[i])) i++
      }
      tokens.push({
        kind: "number",
        value: source.slice(start, i),
        position: start,
      })
      continue
    }
    if (/[a-zA-Z_]/.test(char)) {
      const start = i
      while (i < source.length && /[a-zA-Z_0-9]/.test(source[i])) i++
      tokens.push({
        kind: "name",
        value: source.slice(start, i),
        position: start,
      })
      continue
    }
    if ("+-*/^(),".includes(char)) {
      tokens.push({ kind: "op", value: char, position: i })
      i++
      continue
    }
    throw new ExpressionError(`Unexpected character "${char}"`)
  }

  return tokens
}

/**
 * Compiles `source` into a plain function of the named variables. Throws
 * `ExpressionError` with a human-readable message on bad input.
 */
export function compile(
  source: string,
  variables: readonly string[],
): (...args: number[]) => number {
  const tokens = tokenize(source)
  const scope: Record<string, number> = {}
  for (const name of variables) scope[name] = 0

  let index = 0
  const peek = () => tokens[index]
  const atOp = (value: string) =>
    peek()?.kind === "op" && peek().value === value

  const eat = (value: string) => {
    if (!atOp(value)) {
      throw new ExpressionError(`Expected "${value}"`)
    }
    index++
  }

  function parseExpression(): Node {
    let left = parseTerm()
    while (atOp("+") || atOp("-")) {
      const op = tokens[index++].value
      const right = parseTerm()
      const a = left
      left = op === "+" ? () => a() + right() : () => a() - right()
    }
    return left
  }

  function startsAtom(): boolean {
    const token = peek()
    if (!token) return false
    if (token.kind === "number" || token.kind === "name") return true
    return token.kind === "op" && token.value === "("
  }

  function parseTerm(): Node {
    let left = parseUnary()
    for (;;) {
      if (atOp("*") || atOp("/")) {
        const op = tokens[index++].value
        const right = parseUnary()
        const a = left
        left = op === "*" ? () => a() * right() : () => a() / right()
        continue
      }
      // Implicit multiplication: `2x`, `x y`, `3(x+1)`.
      if (startsAtom()) {
        const right = parseUnary()
        const a = left
        left = () => a() * right()
        continue
      }
      return left
    }
  }

  function parseUnary(): Node {
    if (atOp("-")) {
      index++
      const operand = parseUnary()
      return () => -operand()
    }
    if (atOp("+")) {
      index++
      return parseUnary()
    }
    return parsePower()
  }

  function parsePower(): Node {
    const base = parseAtom()
    if (atOp("^")) {
      index++
      // Right-associative, and the exponent may be negative: x^-2.
      const exponent = parseUnary()
      return () => base() ** exponent()
    }
    return base
  }

  function parseAtom(): Node {
    const token = peek()
    if (!token) throw new ExpressionError("Unexpected end of expression")

    if (token.kind === "number") {
      index++
      const value = Number(token.value)
      if (Number.isNaN(value)) {
        throw new ExpressionError(`Bad number "${token.value}"`)
      }
      return () => value
    }

    if (atOp("(")) {
      index++
      const inner = parseExpression()
      eat(")")
      return inner
    }

    if (token.kind === "name") {
      index++
      const name = token.value

      if (atOp("(")) {
        index++
        const args: Node[] = [parseExpression()]
        while (atOp(",")) {
          index++
          args.push(parseExpression())
        }
        eat(")")

        const unary = UNARY[name]
        if (unary) {
          if (args.length !== 1) {
            throw new ExpressionError(`${name}() takes one argument`)
          }
          const [arg] = args
          return () => unary(arg())
        }
        const binary = BINARY[name]
        if (binary) {
          if (args.length !== 2) {
            throw new ExpressionError(`${name}() takes two arguments`)
          }
          const [a, b] = args
          return () => binary(a(), b())
        }
        throw new ExpressionError(`Unknown function "${name}"`)
      }

      if (name in scope) return () => scope[name]
      if (name in CONSTANTS) {
        const value = CONSTANTS[name]
        return () => value
      }
      throw new ExpressionError(`Unknown name "${name}"`)
    }

    throw new ExpressionError(`Unexpected "${token.value}"`)
  }

  const root = parseExpression()
  if (index < tokens.length) {
    throw new ExpressionError(`Unexpected "${tokens[index].value}"`)
  }

  return (...args: number[]) => {
    for (let i = 0; i < variables.length; i++)
      scope[variables[i]] = args[i] ?? 0
    return root()
  }
}

/** Non-throwing wrapper for live-typed input. */
export function tryCompile(
  source: string,
  variables: readonly string[],
): { fn: ((...args: number[]) => number) | null; error: string | null } {
  const trimmed = source.trim()
  if (!trimmed) return { fn: null, error: "Enter a formula" }
  try {
    const fn = compile(trimmed, variables)
    const probe = fn(...variables.map(() => 0.37))
    if (typeof probe !== "number") {
      return { fn: null, error: "That isn't a number" }
    }
    return { fn, error: null }
  } catch (error) {
    const message =
      error instanceof ExpressionError ? error.message : "Could not read that"
    return { fn: null, error: message }
  }
}
