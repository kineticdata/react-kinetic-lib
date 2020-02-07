import { generateTable } from '../../table/Table';
import { fetchWebApis } from '../../../apis';
import { WEB_API_METHODS } from './WebApiForm';

const dataSource = ({ kappSlug }) => ({
  fn: fetchWebApis,
  clientSideSearch: true,
  params: () => [
    {
      kappSlug,
    },
  ],
  transform: result => ({
    data: result.webApis,
  }),
});

const columns = [
  {
    value: 'slug',
    title: 'Slug',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'method',
    title: 'Method',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
    options: () =>
      WEB_API_METHODS.map(el => ({
        value: el,
        label: el,
      })),
  },
];

export const WebApiTable = generateTable({
  columns,
  dataSource,
});

WebApiTable.displayName = 'WebApiTable';
WebApiTable.defaultProps = {
  columns,
};
