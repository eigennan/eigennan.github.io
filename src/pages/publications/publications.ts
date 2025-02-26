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
  [key: string]: any;
}

export const publications: Publications[] = [
  {
    name: 'Anchored spirals in the driven curvature flow approximation',
    abstract: 'We study existence, asymptotics, and stability of spiral waves in a driven curvature approximation, supplemented with an anchoring condition on a circle of finite radius. We analyze the motion of curves written as graphs in polar coordinates, finding spiral waves as rigidly rotating shapes. The existence analysis reduces to a planar ODE and asymptotics are given through center manifold expansions. In the limit of a large core, we find rotation frequencies and corrections starting form a problem without curvature corrections. Finally, we demonstrate orbital stability of spiral waves by exploiting a comparison principle inherent to curvature driven flow.',
    paperLink: 'https://arxiv.org',
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
    image: '/spiral.png',
    pdf: '/Anchored spirals in the driven curvature flow approximation.pdf'
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
  {
    ...(await getRepositoryDetails('devaradise/paradise-ui')),
    name: 'Paradise UI',
    paperLink: 'https://paradise-ui.com',
    postLink: 'https://devaradise.com/how-i-build-paradise-ui-react-component-library/',
    authors: ['React', 'UI Library'],
    image: '/blog-placeholder-3.jpg'
  },
]
