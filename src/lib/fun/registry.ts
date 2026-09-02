export interface FunApp {
  slug: string
  title: string
  /** One sentence for the gallery card and the page subtitle. */
  blurb: string
  /** Iconify name, resolved at build time by `resolveIcon`. */
  icon: string
  /** Rendering the app uses, shown as a badge on the card. */
  kind: "2D" | "3D" | "2D + 3D"
  /** How to drive it, shown under the canvas. */
  hint: string
}

export interface FunGroup {
  title: string
  blurb: string
  apps: FunApp[]
}

export const FUN_GROUPS: FunGroup[] = [
  {
    title: "Vectors and space",
    blurb: "",
    apps: [
      {
        slug: "dot-product",
        title: "Dot Product and Projection",
        blurb:
          "Shine a light down onto one arrow and see what shadow the other casts. That shadow is the whole idea.",
        icon: "mingcute:light-line",
        kind: "2D",
        hint: "Drag either arrow; swing one past square-on to the other.",
      },
      {
        slug: "cross-product",
        title: "Cross Product, Area and Volume",
        blurb:
          "One vector carrying two facts at once: which plane a pair of arrows spans, and how much area they enclose in it.",
        icon: "mingcute:box-3-line",
        kind: "3D",
        hint: "Drag to orbit; slide the components; add the third vector.",
      },
      {
        slug: "lines-and-planes",
        title: "Lines and Planes",
        blurb:
          "The shortest way from a point to a plane is always the perpendicular one — here it is, drawn.",
        icon: "mingcute:ruler-line",
        kind: "3D",
        hint: "Slide the point around and watch the perpendicular follow it.",
      },
      {
        slug: "coordinate-systems",
        title: "Coordinate Systems",
        blurb:
          "Polar, cylindrical and spherical. Watch the little box of volume shrink as it approaches the axis, and see where the extra factors come from.",
        icon: "mingcute:earth-line",
        kind: "3D",
        hint: "Slide each coordinate and watch its surface light up.",
      },
    ],
  },
  {
    title: "Surfaces and contours",
    blurb: "",
    apps: [
      {
        slug: "contour-maps",
        title: "Contour Maps",
        blurb:
          "Slice a surface at every height and watch its topographic map appear. Crowded lines mean steep ground.",
        icon: "mingcute:mountain-line",
        kind: "2D + 3D",
        hint: "Drag the height slider, or drag on the surface to turn it.",
      },
      {
        slug: "quadric-surfaces",
        title: "Quadric Surfaces",
        blurb:
          "The whole zoo — ellipsoids, saddles, cones and both hyperboloids — and the traces that tell them apart.",
        icon: "mingcute:cube-3d-line",
        kind: "3D",
        hint: "Change one coefficient's sign and watch the shape become another.",
      },
      {
        slug: "limits-along-paths",
        title: "Limits Along Paths",
        blurb:
          "Walk into the same point from different directions and arrive at different answers. Then there is no limit.",
        icon: "mingcute:aiming-line",
        kind: "2D",
        hint: "Switch paths and compare where each one lands.",
      },
      {
        slug: "zooming-in",
        title: "Zooming In",
        blurb:
          "Every smooth surface is flat if you look closely enough. That flat thing is the tangent plane.",
        icon: "mingcute:zoom-in-line",
        kind: "3D",
        hint: "Zoom in and watch the gap between surface and plane collapse.",
      },
    ],
  },
  {
    title: "Gradients and optimization",
    blurb: "",
    apps: [
      {
        slug: "steepest-ascent",
        title: "Steepest Ascent",
        blurb:
          "Point a compass needle anywhere on a contour map and watch the slope in that direction respond. One direction always wins.",
        icon: "mingcute:compass-line",
        kind: "2D",
        hint: "Drag the dot to move, drag the needle to aim.",
      },
      {
        slug: "lagrange-multipliers",
        title: "Lagrange Multipliers",
        blurb:
          "Walk along a constraint until a level curve just barely touches it. That kiss is the answer.",
        icon: "mingcute:target-line",
        kind: "2D",
        hint: "Drag the point around the constraint curve.",
      },
      {
        slug: "gradient-descent",
        title: "Gradient Descent",
        blurb:
          "Step downhill, over and over, and hope you picked a step size that doesn't throw you off the mountain.",
        icon: "mingcute:trending-down-line",
        kind: "2D",
        hint: "Nudge the step size past the tipping point and watch it blow up.",
      },
      {
        slug: "critical-points",
        title: "Critical Points",
        blurb:
          "Flat spots come in three flavours, and one determinant tells them apart. Watch a peak and a saddle collide and annihilate.",
        icon: "mingcute:pin-line",
        kind: "2D",
        hint: "Slide the parameter until the two critical points meet.",
      },
      {
        slug: "newtons-method",
        title: "Newton's Method",
        blurb:
          "Follow the tangent to where it hits zero, and repeat. Which root you land on depends on where you start — sometimes wildly.",
        icon: "mingcute:random-line",
        kind: "2D",
        hint: "Click anywhere to drop a seed and watch it fall to a root.",
      },
    ],
  },
  {
    title: "Curves and motion",
    blurb: "",
    apps: [
      {
        slug: "moving-frame",
        title: "The Moving Frame",
        blurb:
          "Ride along a curve carrying three perpendicular arrows. Curvature is the circle that fits best.",
        icon: "mingcute:route-line",
        kind: "3D",
        hint: "Drag to orbit, scroll to zoom, slide to travel.",
      },
      {
        slug: "speed-and-arclength",
        title: "Speed and Arclength",
        blurb:
          "Two dots race the same path, one at constant speed. The difference between them is what the arclength parameter fixes.",
        icon: "mingcute:stopwatch-line",
        kind: "2D",
        hint: "Add segments and watch the polyline close on the true length.",
      },
      {
        slug: "projectile-and-orbit",
        title: "Projectile and Orbit",
        blurb:
          "The same question twice: gravity that pulls straight down, and gravity that pulls toward a point.",
        icon: "mingcute:rocket-line",
        kind: "2D",
        hint: "Change the launch, then switch the law of gravity.",
      },
    ],
  },
  {
    title: "Vector fields and flow",
    blurb: "",
    apps: [
      {
        slug: "vector-fields",
        title: "Vector Fields",
        blurb:
          "Iron filings, a weather map, a leaf on a stream. Drop particles into a field, then measure how much it spreads and how much it spins.",
        icon: "mingcute:wind-line",
        kind: "2D",
        hint: "Drag the probe anywhere to measure; switch fields to compare.",
      },
      {
        slug: "work-and-circulation",
        title: "Work and Circulation",
        blurb:
          "Drag a path through a field and watch the work accumulate. Walk it backwards and every bit of it changes sign.",
        icon: "mingcute:walk-line",
        kind: "2D",
        hint: "Drag the path's ends; flip the direction to flip the answer.",
      },
      {
        slug: "path-independence",
        title: "Path Independence",
        blurb:
          "Some fields don't care which way you went, only where you ended up. Most do care — and one famous one only pretends not to.",
        icon: "mingcute:directions-line",
        kind: "2D",
        hint: "Drag either endpoint and compare the two running totals.",
      },
      {
        slug: "the-curtain",
        title: "The Curtain",
        blurb:
          "Stand a fence along a winding path, as tall as the function is high. Its area is the scalar line integral.",
        icon: "mingcute:curtain-line",
        kind: "3D",
        hint: "Bend the path and watch the fence follow.",
      },
    ],
  },
  {
    title: "Integration and change of variables",
    blurb: "",
    apps: [
      {
        slug: "order-of-integration",
        title: "Order of Integration",
        blurb:
          "Sweep a region with vertical strips, then with horizontal ones. Same region, two very different sets of limits.",
        icon: "mingcute:layout-grid-line",
        kind: "2D",
        hint: "Switch the order and watch the limits rewrite themselves.",
      },
      {
        slug: "riemann-sums",
        title: "Riemann Sums",
        blurb:
          "Stack boxes under a surface until they stop being boxes. That limit is the double integral.",
        icon: "mingcute:chart-bar-line",
        kind: "3D",
        hint: "Raise the box count and watch the total settle.",
      },
      {
        slug: "solids-and-shadows",
        title: "Solids and Shadows",
        blurb:
          "A solid casts three shadows, and each one is the outer region of a different order of integration.",
        icon: "mingcute:shadow-line",
        kind: "3D",
        hint: "Switch the order and watch which shadow becomes the floor.",
      },
      {
        slug: "the-jacobian",
        title: "The Jacobian",
        blurb:
          "Bend a grid and watch a tiny square stretch. The area it gains is exactly the factor the integral needs.",
        icon: "mingcute:transformation-line",
        kind: "2D",
        hint: "Drag the little square around and shrink it.",
      },
      {
        slug: "parametrized-surfaces",
        title: "Parametrized Surfaces",
        blurb:
          "Bend a flat sheet of graph paper into a shape. Where the sheet stretches, every square on it has to be counted for more.",
        icon: "mingcute:globe-line",
        kind: "2D + 3D",
        hint: "Drag the patch on the flat sheet; drag the surface to turn it.",
      },
      {
        slug: "monte-carlo",
        title: "Monte Carlo Integration",
        blurb:
          "Throw darts at a shape and count the hits. Hopeless in one dimension, unbeatable in twenty.",
        icon: "mingcute:sandglass-line",
        kind: "2D",
        hint: "Throw more darts and watch the error fall — slowly.",
      },
      {
        slug: "mass-and-moments",
        title: "Mass and Moments",
        blurb:
          "Where does a shape balance, and how hard is it to spin? Two integrals of the same lamina, answering different questions.",
        icon: "mingcute:balance-line",
        kind: "2D",
        hint: "Change the density and watch the balance point slide.",
      },
    ],
  },
  {
    title: "Flux and the big theorems",
    blurb: "",
    apps: [
      {
        slug: "greens-theorem",
        title: "Green's Theorem",
        blurb:
          "Tile a region with tiny spinning cells. Every interior edge cancels against its neighbour, and only the boundary survives.",
        icon: "mingcute:tornado-line",
        kind: "2D",
        hint: "Raise the grid resolution and watch the interior go quiet.",
      },
      {
        slug: "flux",
        title: "Flux",
        blurb:
          "How much of a flow actually gets through a surface — and why you have to decide which side counts as out before the question means anything.",
        icon: "mingcute:arrows-right-line",
        kind: "3D",
        hint: "Tilt the surface, then flip its orientation and watch the sign go.",
      },
      {
        slug: "stokes-theorem",
        title: "Stokes' Theorem",
        blurb:
          "Stretch any surface you like across the same wire loop. The spin caught by all of them is identical.",
        icon: "mingcute:fan-line",
        kind: "3D",
        hint: "Swap the cap. The two numbers never stop agreeing.",
      },
      {
        slug: "divergence-theorem",
        title: "The Divergence Theorem",
        blurb:
          "Shrink a closed surface toward a point and the flux per unit volume settles onto a single number: the divergence there.",
        icon: "mingcute:box-2-line",
        kind: "3D",
        hint: "Shrink the surface and watch the ratio converge.",
      },
    ],
  },
  {
    title: "Diagrams",
    blurb: "",
    apps: [
      {
        slug: "chain-rule-tree",
        title: "The Chain Rule Tree",
        blurb:
          "Every path from the top of the diagram to the bottom is one term. Collect them all and you have the chain rule.",
        icon: "mingcute:tree-line",
        kind: "2D",
        hint: "Click a path to collect its term.",
      },
      {
        slug: "forms-and-fields",
        title: "Forms and Fields",
        blurb:
          "Grad, curl and div are the same operator wearing three hats — and the four big theorems are one theorem.",
        icon: "mingcute:book-6-line",
        kind: "2D",
        hint: "Step through the degrees and watch the dictionary line up.",
      },
    ],
  },
]

export const FUN_APPS: FunApp[] = FUN_GROUPS.flatMap((group) => group.apps)

export function findFunApp(slug: string): FunApp {
  const app = FUN_APPS.find((entry) => entry.slug === slug)
  if (!app) throw new Error(`No /fun app registered for slug "${slug}"`)
  return app
}

/**
 * Filter tags for an app's rendering. An app that has both a flat panel and a
 * WebGL one answers to either chip, which is why this is a list rather than
 * the `kind` string itself.
 */
export function kindTags(app: FunApp): string[] {
  return app.kind === "2D + 3D" ? ["2D", "3D"] : [app.kind]
}

export const FUN_KIND_TAGS = ["2D", "3D"] as const

export function countByKind(tag: string): number {
  return FUN_APPS.filter((app) => kindTags(app).includes(tag)).length
}
