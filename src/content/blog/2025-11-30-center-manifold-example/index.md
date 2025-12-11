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

Consider the $1$-dimensional parabolic problem
$$
\begin{align*}
&u_t = u_{xx} + (\mu+1)u - u^2,\\
&u(x,t) \in H^1_{\text{per}}(0,2\pi)\times \mathbb{R}_{\geq0}.
\end{align*}
$$
We study the local dynamics near the trivial solution $u=\mu=0$.

## Linear Analysis

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

### 1. Projections

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

### 2. Substitute the Ansatz

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
v_t = P_c [\mu v - v^2 - 2vw - w^2]
$$
because the $t$-derivative does not change the modes of $w$ on the LHS (so $L w_t = 0$), and $P_c(Lw) = L(P_c w) = 0$, $P_c (\mu w) = 0$ on the RHS. Extracting the coefficient of $e^{ix}$ gives the reduced equation with respect to $A$:
$$
\dot{A} = \mu A - \langle v^2 + 2vw + w^2, e^{ix} \rangle
$$
*Note:* This projection produces another reduced equation that involves $\dot{\bar{A}}$ by collecting the $e^{-ix}$ terms. We are omitting it because it is simply a conjugate copy of the $\dot{A}$ equation. In general, a center subspace spanned by two generic basis functions would result in a $2$-dimensional reduced system.

**Projection onto $E^h$:**
$$
w_t = L w + P_h [\mu v + \mu w - v^2 - 2vw - w^2]
$$
Since $P_h(\mu v) = 0$ (because $v \in E^c$), this simplifies to:
$$
w_t = L w + \mu w - P_h [v^2 + 2vw + w^2]
$$

To summarize, we have now computed the reduced equation on $E^c$ up to the first order
$$
\dot{A} = \mu A + O(|A|^2).
$$

---

## Higher Orders

To close the reduced equation at cubic order $O(|A|^3)$, we need $w$ at quadratic order $O(|A|^2)$. Thus, we can neglect the $2vw$ and $w^2$ terms in the $w$-equation as they are of order $3$ and $4$, respectively. Recall that the reduced $E^h$ equation for $w$ is:
$$
w_t - L w - \mu w = -P_h(v^2)
$$

We expand $w$ in the hyperbolic modes:
$$
w(x) = w_0(\mu, A, \bar{A}) + w_2(\mu, A, \bar{A})e^{2ix} + w_{-2}(\mu, A, \bar{A})e^{-2ix} + \dots
$$

Now compute each term of the reduced $E^h$ equation.

**RHS term $P_c(v^2)$:**
$$
v^2 = (Ae^{ix} + \bar{A}e^{-ix})^2 = A^2 e^{2ix} + 2A\bar{A} + \bar{A}^2 e^{-2ix}
$$
All terms of $v^2$ are in $E^h$ (modes 0 and $\pm 2$). So $P_c(v^2) = v^2$.

**LHS term $w_t$:**
Using the chain rule and the fact that $w$ depends on time only through $A$ and $\bar{A}$:
$$
w_t = \frac{\partial w}{\partial A}\dot{A} + \frac{\partial w}{\partial \bar{A}}\dot{\bar{A}}
$$
At leading order, $\dot{A} \approx \mu A$. (we only need the linear term from the previous section here because $w$ is already second order; higher order corrections to $\dot{A}$ would push the result to $O(|A|^4)$). Thus,
$$
w_t \approx \mu A \frac{\partial w}{\partial A} + \mu \bar{A} \frac{\partial w}{\partial \bar{A}}
$$
To be very, very precise, we can assume that $w_k$ take the form
$$
w_k(\mu, A,\bar A) = \sum_{\alpha,\beta,\gamma \in \mathbb{Z}} w_{k,\alpha,\beta,\gamma} \mu^\alpha A^\beta \bar{A}^\gamma
$$
in which case the derivatives $\frac{\partial w}{\partial A}$ and $\frac{\partial w}{\partial \bar{A}}$ becomes explicit. The radius of convergence of this power series is not a concern as the center manifold only makes sense locally.

### 3: More Substitution and Projections

Assume $w_0=C_0 A \bar A$, $w_{-2}=C_{-2}\bar A^2$, and $w_2 = C_2 A^2$ for some $C_{0,\pm 2}(\mu)$. How do I know that these are all the terms for each $w_k$? In other words, what happens if we include another term in one of the $w_k$'s, say, $w_0 = C_0 A \bar A + C_0^* A^2$? In this case, the $e^{0ix}$ (*constant*) terms of the equation becomes
$$
\underbrace{C_0(\dot{A}\bar{A}+A\dot{\bar{A}}) + 2C_0^* A \dot{A}}_{\text{Substitite }\dot{A}\approx \mu A} - (1+\mu)(C_0 A \bar A + \underbrace{C_0^* A^2}_{\text{The only } A^2 \text{ term}}) = 2A\bar{A}
$$
Note that this is the only equation that involves $C_0$ and $C_0^*$ because the linear operator $(\partial_t - L - \mu)$ on the LHS does not change the mode of the input function. The constant term on the RHS only has an $A \bar A$ term in its coefficient and hence forces $C_0^*=0$. This observation enables us to eliminate most of the terms with zero coefficients.

We solve for $C_{0, \pm 2}$ by matching terms with the same frequencies. Substitute the ansatz into the reduced $E^h$ equation:
$$
(\partial_t - L - \mu)(C_{-2}\bar A^2 e^{-2ix} + C_0 A \bar A + C_2 A^2e^{2ix}) = A^2 e^{2ix} + 2A\bar{A} + \bar{A}^2 e^{-2ix}
$$

