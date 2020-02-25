import React from 'react';
import { PropRow, PropsTable } from '../PropsTable';
import { TypePopover } from '../TypePopover';

export const FormButtonProps = ({ formOptions }) => {
  return (
    <PropsTable>
      <PropRow
        description="Callback that can be put on a button to clear the current error message."
        name="clear"
        type="() => void"
      />
      <PropRow
        description="Tracks whether any field on the form is dirty."
        name="dirty"
        type="boolean"
      />
      <PropRow description="" name="error" type="string" />
      <PropRow
        description="Options passed to the form component from the page context."
        name="formOptions"
        type={<TypePopover name="FormOptions" typeSpec={formOptions} />}
      />
      <PropRow
        description="Can be called to reset the values of the form to their initial state."
        name="reset"
        type="() => void"
      />
      <PropRow
        description="Callback called to submit the form, usually should be place on the <button type='submit'> element."
        name="submit"
        type="(event?: Event) => void"
      />
      <PropRow
        description="Tracks whether the form is currently submitting (usually this means we are waiting for the response of a http api call."
        name="submitting"
        type="boolean"
      />
    </PropsTable>
  );
};
