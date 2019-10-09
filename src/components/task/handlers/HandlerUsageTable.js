import { generateTable } from '../../table/Table';
import { fetchHandlerUsage } from '../../../apis';

// const fetchHandlerUsage = (options = {}) => {
//   console.log('dataSource fetchHandlerUsage');
//   return Promise.resolve({
//     usages: [
//       {
//         type: 'Tree',
//         sourceName: 'Kinetic Request CE',
//         sourceGroup: 'Submissions > admin',
//         tree: 31,
//         usage: 'routine_kinetic_admin_kapp_submission_config_v1',
//         updatedAt: new Date(),
//       },
//     ],
//   });
// };

const dataSource = ({ definitionId }) => ({
  fn: fetchHandlerUsage,
  clientSideSearch: true,
  params: () => [{ definitionId }],
  transform: result => ({
    data: result.handlerUsage,
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
    value: 'source',
    title: 'Source',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'group',
    title: 'Group',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'name',
    title: 'Tree',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'nodeCount',
    title: 'Usage',
    filter: 'startsWith',
    type: 'text',
    sortable: true,
  },
  {
    value: 'updatedAt',
    title: 'Updated',
    filter: 'equals',
    type: 'text',
    sortable: true,
  },
];

export const HandlerUsageTable = generateTable({
  tableOptions: ['definitionId'],
  columns,
  dataSource,
});

HandlerUsageTable.displayName = 'HandlerUsageTable';
