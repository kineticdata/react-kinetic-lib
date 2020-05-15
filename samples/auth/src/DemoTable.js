import { generateTable } from '@kineticdata/react'

const columns = [
  { value: 'name', title: 'Name', sortable: true, filter: 'startsWith' },
  { value: 'status', title: 'Status', sortable: false, filter: 'equals' }
];

const filters = () => ({ statuses }) => statuses && [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'status', label: 'Status', type: 'select', options: statuses },
]

const filterDataSources = () => ({
  statuses: {
    fn: () => Promise.resolve({
      statusTypes: [
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }),
    params: [],
    transform: result => result.statusTypes,
  }
})

const dataSource = () => ({
  fn: () =>
    Promise.resolve({
      demos: [
        { name: 'Row 1', status: 'active' },
        { name: 'Row 2', status: 'pending' },
        { name: 'Row 3', status: 'inactive' },
        { name: 'Rad 1', status: 'pending' },
        { name: 'Rad 2', status: 'inactive' },
        { name: 'Rad 3', status: 'active' },
      ],
    }),
  params: () => [],
  transform: result => ({ data: result.demos }),
  clientSideSearch: true
})
export const DemoTable = generateTable({
  columns,
  dataSource,
  // filters,
  // filterDataSources
});