export interface Project {
  name: string;
  demoLink: string;
  tags?: string[];
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  paperLink?: string;
  image?: string;
  coverImage?: string;
  imageAlt?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    name: 'SciML: Allen-Cahn Equation via Modified DeepONet',
    description: 'Python project that implements a modified Deep Operator Network (DeepONet) to solve the Allen-Cahn equation. The project focuses on using neural networks to approximate the solution operator for this equation.',
    demoLink: 'https://github.com/eigenan/SciML-Learning-Allen-Cahn-Equation-via-Modified-DeepONet',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "DeepONet"],
    image: '/ac_output.png',
    coverImage: '/ac_output.png'
  },
  {
    name: 'SciML: FitzHugh Nagumo Equation via Extended Physics Informed Neural Network (XPINN)',
    description: 'Python project that utilizes Extended Physics Informed Neural Networks (XPINN) to learn the multiple time scale dynamics for the FitzHugh-Nagumo equation.',
    demoLink: 'https://github.com/eigenan/SciML-Learning-FitzHugh-Nagumo-Equation-via-Extended-Physics-Informed-Neural-Network',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "Physics Informed Neural Networks"],
    image: '/fn_output1.png',
    coverImage: '/fn_output1.png'
  },
  {
    name: 'SciML: 2D Kuramoto-Sivashinsky Equation via Fourier Neural Networks',
    description: 'Python project that employs Fourier Neural Networks to learn the solution operator for the 2D Kuramoto-Sivashinsky equation.',
    demoLink: 'https://github.com/eigenan/SciML-Learning-Kuramoto-Sivashinsky-Equation-via-Fourier-Neural-Networks',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "Fourier Neural Networks"],
    image: '/ks_output.png',
    coverImage: '/ks_output.png'
  },
  {
    name: 'Dynamical Bestiary: Kuramoto-Sivashinsky Equation',
    description: 'Python notebook for the Kuramoto-Sivashinsky equation. Explores pattern formations using numerical continuation and direct simulation methods.',
    demoLink: 'https://github.com/eigenan/Dynamical-Bestiary-Kuramoto-Sivashinsky-Equation',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Numerical Continuation", "Direct Simulation"],
    image: '/ks.png',
    coverImage: '/ks.png'
  },
  {
    name: 'Dynamical Bestiary: Swift-Hohenberg Equation',
    description: 'Python notebook for the Swift-Hohenberg equation. Explores pattern formations using numerical continuation and direct simulation methods.',
    demoLink: 'https://github.com/eigenan/Dynamical-Bestiary-Swift-Hohenberg-Equation',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Numerical Continuation", "Direct Simulation"],
    image: '/sh.png',
    coverImage: '/sh.png'
  },
  {
    name: 'Dynamical Bestiary: Cahn-Hilliard Equation',
    description: 'Python notebook for the Cahn-Hilliard equation. Explores pattern formations using numerical continuation and direct simulation methods.',
    demoLink: 'https://github.com/eigenan/Dynamical-Bestiary-Cahn-Hilliard-Equation',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Numerical Continuation", "Direct Simulation"],
    image: '/ch.png',
    coverImage: '/ch.png'
  },
  {
    name: 'SciML: Burger\'s Equation via Physics Informed Neural Networks (PINN)',
    description: ' Python project that utilizes Physics Informed Neural Networks (PINN) to learn the solution operator for Burger\'s equation.',
    demoLink: 'https://github.com/eigenan/SciML-Learning-Burgers-Equation-via-Physics-Informed-Neural-Networks',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "Physics Informed Neural Networks"],
    image: '/burger_output1.png',
    coverImage: '/burger_output1.png'
  },
  {
    name: 'SciML: Damped Harmonic Oscillator via NeuralODE',
    description: 'Python project that employs  Neural Ordinary Differential Equations (NeuralODE) to learn the dynamics of a damped harmonic oscillator.',
    demoLink: 'https://github.com/eigenan/SciML-Learning-Damped-Harmonic-Oscillator-via-Neural-ODE',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "NeuralODE"],
    image: '/neuralode_data.png',
    coverImage: '/neuralode_data.png'
  },
  {
    name: 'SciML: Damped Mass-Spring System via Hamiltonian Neural Networks (HNN)',
    description: 'Python project that utilizes Hamiltonian Neural Networks (HNN) to learn the dynamics of a mass-spring system, focusing on modeling the energy-dissipation properties of the system using neural networks.',
    demoLink: 'https://github.com/eigenan/SciML-Learning-Damped-Mass-Spring-via-Hamiltonian-Neural-Networks',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "Hamiltonian Neural Networks"],
    image: '/hnn1.png',
    coverImage: '/hnn1.png'
  },
  {
    name: 'SciML: Mass-Spring System via Hamiltonian Neural Networks (HNN)',
    description: 'Python project that utilizes Hamiltonian Neural Networks (HNN) to learn the dynamics of a damped mass-spring system, with a focus on modeling the energy-conserving properties of the system using neural networks.',
    demoLink: 'https://github.com/eigenan/SciML-Learning-Mass-Spring-via-Hamiltonian-Neural-Networks',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "Hamiltonian Neural Networks"],
    image: '/hnn2.png',
    coverImage: '/hnn2.png'
  },
  {
    name: 'SciML: 2D Darcy Flow and 1D Kuramoto-Sivashinsky via Fourier Neural Networks',
    description: 'Minimal Python projects that employs Fourier Neural Networks to learn the solution operator for 2D Darcy Flow and the 1D Kuramoto-Sivashinsky equation.',
    demoLink: 'https://github.com/eigenan/SciML-Darcy-Flow-and-Kuramoto-Sivashinsky-via-Fourier-Neural-Networks',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "Fourier Neural Networks"],
    image: '/darcy_output.png',
    coverImage: '/darcy_output.png'
  },
  {
    name: 'SciML: Advection Diffusion via DeepONet',
    description: 'Python project that uses Deep Operator Networks (DeepONet) to learn the solution operator for the advection-diffusion equation.',
    demoLink: 'https://github.com/eigenan/SciML-Learning-Advection-Diffusion-via-DeepONet',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Machine Learning", "DeepONet"],
    image: '/diff_onet_output.png',
    coverImage: '/diff_onet_output.png'
  },
  {
    name: 'Dynamical Bestiary: Allen-Cahn Equation',
    description: 'Python notebook for the Allen-Cahn equation. Explores pattern formations using numerical continuation and direct simulation methods.',
    demoLink: 'https://github.com/eigenan/Dynamical-Bestiary-Allen-Cahn-Equation',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Numerical Continuation", "Direct Simulation"],
    image: '/ac.png',
    coverImage: '/ac.png'
  },
  {
    name: 'Dynamical Bestiary: FitzHugh-Nagumo Equation',
    description: 'Python notebook for the FitzHugh-Nagumo equation. Explores pattern formations using numerical continuation methods.',
    demoLink: 'https://github.com/eigenan/Dynamical-Bestiary-FitzHugh-Nagumo-Equation',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Numerical Continuation", "Direct Simulation"],
    image: '/fn.png',
    coverImage: '/fn.png'
  },
  {
    name: 'Dynamical Bestiary: Bratu Equation',
    description: 'Python notebook for the Bratu equation. Explores pattern formations using numerical continuation methods.',
    demoLink: 'https://github.com/eigenan/Dynamical-Bestiary-Bratu-Equation',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Python", "Numerical Continuation", "Direct Simulation"],
    image: '/bratu.png',
    coverImage: '/bratu.png'
  },
  {
    name: 'Spiral Waves in the Theta Model',
    description: 'MATLAB project that explores spiral wave solutions in the theta model through a PDE formulation using time stepping and numerical continuation methods.',
    demoLink: 'https://github.com/eigenan/Spiral-Waves-in-Theta-Model',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["MATLAB", "Numerical Continuation"],
    image: '/spiral_eq.png',
    coverImage: '/spiral_eq.png',
    imageAlt: 'Relative equilibrium spiral solution for the theta model'
  },
  {
    name: 'Spiral Waves via Geometric Flows',
    description: 'MATLAB project that simulates 2D spiral waves using geometric flows. The simulation visualizes the formation and evolution of spiral wave patterns in a two-dimensional space.',
    demoLink: 'https://github.com/eigenan/2D-Spiral-Waves-via-Geometric-Flows',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["MATLAB", "Shooting Method"],
    paperLink: 'https://arxiv.org/abs/2312.07809',
    image: '/spiral.png',
    coverImage: '/spiral.png',
    imageAlt: 'Spiral wave simulation snapshot with core radius 50'
  },
  // {
  //   name: 'Gaji.id App',
  //   description: 'Payroll and HR Management Information System',
  //   demoLink: 'https://sellercraft.co',
  //   demoLinkRel: 'nofollow noopener noreferrer',
  //   tags: ["Data-driven", "Gaussian Process"],
  //   image: '/blog-placeholder-3.jpg',
  //   imageAlt: 'Gaji.id product screen'
  // },
  // {
  //   ...(await getRepositoryDetails('devaradise/paradise-ui')),
  //   name: 'Paradise UI',
  //   demoLink: 'https://paradise-ui.com',
  //   postLink: 'https://devaradise.com/how-i-build-paradise-ui-react-component-library/',
  //   tags: ["Front-end", "UI/UX"],
  //   image: '/blog-placeholder-4.jpg',
  //   imageAlt: 'Paradise UI component library preview'
  // },
  // {
  //   ...(await getRepositoryDetails('syakirurahman/react-lab')),
  //   name: 'React Lab',
  //   demoLink: 'https://devaradise.com/lab/react/',
  //   tags: ["Astro", "Web Development"],
  //   image: '/blog-placeholder-5.jpg',
  //   imageAlt: 'React Lab playground'
  // },
  // {
  //   ...(await getRepositoryDetails('syakirurahman/pokemon-catcher')),
  //   name: 'Pokemon Catcher',
  //   demoLink: 'https://pokemon-catcher-18636.web.app/',
  //   tags: ["Machine Learning", "UI/UX"],
  //   image: '/blog-placeholder-1.jpg',
  //   imageAlt: 'Pokemon Catcher web app'
  // },
  // {
  //   ...(await getRepositoryDetails('syakirurahman/movie-nominations')),
  //   name: 'Movie Nominations',
  //   demoLink: 'https://movie-nominations-c21c3.web.app/',
  //   tags: ["Pytorch", "React"],
  //   image: '/blog-placeholder-2.jpg',
  //   imageAlt: 'Movie Nominations interface'
  // },
  // {
  //   ...(await getRepositoryDetails('syakirurahman/organization-tree')),
  //   name: 'Organization tree',
  //   demoLink: 'https://organization-tree-2a446.web.app/',
  //   tags: ["Machine Learning", "Gaussian Process"],
  //   image: '/blog-placeholder-3.jpg',
  //   imageAlt: 'Organization tree visualization'
  // }
]
