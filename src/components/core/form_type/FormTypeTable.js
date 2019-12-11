import { generateTable } from '../../table/Table';
import { fetchFormTypes } from '../../../apis';

const dataSource = ({ kappSlug }) => ({
  fn: fetchFormTypes,
  clientSideSearch: true,
  params: () => [
    {
      kappSlug,
    },
  ],
  transform: result => {
    return {
      data: result.formTypes,
    };
  },
});

const columns = [
  {
    value: 'name',
    title: 'Form Type',
    filter: 'includes',
    type: 'text',
    sortable: false,
  },
];

export const FormTypeTable = generateTable({
  tableOptions: ['kappSlug'],
  columns,
  dataSource,
});

FormTypeTable.displayName = 'FormTypeTable';
FormTypeTable.defaultProps = {
  columns,
};
