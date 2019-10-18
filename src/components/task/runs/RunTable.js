import { fetchTaskRuns } from '../../../apis/task';
import { generateTable } from '../../table/Table';

const dataSource = () => ({
  fn: fetchTaskRuns,
  params: () => [
    {
      include: 'details',
    },
  ],
  transform: result => ({
    data: result.runs,
    nextPageToken: result.nextPageToken,
  }),
});

const columns = [
  {
    value: 'originatingId',
    title: 'Originating ID',
    sortable: false,
  },
];

export const RunsTable = generateTable({
  tableOptions: [],
  columns,
  dataSource,
});
