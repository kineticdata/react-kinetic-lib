import React from 'react';
export const FieldTypeTable = ({ componentTypeMap }) => (
  <table>
    <thead>
      <tr>
        <th>Field Type</th>
        <th>Component Name</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(componentTypeMap)
        .filter(([key, value]) => key !== '__filemeta')
        .map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value.toString()}</td>
          </tr>
        ))}
    </tbody>
  </table>
);
