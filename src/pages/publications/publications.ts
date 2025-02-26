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
    name: 'Example Paper 1',
    abstract: 'This is a paper about something',
    paperLink: 'https://arxiv.org',
    authors: [
        {
          name: 'John Doe',
          url: 'https://dynamicalsystems.example.com'
        },
        {
          name: 'Jane Doe',
          url: 'https://pde.example.com'
        }
      ],
    image: '/blog-placeholder-1.jpg',
    pdf: '/CV_Nan_Li.pdf'
  },
  {
    name: 'Example Paper 2',
    abstract: 'Yet another example paper',
    paperLink: 'https://doi.org',
    paperLinkRel: 'nofollow noopener noreferrer',
    postLink: 'https://eigenan.com',
    authors: ['Dynamical Systems', 'PDE'],
    image: '/blog-placeholder-2.jpg'
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
