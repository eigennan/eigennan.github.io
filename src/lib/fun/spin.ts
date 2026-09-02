/**
 * Which way a circulation glyph should be drawn.
 *
 * Canvas angles advance clockwise on screen because y grows downward, so a
 * counterclockwise loop in the plane is the one drawn with `anticlockwise`
 * true. Isolated here because the decision is a single boolean that reads
 * plausibly either way: it was silently inverted once by a rename, and the
 * picture then contradicted the numbers beside it with nothing to catch it.
 */
export interface SpinSweep {
  startAngle: number
  endAngle: number
  anticlockwise: boolean
  /** Unit tangent at the arc's end, in the direction of travel. */
  headTangent: [number, number]
}

const ARC_FROM = 0.35 * Math.PI
const ARC_TO = 1.75 * Math.PI

export function spinSweep(circulation: number): SpinSweep {
  const positive = circulation >= 0
  const startAngle = positive ? ARC_TO : ARC_FROM
  const endAngle = positive ? ARC_FROM : ARC_TO
  // Travelling in decreasing angle reverses the usual (-sin, cos) tangent.
  const sweep = positive ? -1 : 1
  return {
    startAngle,
    endAngle,
    anticlockwise: positive,
    headTangent: [-Math.sin(endAngle) * sweep, Math.cos(endAngle) * sweep],
  }
}
