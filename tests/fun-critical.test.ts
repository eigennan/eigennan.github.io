import assert from "node:assert/strict"
import { test } from "node:test"

import { classify, findCriticalPoints } from "../src/lib/fun/criticalpoints.ts"

const BOX = { xMin: -2.5, xMax: 2.5, yMin: -2, yMax: 2 }

void test("the discriminant decides before the sign of f_xx does", () => {
  assert.equal(classify(2, 0, 2).kind, "minimum")
  assert.equal(classify(-2, 0, -2).kind, "maximum")
  assert.equal(classify(2, 0, -2).kind, "saddle")
  // f_xx > 0 but the surface still falls away in another direction.
  assert.equal(classify(1, 3, 1).kind, "saddle")
  assert.equal(classify(0, 0, 0).kind, "degenerate")
})

void test("a paraboloid has exactly one minimum, at the origin", () => {
  const points = findCriticalPoints((x, y) => x * x + y * y, BOX)
  assert.equal(points.length, 1)
  assert.equal(points[0].kind, "minimum")
  assert.ok(Math.hypot(points[0].x, points[0].y) < 1e-4)
})

void test("a saddle is found and named", () => {
  const points = findCriticalPoints((x, y) => x * x - y * y, BOX)
  assert.equal(points.length, 1)
  assert.equal(points[0].kind, "saddle")
})

void test("x^3 - 3*lambda*x + y^2 has a minimum and a saddle that annihilate", () => {
  // Roots at x = +/- sqrt(lambda); D = 12x, so +sqrt is a min and -sqrt a saddle.
  const withLambda = (lambda: number) =>
    findCriticalPoints((x, y) => x ** 3 - 3 * lambda * x + y * y, BOX)

  const two = withLambda(1)
  assert.equal(two.length, 2)
  const kinds = two.map((p) => p.kind).sort()
  assert.deepEqual(kinds, ["minimum", "saddle"])
  const min = two.find((p) => p.kind === "minimum")
  assert.ok(min, "expected a minimum")
  assert.ok(Math.abs(min.x - 1) < 1e-3, `minimum at x=${min.x}, want 1`)

  // Past the collision there are no stationary points left at all.
  assert.equal(withLambda(-1).length, 0)
})
