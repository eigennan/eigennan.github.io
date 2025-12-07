import { getRepositoryDetails } from "../../utils";

export interface Project {
  name: string;
  demoLink: string;
  tags?: string[];
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  paperLink?: string;
  image?: string;
  imageAlt?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    name: 'Spiral Waves via Geometric Flows',
    description: 'MATLAB project that simulates 2D spiral waves using geometric flows. The simulation visualizes the formation and evolution of spiral wave patterns in a two-dimensional space.',
    demoLink: 'https://github.com/eigenan/2D-Spiral-Waves-via-Geometric-Flows',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["MATLAB", "Numerical Simulation"],
    paperLink: 'https://arxiv.org/abs/2312.07809',
    image: '/spiral50.png',
    imageAlt: 'Spiral wave simulation snapshot with core radius 50'
  },
  {
    name: 'Spiral Waves in the ThetaModel',
    description: 'MATLAB project that explores spiral wave solutions in the theta model through a PDE formulation using time stepping and numerical continuation methods.',
    demoLink: 'https://github.com/eigenan/Spiral-Waves-in-Theta-Model',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["MATLAB", "Numerical Continuation"],
    image: '/spiral_eq.png',
    imageAlt: 'Relative equilibrium spiral solution for the theta model'
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
