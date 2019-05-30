import { generateColumns } from './Table.redux';

describe('<Table /> redux', () => {
  describe('setup', () => {
    test('true dat', () => {
      expect(true).toBeTruthy();
    });
  });

  describe('#generateColumns', () => {
    let columns;
    let addColumns;
    let alterColumns;

    beforeEach(() => {
      columns = [{ value: 'a', title: 'A' }];
      addColumns = [{ value: 'b', title: 'B' }];
      alterColumns = {};
    });

    test('combines the column config and additional columns', () => {
      const total = columns.length + addColumns.length;
      expect(generateColumns(columns, addColumns, alterColumns)).toHaveLength(
        total,
      );
    });

    test('alters columns with config', () => {
      alterColumns.a = { sortable: true };
      const columnConfig = generateColumns(columns, addColumns, alterColumns);
      const column = columnConfig.find(c => c.value === columns[0].value);
      expect(column.sortable).toBeTruthy();
    });

    test('alters columns does not change value key', () => {
      alterColumns.a = { value: 'c' };
      const columnConfig = generateColumns(columns, addColumns, alterColumns);
      const column = columnConfig.find(c => c.value === 'a');
      expect(column).not.toBeUndefined();
    });
  });
});
