import { getRepositoryDetails } from "../../utils";

export interface Project {
  name: string;
  demoLink: string;
  tags?: string[],
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    name: 'Devaradise.com',
    description: 'A blog that sharing web development resources and tutorials',
    demoLink: 'https://devaradise.com',
    tags: ["JavaScript", "React"],
  },
  {
    name: 'Sellercraft App',
    description: 'An Ecommerce omnichannel platform in Southeast Asia',
    demoLink: 'https://sellercraft.co',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Machine Learning", "Pytorch"],
  },
  {
    name: 'Gaji.id App',
    description: 'Payroll and HR Management Information System',
    demoLink: 'https://sellercraft.co',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ["Data-driven", "Gausssian Process"],
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
