import React from 'react';
import Table from './Table';
import { render } from 'enzyme';

const renderTable = (data, columns, components) =>
  render(
    <Table
      data={data}
      columns={columns}
      components={components}
      emptyMessage="There are no data rows."
    >
      {({ table }) => <div>{table}</div>}
    </Table>,
  );

const CustomTHead = ({ children }) => (
  <thead className="custom">{children}</thead>
);

describe('<Table />', () => {
  test('false is false', () => {
    expect(false).toEqual(false);
  });

  describe('when Header is overridden', () => {
    const data = [];
    const columns = [{ value: 'username', title: 'Username' }];

    test('it renders the same each time', () => {
      const tableWrapper = renderTable(data, columns);
      expect(tableWrapper).toMatchSnapshot();
    });

    test('it can override table layout', () => {
      const TableLayout = () => <table className="the-only-one" />;
      const tableWrapper = renderTable(data, columns, { TableLayout });
      const table = tableWrapper.find('table');
      expect(table).toHaveLength(1);
      expect(table.hasClass('the-only-one')).toBeTruthy();
    });

    test('it can override the thead', () => {
      const Header = () => <thead className="custom-thead">{}</thead>;
      const tableWrapper = renderTable(data, columns, { Header });
      const thead = tableWrapper.find('thead');
      expect(thead).toHaveLength(1);
      expect(thead.hasClass('custom-thead')).toBeTruthy();
    });

    test('it can override the table header row', () => {
      const HeaderRow = () => <tr className="custom-thead-row">{}</tr>;
      const tableWrapper = renderTable(data, columns, { HeaderRow });
      const theadRow = tableWrapper.find('thead tr');
      expect(theadRow).toHaveLength(1);
      expect(theadRow.hasClass('custom-thead-row')).toBeTruthy();
    });

    test('it can override the table header cells', () => {
      const HeaderCell = ({ title }) => (
        <th className="custom-thead-cell">{title}</th>
      );
      const tableWrapper = renderTable(data, columns, { HeaderCell });
      const theadCells = tableWrapper.find('thead tr th');
      expect(theadCells).toHaveLength(1);
      expect(theadCells.hasClass('custom-thead-cell')).toBeTruthy();
    });

    test('it can override the table body', () => {
      const TableBody = ({ title }) => (
        <tbody className="custom-thead-cell">{title}</tbody>
      );
      const tableWrapper = renderTable(data, columns, { TableBody });
      const tbody = tableWrapper.find('tbody');
      expect(tbody).toHaveLength(1);
      // expect(tbody.hasClass('custom-tbody')).toBeTruthy();
    });
  });
});
