import { generateTable } from '../../table/Table';
import { fetchOAuthClients } from '../../../apis';

const dataSource = () => ({
  fn: fetchOAuthClients,
  clientSideSearch: true,
  params: () => [],
  transform: result => ({
    data: result.oauthClients,
  }),
});

const columns = [
  {
    value: 'clientId',
    title: 'Client ID',
    sortable: true,
  },
  {
    value: 'description',
    title: 'Description',
    sortable: false,
  },
  {
    value: 'name',
    title: 'Name',
    filter: 'includes',
    type: 'text',
    sortable: true,
  },
  {
    value: 'redirectUri',
    title: 'Redirect URI',
    sortable: true,
  },
];

export const OAuthClientTable = generateTable({
  columns,
  dataSource,
});

OAuthClientTable.displayName = 'OAuthClientTable';
OAuthClientTable.defaultProps = {
  columns,
};
