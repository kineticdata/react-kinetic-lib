import React from 'react';
import { KineticLib } from '@kineticdata/react';
import { mount, render } from 'enzyme';
import { List } from 'immutable';
import { users } from '../../../styleguide/fixtures';
import Table, {
  buildTable,
  buildTableHeader,
  buildTableHeaderRow,
  buildTableHeaderCell,
  buildTableBody,
  buildTableBodyRows,
  buildTableBodyCells,
  buildTableFooter,
  buildTableFooterRow,
  buildTableFooterCells,
} from './Table';

describe('<Table />', () => {
  describe('build methods', () => {
    let props;
    let data = [];
    let columns = [];

    beforeEach(() => {
      data = users(2);
      columns = [{ value: 'username', title: 'Username' }];
      props = {
        components: {},
        data,
        columns,
        rows: List(data),
      };
    });

    describe('#buildTable', () => {
      test('it renders normally', () => {
        const wrapper = render(<KineticLib>{buildTable(props)}</KineticLib>);

        expect(wrapper.is('table')).toBeTruthy();
        expect(wrapper.is('table.custom-table')).toBeFalsy();
      });

      test('it renders a custom table', () => {
        const TableLayout = () => <table className="custom-table" />;

        props.components.TableLayout = TableLayout;
        const wrapper = render(<KineticLib>{buildTable(props)}</KineticLib>);

        expect(wrapper.is('table.custom-table')).toBeTruthy();
      });
    });

    describe('#buildTableHeader', () => {
      test('it renders normally', () => {
        const wrapper = render(
          <KineticLib>{buildTableHeader(props)}</KineticLib>,
        );

        expect(wrapper.is('thead')).toBeTruthy();
        expect(wrapper.is('thead.custom-thead')).toBeFalsy();
      });

      test('it renders a custom thead', () => {
        const Header = () => <thead className="custom-thead" />;

        props.components.Header = Header;
        const wrapper = render(
          <KineticLib>{buildTableHeader(props)}</KineticLib>,
        );

        expect(wrapper.is('thead.custom-thead')).toBeTruthy();
      });
    });

    describe('#buildTableHeaderRow', () => {
      test('it renders normally', () => {
        const wrapper = render(
          <KineticLib>{buildTableHeaderRow(props)}</KineticLib>,
        );

        expect(wrapper.is('tr')).toBeTruthy();
        expect(wrapper.is('tr.custom-tr')).toBeFalsy();
      });

      test('it renders a custom thead', () => {
        const HeaderRow = () => <tr className="custom-tr" />;

        props.components.HeaderRow = HeaderRow;
        const wrapper = render(
          <KineticLib>{buildTableHeaderRow(props)}</KineticLib>,
        );

        expect(wrapper.is('tr.custom-tr')).toBeTruthy();
      });
    });

    describe('#buildTableHeaderCell', () => {
      test('it renders normally', () => {
        const column = columns[0];
        const wrapper = render(
          <KineticLib>{buildTableHeaderCell(props)(column, 0)}</KineticLib>,
        );

        expect(wrapper.is('th')).toBeTruthy();
        expect(wrapper.is('td.custom-td')).toBeFalsy();
      });

      test('it renders a custom th', () => {
        const column = columns[0];
        const HeaderCell = () => <th className="custom-th" />;
        props.components.HeaderCell = HeaderCell;

        const wrapper = render(
          <KineticLib>{buildTableHeaderCell(props)(column, 0)}</KineticLib>,
        );

        expect(wrapper.is('th.custom-th')).toBeTruthy();
      });

      test('it renders a custom th for a specific column', () => {
        const column = columns[0];
        const HeaderCell = () => <th className="custom-cell-th" />;
        column.components = { HeaderCell };

        const wrapper = render(
          <KineticLib>{buildTableHeaderCell(props)(column, 0)}</KineticLib>,
        );

        expect(wrapper.is('th.custom-cell-th')).toBeTruthy();
      });
    });

    describe('#buildTableBody', () => {
      test('it renders normally', () => {
        const wrapper = render(
          <KineticLib>{buildTableBody(props)}</KineticLib>,
        );

        expect(wrapper.is('tbody')).toBeTruthy();
        expect(wrapper.is('tbody.custom-tbody')).toBeFalsy();
      });

      test('it renders a custom tbody', () => {
        const Header = () => <tbody className="custom-tbody" />;

        props.components.Header = Header;
        const wrapper = render(
          <KineticLib>{buildTableHeader(props)}</KineticLib>,
        );

        expect(wrapper.is('tbody.custom-tbody')).toBeTruthy();
      });
    });

    describe('#buildTableBodyRows', () => {
      test('it renders rows normally', () => {
        const wrapper = render(
          <KineticLib>
            <table>
              <tbody>{buildTableBodyRows(props)}</tbody>
            </table>
          </KineticLib>,
        );

        expect(wrapper.find('tr')).toHaveLength(props.rows.size);
        expect(
          wrapper
            .find('tr')
            .first()
            .hasClass('custom-tr'),
        ).toBeFalsy();
      });

      test('it renders custom rows', () => {
        const BodyRow = () => <tr className="custom-tr" />;
        props.components.BodyRow = BodyRow;

        const wrapper = render(
          <KineticLib>
            <table>
              <tbody>{buildTableBodyRows(props)}</tbody>
            </table>
          </KineticLib>,
        );

        expect(wrapper.find('tr')).toHaveLength(props.rows.size);
        expect(
          wrapper
            .find('tr')
            .first()
            .hasClass('custom-tr'),
        ).toBeTruthy();
      });

      test('it renders default empty row', () => {
        props.rows = List([]);

        const wrapper = render(
          <KineticLib>
            <table>
              <tbody>{buildTableBodyRows(props)}</tbody>
            </table>
          </KineticLib>,
        );

        expect(wrapper.find('tr')).toHaveLength(1);
        expect(
          wrapper
            .find('tr')
            .first()
            .hasClass('custom-empty-tr'),
        ).toBeFalsy();
      });

      test('it renders custom empty row', () => {
        const EmptyBodyRow = () => <tr className="custom-empty-tr" />;
        props.rows = List([]);
        props.components.EmptyBodyRow = EmptyBodyRow;

        const wrapper = render(
          <KineticLib>
            <table>
              <tbody>{buildTableBodyRows(props)}</tbody>
            </table>
          </KineticLib>,
        );

        expect(wrapper.find('tr')).toHaveLength(1);
        expect(wrapper.find('tr').hasClass('custom-empty-tr')).toBeTruthy();
      });
    });

    describe('#buildTableBodyCells', () => {
      test('it renders cells normally', () => {
        const wrapper = render(
          <KineticLib>
            <table>
              <tbody>
                <tr>{buildTableBodyCells(props, props.rows.first(), 0)}</tr>
              </tbody>
            </table>
          </KineticLib>,
        );

        expect(wrapper.find('tr td')).toHaveLength(1);
        expect(
          wrapper
            .find('tr td')
            .first()
            .hasClass('custom-td'),
        ).toBeFalsy();
      });

      test('it renders custom cells', () => {
        const BodyCell = () => <td className="custom-td" />;
        // props.columns = [...props.columns, { value: 'displayName', title: 'DisplayName'}]
        props.components.BodyCell = BodyCell;

        const wrapper = render(
          <KineticLib>
            <table>
              <tbody>
                <tr>{buildTableBodyCells(props, props.rows.first(), 0)}</tr>
              </tbody>
            </table>
          </KineticLib>,
        );

        expect(wrapper.find('tr td')).toHaveLength(props.columns.length);
        expect(
          wrapper
            .find('tr td')
            .first()
            .hasClass('custom-td'),
        ).toBeTruthy();
      });

      test('it renders custom column cells', () => {
        const BodyCell = () => <td className="custom-td" />;
        props.columns = [
          ...props.columns,
          {
            value: 'displayName',
            title: 'DisplayName',
            components: { BodyCell },
          },
        ];

        const wrapper = render(
          <KineticLib>
            <table>
              <tbody>
                <tr>{buildTableBodyCells(props, props.rows.first(), 0)}</tr>
              </tbody>
            </table>
          </KineticLib>,
        );

        expect(wrapper.find('tr td')).toHaveLength(props.columns.length);
        expect(
          wrapper
            .find('tr td')
            .first()
            .hasClass('custom-td'),
        ).toBeFalsy();
        expect(
          wrapper
            .find('tr td')
            .last()
            .hasClass('custom-td'),
        ).toBeTruthy();
      });
    });

    describe('#buildTableFooter', () => {
      test('it does not render normally', () => {
        const wrapper = render(
          <KineticLib>{buildTableFooter(props)}</KineticLib>,
        );

        expect(wrapper.is('tfoot')).toBeFalsy();
      });

      test('it renders with includeFooter', () => {
        props.includeFooter = true;
        const wrapper = render(
          <KineticLib>{buildTableFooter(props)}</KineticLib>,
        );

        expect(wrapper.is('tfoot')).toBeTruthy();
        expect(wrapper.is('tfoot.custom-tfoot')).toBeFalsy();
      });

      test('it renders a custom tfoot', () => {
        const Footer = () => <tfoot className="custom-tfoot" />;
        props.includeFooter = true;
        props.components.Footer = Footer;

        const wrapper = render(
          <KineticLib>{buildTableFooter(props)}</KineticLib>,
        );

        expect(wrapper.is('tfoot.custom-tfoot')).toBeTruthy();
      });
    });

    describe('#buildTableFooterRow', () => {
      test('it renders normally', () => {
        const wrapper = render(
          <KineticLib>{buildTableFooterRow(props)}</KineticLib>,
        );

        expect(wrapper.is('tr')).toBeTruthy();
        expect(wrapper.is('tr.custom-tr')).toBeFalsy();
      });

      test('it renders a custom tr', () => {
        const FooterRow = () => <tr className="custom-tr" />;

        props.components.FooterRow = FooterRow;
        const wrapper = render(
          <KineticLib>{buildTableFooterRow(props)}</KineticLib>,
        );

        expect(wrapper.is('tr.custom-tr')).toBeTruthy();
      });
    });

    describe('#buildTableFooterCells', () => {
      test('it renders normally', () => {
        const wrapper = render(
          <KineticLib>{buildTableFooterCells(props)}</KineticLib>,
        );

        expect(wrapper.first().is('td')).toBeTruthy();
        expect(wrapper.first().is('td.custom-td')).toBeFalsy();
      });

      test('it renders a custom td', () => {
        const FooterCell = () => <td className="custom-td" />;
        props.components.FooterCell = FooterCell;

        const wrapper = render(
          <KineticLib>{buildTableFooterCells(props)}</KineticLib>,
        );

        expect(wrapper.is('td.custom-td')).toBeTruthy();
      });

      test('it renders a custom td for a specific column', () => {
        const FooterCell = () => <td className="custom-td" />;
        props.columns = [
          ...props.columns,
          {
            value: 'displayName',
            title: 'DisplayName',
            components: { FooterCell },
          },
        ];

        const wrapper = render(
          <KineticLib>
            <tfoot>
              <tr>{buildTableFooterCells(props)}</tr>
            </tfoot>
          </KineticLib>,
        );

        expect(wrapper.find('td')).toHaveLength(props.columns.length);
        expect(
          wrapper
            .find('td')
            .first()
            .hasClass('custom-td'),
        ).toBeFalsy();
        expect(
          wrapper
            .find('td')
            .last()
            .hasClass('custom-td'),
        ).toBeTruthy();
      });
    });
  });
});
