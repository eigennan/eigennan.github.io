import assert from "node:assert/strict"
import { test } from "node:test"

import { spinSweep } from "../src/lib/fun/spin.ts"

/**
 * The glyph direction was once inverted by a rename that flipped a boolean
 * whose name read plausibly either way. These pin the sign convention down.
 */

const onCircle = (angle: number): [number, number] => [
  Math.cos(angle),
  Math.sin(angle),
]

void test("positive circulation sweeps counterclockwise on screen", () => {
  const { anticlockwise } = spinSweep(2)
  // Canvas angle increases toward +y, which points down, so an increasing
  // sweep looks clockwise. Counterclockwise therefore means anticlockwise.
  assert.equal(anticlockwise, true)
})

void test("negative circulation sweeps the other way", () => {
  assert.equal(spinSweep(-2).anticlockwise, false)
})

void test("the two signs are exact mirrors of each other", () => {
  const up = spinSweep(1)
  const down = spinSweep(-1)
  assert.equal(up.startAngle, down.endAngle)
  assert.equal(up.endAngle, down.startAngle)
  assert.notEqual(up.anticlockwise, down.anticlockwise)
})

void test("the head tangent points along the direction of travel", () => {
  for (const circulation of [1, -1]) {
    const { endAngle, anticlockwise, headTangent } = spinSweep(circulation)
    // Step a hair back along the arc; the head must point away from there.
    const step = anticlockwise ? 1e-4 : -1e-4
    const [px, py] = onCircle(endAngle + step)
    const [ex, ey] = onCircle(endAngle)
    const travel = [ex - px, ey - py]
    const dot = travel[0] * headTangent[0] + travel[1] * headTangent[1]
    assert.ok(dot > 0, `tangent opposes travel for circulation ${circulation}`)
  }
})

void test("a flat cell still produces a drawable sweep", () => {
  const { startAngle, endAngle } = spinSweep(0)
  assert.ok(Number.isFinite(startAngle) && Number.isFinite(endAngle))
})
