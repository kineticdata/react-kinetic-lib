import React from 'react';
import { PropRow, PropsTable } from '../PropsTable';

export const FormErrorProps = () => {
  return (
    <PropsTable>
      <PropRow
        description="Callback that can be put on a button to clear the current error message."
        name="clear"
        type="() => void"
      />
      <PropRow description="" name="error" type="string" />
    </PropsTable>
  );
};
