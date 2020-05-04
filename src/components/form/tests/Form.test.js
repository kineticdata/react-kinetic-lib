import React from 'react';
import { KineticLib } from '../../../index';
import { Form } from '../Form';
import { mount } from 'enzyme';

test('loads some stuff', async () => {
  const messageFn = jest.fn().mockResolvedValue(2);
  const result = mount(
    <KineticLib>
      <Form
        dataSources={() => ({
          message: {
            fn: messageFn,
            params: [],
          },
        })}
        formKey="test"
        fields={() => ({ message }) =>
          message && [{ name: 'test', type: 'text', initialValue: message }]}
        uncontrolled
      >
        {({ bindings, form, initialized }) =>
          initialized ? (
            <div data-testid="initialized-wrapper">{form}</div>
          ) : (
            <div data-testid="loading-wrapper">Loading</div>
          )
        }
      </Form>
    </KineticLib>,
  );
  await messageFn();
  result.update();
  expect(result).toMatchSnapshot();
});
