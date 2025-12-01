---
title: 'Why Secant Continuation?'
seoTitle: 'secant continuation'
slug: 'secant-continuation'
description: 'A concrete example of using secant continuation to overcome fold points'
pubDate: '2025-12-01'
updatedDate: '2025-12-01'
tags: ["Dynamical Systems", "Continuation", "Numerical Methods"]
# coverImage: './astro-banner.png'
hide: true
---

Here is a toy problem with a typical saddle-node bifurcation
$$
\dot{u} = \mu  -u^2
$$
that demonstrates the need for secant continuation. For each $\mu \in \mathbb{R}$ there is an (or two) equilibrium solution $u \equiv \pm\sqrt{\mu}$. Suppose we only know *one* such fixed point $(u,\mu) = (2,4)$ and wish to find all other equilibria.

## Baby Continuation

<div class="gist-embed">
	<script src="https://gist.github.com/eigennan/e8899386e80971d897b2df603a48553b.js"></script>
</div>

<div class="gist-embed">
<script src="https://gist.github.com/eigennan/fe4f802600e34c98081d1b5248b3fbda.js"></script>
</div>

To be continued...