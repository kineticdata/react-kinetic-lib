import { generateTable } from '../../table/Table';
import { fetchPolicyRules } from '../../../apis';

const dataSource = () => ({
  fn: fetchPolicyRules,
  clientSideSearch: true,
  params: () => [{ include: 'details' }],
  transform: result => ({ data: result.policyRules }),
});

const columns = [
  {
    value: 'name',
    title: 'Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'type',
    title: 'Type',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'rule',
    title: 'Rule',
    type: 'text',
  },
  {
    value: 'message',
    title: 'Message',
    type: 'text',
  },
  {
    value: 'id',
    title: 'Id',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdAt',
    title: 'Created',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'createdBy',
    title: 'Created By',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated',
    sortable: true,
  },
  {
    value: 'updatedBy',
    title: 'Updated By',
    sortable: true,
  },
];

export const PolicyRuleTable = generateTable({
  columns,
  dataSource,
});
PolicyRuleTable.propTypes = {};
PolicyRuleTable.displayName = 'PolicyRuleTable';
