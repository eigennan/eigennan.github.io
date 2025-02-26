import { getRepositoryDetails } from "../../utils";

export interface Publications {
  name: string;
  paperLink: string;
  authors?: {
    name: string;
    url?: string;
  }[];
  abstract?: string;
  postLink?: string;
  paperLinkRel?: string;
  image: string;
  pdf: string;
  code?: string;
  bibtex?: string;
  journal?: string;
  [key: string]: any;
}

export const publications: Publications[] = [
  {
    name: 'Anchored spirals in the driven curvature flow approximation',
    abstract: 'We study existence, asymptotics, and stability of spiral waves in a driven curvature approximation, supplemented with an anchoring condition on a circle of finite radius. We analyze the motion of curves written as graphs in polar coordinates, finding spiral waves as rigidly rotating shapes. The existence analysis reduces to a planar ODE and asymptotics are given through center manifold expansions. In the limit of a large core, we find rotation frequencies and corrections starting form a problem without curvature corrections. Finally, we demonstrate orbital stability of spiral waves by exploiting a comparison principle inherent to curvature driven flow.',
    paperLink: 'https://doi.org/10.48550/arXiv.2312.07809',
    authors: [
        {
          name: 'Nan Li',
          url: 'https://nanli.co'
        },
        {
          name: 'Arnd Scheel',
          url: 'https://www.math.umn.edu/~scheel/'
        }
      ],
    journal: 'London Math. Soc. Lecture Note Ser.',
    image: '/spiral.png',
    pdf: '/Anchored spirals in the driven curvature flow approximation.pdf',
    code: 'https://github.com',
    bibtex: `@misc{li2024anchoredspiralsdrivencurvature,
    title={Anchored spirals in the driven curvature flow approximation}, 
    author={Nan Li and Arnd Scheel},
    year={2024},
    eprint={2312.07809},
    archivePrefix={arXiv},
    primaryClass={nlin.PS},
    url={https://arxiv.org/abs/2312.07809}, 
    }`,
  },
  {
    name: 'Counting compatible indexing systems for $C_{p^n}$',
    abstract: 'We count the number of compatible pairs of indexing systems for the cyclic group $C_{p^n}$. Building on work of Balchin--Barnes--Roitzheim, we show that this sequence of natural numbers is another family of Fuss--Catalan numbers. We count this two different ways: showing how the conditions of compatibility give natural recursive formulas for the number of admissible sets and using an enumeration of ways to extend indexing systems by conceptually simpler pieces.',
    paperLink: 'https://doi.org/10.2140/om.2024.1.37',
    paperLinkRel: 'nofollow noopener noreferrer',
    pdf: '/ccis.pdf',
    authors: [
        {
            name: 'Michael A. Hill',
            url: 'https://mikehill.math.umn.edu'
        },
        {
            name: 'Jiayun Meng'
        },
        {
            name: 'Nan Li',
            url: 'https://nanli.co'
        }
      ],
    image: '/ccis.png',
  },
]
