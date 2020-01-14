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
      showType(type)('')();
    }}
  >
    {type}
  </a>
);

export const FieldProps = ({ add, alter, bindings, showType, type }) => {
  return (
    <PropsTable>
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
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
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="constraint?"
        type={
          <Fragment>
            boolean | ((
            <TypePopover name="bindings: B" typeSpec={bindings} />) => boolean)
          </Fragment>
        }
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="constraintMessage?"
        odd
        type="string"
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="enabled?"
        type={
          <Fragment>
            {'boolean | (('}
            <TypePopover name="bindings: B" typeSpec={bindings} />
            {') => boolean)'}
          </Fragment>
        }
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="helpText?"
        odd
        type="string"
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
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
        <PropRow
          description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
          name="name"
          type="string"
          required
        />
      )}
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="pattern?"
        odd
        type="RegExp"
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="patternMessage?"
        type="string"
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="placeholder?"
        odd
        type="string"
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="required?"
        type={
          <Fragment>
            {'boolean | (('}
            <TypePopover name="bindings: B" typeSpec={bindings} />
            {') => boolean)'}
          </Fragment>
        }
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
        name="requiredMessage?"
        odd
        type="string"
      />
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
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
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
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
          description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
          name="type"
          type={Object.keys(fieldTypeComponents)
            .sort()
            .map(t => `'${t}'`)
            .join(' | ')}
          required
        />
      )}
      <PropRow
        description="asd fasdfasd fasdf asdfasdf asdfasdf asdf  asdfasdf asdfasdfasdfasdf sdasdfa"
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
