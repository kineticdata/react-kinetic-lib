import { generateTable } from '../../table/Table';
import { fetchAttributeDefinitions } from '../../../apis';

const dataSource = ({ kappSlug, attributeType }) => ({
  fn: fetchAttributeDefinitions,
  clientSideSearch: true,
  params: () => [
    {
      include: 'details',
      kappSlug,
      attributeType,
    },
  ],
  transform: result => {
    return {
      data: result.attributeDefinitions,
    };
  },
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filterable: false,
    sortable: false,
  },
  {
    value: 'description',
    title: 'Description',
    filterable: false,
    sortable: false,
  },
];

export const AttributeDefinitionTable = generateTable({
  tableOptions: ['kappSlug', 'attributeType'],
  columns,
  dataSource,
});
AttributeDefinitionTable.displayName = 'AttributeDefinitionTable';
AttributeDefinitionTable.defaultProps = {
  columns,
};
