## Examples

### With no data provided

When the data passed into the `Table` is empty it will display the empty message.

```js static
<Table
  data={[]}
  columns={[{ value: 'username', title: 'Username' }]}
  emptyMessage="There are no data rows."
>
  {({ table }) => <div>{table}</div>}
</Table>
```

### With basic data

```js static
const data = [{ username: 'demo@acme.com', displayName: 'Demo User' }];
const columns = [
  {
    value: 'username',
    title: 'Username',
  },
  {
    value: 'displayName',
    title: 'Display Name',
  },
];
<Table emptyMessage="There are no data rows." data={data} columns={columns}>
  {({ table }) => <div>{table}</div>}
</Table>;
```

### If you need to custom render a field

```js static
const data = [
  {
    username: 'demo@acme.com',
    displayName: 'Demo User',
    spaceAdmin: false,
  },
  {
    username: 'demo-admin@acme.com',
    displayName: 'Demo Admin',
    spaceAdmin: true,
  },
];
const columns = [
  {
    value: 'username',
    title: 'Username',
  },
  {
    value: 'displayName',
    title: 'Display Name',
  },
  {
    value: 'spaceAdmin',
    title: 'Is Space Admin?',
    renderBodyCell: ({ content, row }) => (
      <td>{row.spaceAdmin ? 'Yes' : 'No'}</td>
    ),
  },
];
<Table emptyMessage="There are no data rows." data={data} columns={columns}>
  {({ table }) => <div>{table}</div>}
</Table>;
```

### Proposed props.

Current render props:

- renderHeader
- renderHeaderRow
- renderBody
- renderBodyRow
- renderFooter
- renderFooterRow
- render
- columns

  - renderBodyCell
  - renderHeaderCell
  - renderFooterCell

- customProps
  - header
  - body
  - ...?

```js static
import { FilterControl, PaginationControl } from 'react-kinetic-lib';

const SpaceAdminCell = props => {
  console.log('props', props);
  return <td>{props.value ? 'Yes' : 'No'}</td>;
};

const SpaceAdminFooter = () => <td>Space Admin ?</td>;

const data = [
  {
    username: 'demo@acme.com',
    displayName: 'Demo User',
    spaceAdmin: false,
  },
  {
    username: 'demo-admin@acme.com',
    displayName: 'Demo Admin',
    spaceAdmin: true,
  },
];
const columns = [
  {
    value: 'username',
    title: 'Username',
  },
  {
    value: 'displayName',
    title: 'Display Name',
  },
  {
    value: 'spaceAdmin',
    title: 'Is Space Admin?',
    components: {
      // HeaderCell,
      TableFooterCell: SpaceAdminFooter,
      TableBodyCell: SpaceAdminCell,
    },
  },
];

<Table
  data={data}
  components={{
    FilterControl,
    PaginationControl,
    // Header,
    // HeaderRow,
    // Footer,
    // FooterRow,
    // HeaderCell,
    // BodyCell,
    // EmptyBodyRow,
    // FooterCell,
    // PaginationControl,
    // FilterControl,
  }}
  columns={columns}
  omitHeader
  footer
  filtering
  pagination
  sorting
>
  {({ table, filter, pagination }) => (
    <div>
      {filter}
      {table}
      {pagination}
    </div>
  )}
</Table>;
```
