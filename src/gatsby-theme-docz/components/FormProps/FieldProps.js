import React, { Fragment } from 'react';
import { fieldTypeComponents } from './index';
import { PropRow, PropsTable } from './PropsTable';
import { TypePopover } from './TypePopover';

const join = (array, element) =>
  array.flatMap(current => [current, element]).slice(0, -1);

const ComponentTypeLink = ({ showType, type }) => (
  <a
    href="#"
    onClick={event => {
      event.preventDefault();
      showType(type)()();
    }}
  >
    {type}
  </a>
);

export const FieldProps = ({ add, alter, bindings, showType, type }) => {
  return (
    <PropsTable>
      <PropRow
        description=""
        name="component?"
        odd
        type={
          type === 'T' ? (
            join(
              Object.values(fieldTypeComponents)
                .sort()
                .map((c, i) => (
                  <ComponentTypeLink
                    key={i}
                    type={c}
                    showType={showType('component')}
                  />
                )),
              ' | ',
            )
          ) : (
            <ComponentTypeLink
              type={fieldTypeComponents[type]}
              showType={showType('component')}
            />
          )
        }
      />
      <PropRow
        description=""
        name="constraint?"
        type={
          <Fragment>
            boolean | ((
            <TypePopover name="bindings: B" typeSpec={bindings} />) => boolean)
          </Fragment>
        }
      />
      <PropRow description="" name="constraintMessage?" odd type="string" />
      <PropRow
        description=""
        name="enabled?"
        type={
          <Fragment>
            {'boolean | (('}
            <TypePopover name="bindings: B" typeSpec={bindings} />
            {') => boolean)'}
          </Fragment>
        }
      />
      <PropRow description="" name="helpText?" odd type="string" />
      <PropRow
        description=""
        name="label?"
        type={
          <Fragment>
            {'string | (('}
            <TypePopover name="bindings: B" typeSpec={bindings} />
            {') => string)'}
          </Fragment>
        }
      />
      {type === 'T' && (
        <PropRow description="" name="name" type="string" required />
      )}
      <PropRow description="" name="pattern?" odd type="RegExp" />
      <PropRow description="" name="patternMessage?" type="string" />
      <PropRow description="" name="placeholder?" odd type="string" />
      <PropRow
        description=""
        name="required?"
        type={
          <Fragment>
            {'boolean | (('}
            <TypePopover name="bindings: B" typeSpec={bindings} />
            {') => boolean)'}
          </Fragment>
        }
      />
      <PropRow description="" name="requiredMessage?" odd type="string" />
      <PropRow
        description=""
        name="serialize?"
        type={
          <Fragment>
            {'boolean | (('}
            <TypePopover name="bindings: B" typeSpec={bindings} />
            {') => V)'}
          </Fragment>
        }
      />
      <PropRow
        description=""
        name="transient?"
        odd
        type={
          <Fragment>
            {'boolean | (('}
            <TypePopover name="bindings: B" typeSpec={bindings} />
            {') => boolean)'}
          </Fragment>
        }
      />
      {type === 'T' && (
        <PropRow
          description=""
          name="type"
          type={Object.keys(fieldTypeComponents)
            .sort()
            .map(t => `'${t}'`)
            .join(' | ')}
          required
        />
      )}
      <PropRow
        description=""
        name="visible?"
        type={
          <Fragment>
            {'boolean | (('}
            <TypePopover name="bindings: B" typeSpec={bindings} />
            {') => boolean)'}
          </Fragment>
        }
      />
    </PropsTable>
  );
};
