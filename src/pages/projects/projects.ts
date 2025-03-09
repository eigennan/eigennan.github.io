import { getRepositoryDetails } from "../../utils";

export interface Project {
  name: string;
  demoLink: string;
  tags?: string[],
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  paperLink?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    name: 'Devaradise.com',
    description: 'A blog that sharing web development resources and tutorials',
    demoLink: 'https://devaradise.com',
    tags: ["JavaScript", "React"],
    paperLink: 'https://devaradise.com',
  },
  {
    name: 'Sellercraft App',
    description: 'We count the number of compatible pairs of indexing systems for the cyclic group $C_{p^n}$. Building on work of Balchin--Barnes--Roitzheim, we show that this sequence of natural numbers is another family of Fuss--Catalan numbers. We count this two different ways: showing how the conditions of compatibility give natural recursive formulas for the number of admissible sets and using an enumeration of ways to extend indexing systems by conceptually simpler pieces.',
    demoLink: 'https://sellercraft.co',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Machine Learning", "Pytorch"],
  },
  {
    name: 'Gaji.id App',
    description: 'Payroll and HR Management Information System',
    demoLink: 'https://sellercraft.co',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Data-driven", "Gaussian Process"],
  },
  {
    ...(await getRepositoryDetails('devaradise/paradise-ui')),
    name: 'Paradise UI',
    demoLink: 'https://paradise-ui.com',
    postLink: 'https://devaradise.com/how-i-build-paradise-ui-react-component-library/',
    tags: ["Front-end", "UI/UX"],
  },
  {
    ...(await getRepositoryDetails('syakirurahman/react-lab')),
    name: 'React Lab',
    demoLink: 'https://devaradise.com/lab/react/',
    tags: ["Astro", "Web Development"],
  },
  {
    ...(await getRepositoryDetails('syakirurahman/pokemon-catcher')),
    name: 'Pokemon Catcher',
    demoLink: 'https://pokemon-catcher-18636.web.app/',
    tags: ["Machine Learning", "UI/UX"],
  },
  {
    ...(await getRepositoryDetails('syakirurahman/movie-nominations')),
    name: 'Movie Nominations',
    demoLink: 'https://movie-nominations-c21c3.web.app/',
    tags: ["Pytorch", "React"],
  },
  {
    ...(await getRepositoryDetails('syakirurahman/organization-tree')),
    name: 'Organization tree',
    demoLink: 'https://organization-tree-2a446.web.app/',
    tags: ["Machine Learning", "Gaussian Process"],
  }
]
