---
title: 'Center Manifold for PDE Dynamics: A Concrete Example'
seoTitle: 'center manifold for PDE dynamics'
slug: 'center-manifold-for-pde-dynamics'
description: 'A concrete example of center manifold reduction for PDE'
pubDate: '2025-11-30'
updatedDate: '2025-11-30'
tags: ["Dynamical Systems", "Center Manifold", "PDE"]
# coverImage: './astro-banner.png'
---

## A Modified Allen–Cahn Equation

Consider the $1$-dimensional parabolic problem
$$
\begin{align*}
&u_t = u_{xx} + (\mu+1)u - u^2,\\
&u(x,t) \in H^1_{\text{per}}(0,2\pi)\times \mathbb{R}_{\geq0}.
\end{align*}
$$
We study the local dynamics near the trivial solution $u=\mu=0$.

### Linear Analysis

Write the equation as
$$
u_t = L u+N(u;\mu),
$$
where
$$L = \partial_{xx} + 1$$ and $N(u;\mu) = \mu u - u^2$. We can find the eigenvalues through the linearization at $(u,\mu) = (0,0)$,
$$
L e^{ikx} = \lambda_k e^{ikx},
$$
yielding the eigenvalues:
$$\lambda_k = 1 - k^2, k\in \mathbb{Z}$$.

**Center Subspace ($E^c$)**
The center subspace corresponds to eigenvalues with zero real part ($\lambda_k = 0$).
$$
1 - k^2 = 0 \implies k = \pm 1.
$$
Thus, the center subspace is spanned by the modes $e^{ix}$ and $e^{-ix}$.
$$
E^c = \text{span}\{ e^{ix}, e^{-ix} \}.
$$

**Hyperbolic Subspace ($E^h$)**
The hyperbolic subspace corresponds to eigenvalues with non-zero real parts ($k \neq \pm 1$). Therefore, the hyperbolic subspace is spanned by all the other modes.
$$
E^h = \text{span}\{ e^{ikx} \mid k \in \mathbb{Z}, k \neq \pm 1 \}.
$$

---

### Projections

We define the projection operators $P_c$ and $P_h$ onto the center and hyperbolic subspaces, respectively:

The projection operator $P_c$ onto the center subspace $E^c$ for a function $u(x)$, using the standard $L^2$ inner product $\langle f, g \rangle = \frac{1}{2\pi} \int_0^{2\pi} f(x) \bar{g}(x) dx$, is given by
$$
P_c u = \langle u, e^{ix} \rangle e^{ix} + \langle u, e^{-ix} \rangle e^{-ix}
$$
The projection onto the hyperbolic subspace is the complement:
$$P_h u = (I - P_c) u$$

For convenience, we use the projection acting on the Fourier series of a function $f(x) = \sum f_k e^{ikx}$ throughout this article.

**Projection onto Center Subspace ($P_c$)**
$$
P_c f := f_1 e^{ix} + f_{-1} e^{-ix}
$$

**Projection onto Hyperbolic Subspace ($P_h$)**
$$
P_h f := f - P_c f = \sum_{k \neq \pm 1} f_k e^{ikx}
$$

---

### Substitute the Ansatz

We decompose the solution $u$ onto components on the center and hyperbolic subspaces:
$$
u(x,t) = v(x,t) + w(x,t)
$$
where $v \in E^c$ and $w \in E^h$, and then substitute it into the PDE:
$$
\begin{align*}
v_t + w_t &= L(v+w) + \mu(v+w) - (v+w)^2\\
&= L w + \mu v + \mu w - (v^2 + 2vw + w^2)
\end{align*}
$$
because $L v =0$. Here, $v$ and $w$ can be expressed using the amplitude $A(t)$ and the bases of the center and hyperbolic subspaces:
$$
\begin{align*}
v(x,t) &= A(t)e^{ix} + \bar{A}(t)e^{-ix},\\
w(x,t) &= \sum_{k \neq \pm 1} w_k(A(t),\bar A(t),\mu) e^{ikx}
\end{align*}
$$
We project this equation onto $E^c$ and $E^h$.

**Projection onto $E^c$:**
$$
v_t = P_c [\mu v + \mu w - v^2 - 2vw - w^2]
$$
Here we used the fact that $Lv = 0$ and $P_c(Lw) = L(P_c w) = 0$. Extracting the coefficient of $e^{ix}$ gives the reduced equation with respect to $A$:
$$
\dot{A} = \mu A - \langle v^2 + 2vw + w^2, e^{ix} \rangle
$$
*Note:* This projection produces another reduced equation that involves $\dot{\bar{A}}$ by collecting the $e^{-ix}$ terms. We are omitting it because it is simply a conjugate copy of the $\dot{A}$ equation. In general, a center subspace spanned by two generic basis functions would result in a $2$-dimensional reduced system.

**Projection onto $E^h$:**
$$
w_t = L_0 w + P_h [\mu v + \mu w - v^2 - 2vw - w^2]
$$
Since $P_h(\mu v) = 0$ (because $v \in E^c$), this simplifies to:
$$
w_t = L_0 w + \mu w - P_h [v^2 + 2vw + w^2]
$$

---

To be Continued...

## Reference

[Local Bifurcations, Center Manifolds, and Normal Forms in Infinite-Dimensional Dynamical Systems][1] by Mariana Haragus and Gérard Iooss.

[1]: https://link.springer.com/book/10.1007/978-0-85729-112-7