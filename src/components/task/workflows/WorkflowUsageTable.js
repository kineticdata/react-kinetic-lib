import { generateTable } from '../../table/Table';

const fetchWorkflowUsage = (options = {}) => ({
  usages: [
    {
      type: 'Tree',
      sourceName: 'Kinetic Request CE',
      sourceGroup: 'Submissions > admin',
      tree: 31,
      usage: 'routine_kinetic_admin_kapp_submission_config_v1',
      updatedAt: new Date(),
    },
    {
      type: 'Tree',
      sourceName: 'Kinetic Request CE',
      sourceGroup: 'Submissions > admin',
      tree: 34,
      usage: 'routine_kinetic_admin_kapp_submission_config_v1',
      updatedAt: new Date(),
    },
  ],
});

const dataSource = ({ workflowType, itemId }) => ({
  fn: fetchWorkflowUsage,
  clientSideSearch: true,
  params: [{ type: workflowType || 'Routine', itemId }],
  transform: result => ({
    data: result.usages,
  }),
});

const columns = [
  {
    value: 'type',
    title: 'Type',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
  {
    value: 'sourceName',
    title: 'Source Name',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'sourceGroup',
    title: 'Source Group',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'tree',
    title: 'Tree',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'usage',
    title: 'Usage',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated At',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
];

export const WorkflowUsageTable = generateTable({
  tableOptions: ['workflowType', 'itemId'],
  columns,
  dataSource,
});

WorkflowUsageTable.displayName = 'WorkflowUsageTable';
