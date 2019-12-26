import React from 'react';

export const ColumnsTable = ({ columns }) => (
  <div>
    {columns &&
      columns.map(column => (
        <ul>
          <li>
            {column.value}
            {Object.entries(column).map(([key, value]) => (
              <ul>
                <li>
                  <strong>{key}: </strong>
                  {value.toString()}
                </li>
              </ul>
            ))}
          </li>
        </ul>
      ))}
  </div>
);