#### Solve for the Mode k=0:

**Substitute $w_0=C_0 A \bar A$:**
1.  **LHS $w_t$ term:**
    Using $\dot{A}\approx \mu A$, $$\frac{\partial w_0}{\partial A} = C_0 \bar{A}$$, and $$\frac{\partial w_0}{\partial \bar{A}} = C_0 A$$, we have
    $$
    w_t \approx (\mu A)(C_0 \bar{A}) + (\mu \bar{A})(C_0 A) = 2\mu C_0 A \bar{A} = 2\mu w_0
    $$
2.  **LHS $L w$ term:**
    $$L w_0 = 1 \cdot w_0 = w_0$$
3.  **RHS:**
    The constant term in $-v^2$ is $-2A\bar{A}$.

**Assemble the equation for $w_0$:**
$$
2\mu w_0 - w_0 - \mu w_0 = -2A\bar{A}
$$
$$
(\mu - 1) w_0 = -2A\bar{A}
$$
$$
w_0 = \frac{2}{1- \mu} A \bar{A} = \frac{2}{1-\mu} |A|^2
$$

#### Solve for the Mode k=2:

**Substitute $w_2 = C_2 A^2$:**
1.  **LHS $w_t$ term:**
    $$
    \frac{\partial w_2}{\partial A} = 2 C_2 A, \quad \frac{\partial w_2}{\partial \bar{A}} = 0
    $$
    $$
    w_t \approx (\mu A)(2 C_2 A) = 2\mu C_2 A^2 = 2\mu w_2
    $$
2.  **LHS $L_0 w$ term:**
    $$L w_2 = -3 w_2$$
3.  **RHS:**
    The $e^{2ix}$ term in $-v^2$ is $-A^2$.

**Assemble the equation for $w_2$:**
$$
2\mu w_2 - (-3w_2) - \mu w_2 = -A^2
$$
$$
(\mu + 3) w_2 = -A^2
$$
$$
w_2 = -\frac{1}{\mu + 3} A^2
$$

By symmetry (since $u$ is real), $w_{-2} = \bar{w}_2 = -\frac{1}{\mu+3}\bar{A}^2$.

---

### 4. Assemble the Reduced Equation

Return to the equation for $\dot{A}$:
$$
\dot{A} = \mu A - \langle v^2 + 2vw + w^2, e^{ix} \rangle
$$

We analyze the terms inside the bracket that generate the $e^{ix}$ mode.

1.  **$v^2$:** Contains only $0, \pm 2$ modes. No resonance.
2.  **$w^2$:** Although contains resonating terms, it is of order $A^4$. Neglect.
3.  **$2vw$:** This is the interaction term.
    $$
    2vw = 2(A e^{ix} + \bar{A} e^{-ix}) \left( w_0 + w_2 e^{2ix} + w_{-2} e^{-2ix} \right)
    $$
    The following terms are proportional to $e^{ix}$:
    * $2(A e^{ix}) \cdot w_0 = 2 A w_0 e^{ix}$
    * $2(\bar{A} e^{-ix}) \cdot (w_2 e^{2ix}) = 2 \bar{A} w_2 e^{ix}$

    Substituting the expressions for $w_0$ and $w_2$ found in the previous step:
    * $$2 A w_0 = 2 A \left( \frac{2}{1-\mu} A \bar{A} \right) = \frac{4}{1-\mu} A |A|^2$$
    * $$2 \bar{A} w_2 = 2 \bar{A} \left( -\frac{1}{\mu + 3} A^2 \right) = -\frac{2}{\mu + 3} A |A|^2$$

Substitute these back into the $\dot{A}$ equation:
$$
\dot{A} = \mu A - \left( \frac{4}{1-\mu} - \frac{2}{\mu + 3} \right) A |A|^2 + O(|A|^4)
$$
If we set $\mu=0$, the equation becomes
$$
\dot{A} = \mu A - \frac{10}{3} A |A|^2 + O(|A|^4)
$$
For even higher order expansion of this reduced equation, one can repeat the procedure (*substitution, projection, and matching coefficients*) based on this order 3 expansion.

As a final reminder, $(A(t), \bar A(t))$ is the coordinate in the center subspace spanned by $e^{\pm ix}$. So this reduced equation describes the dynamics near the trivial solution $(u,\mu)=(0,0)$. Another note is that $w$ should be thought of as the image of $v$ under a smooth[^2] map $h$, i.e., $w = h(v;\mu)$. By inspecting the Taylor expansion of $h$ (*suppressing $\mu$ for simplicity*):
$$
w = h(v) = \underbrace{h(0)}_{=0} + \underbrace{Dh(0)}_{=0} v + \frac{1}{2} D^2 h(0) v^2 + \ldots
$$
* The first term vanishes because the center manifold passes through the point $u=0$.
* The second term is zero because the center manifold is tangent to the center subspace at $u=0$.
This is why we can assume $w$ is of order $O(|A|^2)$ in the calculation.

## Reference

[Local Bifurcations, Center Manifolds, and Normal Forms in Infinite-Dimensional Dynamical Systems][1] by Mariana Haragus and Gérard Iooss.

[1]: https://link.springer.com/book/10.1007/978-0-85729-112-7
[^2]: The regularity of the center manifold is whole another topic. Refer to the book above for more details.