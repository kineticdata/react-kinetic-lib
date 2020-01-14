import React from 'react';

export const ObjectType = ({ typeSpec }) => (
  <div>
    <div>{'{'}</div>
    {Object.entries(typeSpec).map(([key, value]) => (
      <div key={key}>
        &nbsp;&nbsp;{key}:&nbsp;{value}
      </div>
    ))}
    <div>{'}'}</div>
  </div>
);
