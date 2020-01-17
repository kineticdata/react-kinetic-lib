import React from 'react';

const tableStyle = {
  borderCollapse: 'collapse',
};

const rowStyle = even => ({
  backgroundColor: even ? '#f6f6f6' : '#fff',
  fontSize: '1rem',
  lineHeight: '1.4',
  verticalAlign: 'top',
});

export const PropsTable = props => (
  <table style={tableStyle}>
    <tbody>
      {props.children
        .filter(child => child)
        .map((child, i) => (
          <tr key={i} style={rowStyle(i % 2 === 0)}>
            {child}
          </tr>
        ))}
    </tbody>
  </table>
);

export const PropRow = ({ description, name, type }) => (
  <>
    <td style={{ padding: '.75rem' }}>{name}</td>
    <td style={{ fontFamily: 'monospace', padding: '.75rem' }}>{type}</td>
    <td style={{ padding: '.75rem', width: '40%' }}>{description}</td>
  </>
);
