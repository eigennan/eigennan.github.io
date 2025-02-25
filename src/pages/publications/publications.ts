import { getRepositoryDetails } from "../../utils";

export interface Publications {
  name: string;
  demoLink: string;
  tags?: string[],
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  image: string;
  [key: string]: any;
}

export const publications: Publications[] = [
  {
    name: 'Example Paper 1',
    description: 'This is a paper about something',
    demoLink: 'https://arxiv.org',
    tags: ['Machine Learning', 'Deep Learning'],
    image: '/blog-placeholder-1.jpg'
  },
  {
    name: 'Example Paper 2',
    description: 'Yet another example paper',
    demoLink: 'https://doi.org',
    demoLinkRel: 'nofollow noopener noreferrer',
    postLink: 'https://eigenan.com',
    tags: ['Dynamical Systems', 'PDE'],
    image: '/blog-placeholder-2.jpg'
  },
  {
    ...(await getRepositoryDetails('devaradise/paradise-ui')),
    name: 'Paradise UI',
    demoLink: 'https://paradise-ui.com',
    postLink: 'https://devaradise.com/how-i-build-paradise-ui-react-component-library/',
    tags: ['React', 'UI Library'],
    image: '/blog-placeholder-3.jpg'
  },
]
