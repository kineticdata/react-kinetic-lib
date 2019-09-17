import t from 'prop-types';
import { generateTable } from '../../table/Table';
import { fetchAttributeDefinitions } from '../../../apis';

const dataSource = ({ kappSlug, attributeType }) => ({
  fn: fetchAttributeDefinitions,
  clientSideSearch: true,
  params: () => [
    {
      include: 'details',
      kappSlug,
      attributeType: attributeType + 'AttributeDefinitions',
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
    sortable: false,
  },
  {
    value: 'description',
    title: 'Description',
    sortable: false,
  },
  {
    value: 'allowsMultiple',
    title: 'Allows Multiple',
    sortable: false,
  },
];

export const AttributeDefinitionTable = generateTable({
  tableOptions: ['kappSlug', 'attributeType'],
  columns,
  dataSource,
});
AttributeDefinitionTable.displayName = 'AttributeDefinitionTable';
AttributeDefinitionTable.propTypes = {
  /** The Slug of the kapp required if the type of attribute is scoped to a kapp (ie, category * kapp attributes) */
  kappSlug: t.string,
  /** The type of attribute definition to display.   */
  attributeType: t.oneOf([
    'space',
    'team',
    'user',
    'userProfile',
    'category',
    'kapp',
    'form',
    'datastoreForm',
  ]).isRequired,
  /** The columns that should be displayed.   */
  columnSet: t.arrayOf(t.string),
};
