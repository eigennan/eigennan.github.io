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
  coverImage?: string;
  pdf: string;
  code?: string;
  bibtex?: string;
  journal?: string;
  tags?: string[];
  [key: string]: any;
  year?: number;
}

export const publications: Publications[] = [
  {
    name: 'Instability of anchored spirals in geometric flows',
    abstract: 'We investigate existence, stability, and instability of anchored rotating spiral waves in a model for geometric curve evolution. We find existence in a parameter regime limiting on a purely eikonal curve evolution. We study stability and instability both theoretically in this limiting regime and numerically, finding both oscillatory, at first convective instability, and saddle-node bifurcations. Our results in particular shed light onto instability of spiral waves in reaction-diffusion systems caused by an instability of wave trains against transverse modulations.',
    paperLink: 'https://arxiv.org/abs/2504.07270',
    authors: [
        {
          name: 'Anthony Cortez',
          url: 'https://cse.umn.edu/math/anthony-cortez'
        },
        {
          name: 'Nan Li',
          url: 'https://nanli.co'
        },
        {
          name: 'Nathan Mihm',
          url: ''
        },
        {
          name: 'Alice Xu',
          url: ''
        },
        {
          name: 'Xiaoxing Yu',
          url: ''
        },
        {
          name: 'Arnd Scheel',
          url: 'https://www.math.umn.edu/~scheel/'
        }
      ],
    journal: 'Preprint',
    year: 2025,
    image: '/instability.png',
    coverImage: '/instability.png',
    pdf: '/Instability of anchored spirals in geometric flows.pdf',
    bibtex: `@article{cortez2025instabilityanchoredspiralsgeometric,
      title={Instability of anchored spirals in geometric flows}, 
      author={Anthony Cortez and Nan Li and Nathan Mihm and Alice Xu and Xiaoxing Yu and Arnd Scheel},
      year={2025},
      eprint={2504.07270},
      archivePrefix={arXiv},
      primaryClass={nlin.PS},
      url={https://arxiv.org/abs/2504.07270}, 
      }`,
    tags: ["Preprint", "Geometric Flows", "Spiral Waves"],
  },
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
    journal: 'London Mathematical Society Lecture Note Series',
    year: 2024,
    image: '/spiral.png',
    coverImage: '/spiral.png',
    pdf: '/Anchored spirals in the driven curvature flow approximation.pdf',
    bibtex: `@article{li2024,
    title={Anchored spirals in the driven curvature flow approximation}, 
    author={Nan Li and Arnd Scheel},
    year={2024},
    eprint={2312.07809},
    archivePrefix={arXiv},
    primaryClass={nlin.PS},
    url={https://arxiv.org/abs/2312.07809}, 
    }`,
    tags: ["Journal Article", "Geometric Flows", "Spiral Waves"],
  },
  {
    name: 'Counting compatible indexing systems for $C_{p^n}$',
    abstract: 'We count the number of compatible pairs of indexing systems for the cyclic group $C_{p^n}$. Building on work of Balchin--Barnes--Roitzheim, we show that this sequence of natural numbers is another family of Fuss--Catalan numbers. We count this two different ways: showing how the conditions of compatibility give natural recursive formulas for the number of admissible sets and using an enumeration of ways to extend indexing systems by conceptually simpler pieces.',
    paperLink: 'https://doi.org/10.2140/om.2024.1.37',
    paperLinkRel: 'nofollow noopener noreferrer',
    journal: 'Orbita Mathematicae',
    pdf: '/ccis.pdf',
    authors: [
        {
            name: 'Michael A. Hill',
            url: 'https://mikehill.math.umn.edu'
        },
        {
            name: 'Jiayun Meng',
            url: ''
        },
        {
            name: 'Nan Li',
            url: 'https://nanli.co'
        }
      ],
    year: 2022,
    image: '/ccis.png',
    coverImage: '/ccis.png',
    bibtex: `@article{hill2022,
      title={Counting compatible indexing systems for
      $C_{p^n}$},
      author={Michael A. Hill and Jiayun Meng and Nan Li},
      journal={Orbita Mathematicae},
      year={2022},
    }`,
    tags: ["Journal Article", "Algebraic Topology"],
  },
]
