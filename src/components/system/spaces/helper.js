export const spaces = [
  {
    slug: 'acme',
    name: 'ACME',
    status: 'Pending',
    createdAt: '2019-08-19T20:30:47.818Z',
    createdBy: 'admin',
    updatedAt: '2019-11-19T20:30:47.818Z',
    updatedBy: 'matt',
    statusMessage: 'Still provisioning things.',
  },
  {
    slug: 'kinetic',
    name: 'Kinetic Data',
    createdAt: '2019-08-19T20:30:47.818Z',
    createdBy: 'admin',
    updatedAt: '2019-12-19T20:30:47.818Z',
    updatedBy: 'matt',
    status: 'Active',
    statusMessage: 'Ready.',
  },
];

export const fetchSystemTenants = () => Promise.resolve({ spaces });

export const fetchSystemTenant = ({ slug }) => {
  const space = spaces.find(space => space.slug === slug);

  return space
    ? Promise.resolve({ space })
    : Promise.reject({ error: 'Not Found' });
};

export const updateSystemTenant = ({ slug, tenant }) =>
  Promise.resolve({ tenant });

export const createSystemTenant = ({ tenant }) => Promise.resolve({ tenant });
