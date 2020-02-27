import React from 'react';
import { PropRow, PropsTable } from '../PropsTable';
import { TypePopover } from '../TypePopover';
import { ComponentsType, getTableOptionsType } from './index';

export const ColumnProps = ({ type, showType, tableOptions }) => {
  return (
    <PropsTable>
      <PropRow
        description=" The title that will be rendered in the header."
        name="title"
        odd
        type="string"
      />
      {type === 'T' && (
        <PropRow
          description="The value key that will be used to map the column to the data object."
          name="value"
          odd
          type="string"
        />
      )}
      <PropRow
        description="Flag that determines if the column can be used as a filter."
        name="filter"
        odd
        type="'includes' | 'equals' | 'startsWith' | 'in' | 'between' | 'timeline' | 'lt' | 'lteq' | 'gt' | 'gteq'"
      />
      <PropRow
        description="Initial value for the filter."
        name="initial"
        odd
        type="any"
      />
      {type === 'T' && (
        <PropRow
          description=" The type of column this is, typically used for determining the filter component."
          name="type"
          odd
          type="'text' | 'boolean'"
        />
      )}
      <PropRow
        description="A function that returns an array of objects with the keys `value` and `label`."
        name="options?"
        odd
        type={
          <>
            (
            <TypePopover
              name="tableOptions: O"
              typeSpec={getTableOptionsType(tableOptions)}
            />
            ) => (result: R) => void
          </>
        }
      />
      <PropRow
        description="Flag that determines if the column is sortable."
        name="sortable?"
        odd
        type="boolean"
      />
      <PropRow
        description="Allows overriding the components used for rendering a given column."
        name="components?"
        odd
        type={<ComponentsType showType={showType('components')} isColumn />}
      />
    </PropsTable>
  );
};
