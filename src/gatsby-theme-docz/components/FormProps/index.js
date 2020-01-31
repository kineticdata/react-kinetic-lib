import React, { Fragment, useState } from 'react';
import { TypePopover } from './TypePopover';
import { FieldProps } from './FieldProps';
import { FieldComponentProps } from './FieldComponentProps';
import { ObjectType } from './ObjectType';
import { PropsTable, PropRow } from './PropsTable';
import { FormLayoutProps } from './FormLayoutProps';
import { FormErrorProps } from './FormErrorProps';
import { FormButtonProps } from './FormButtonProps';

export const fieldTypeComponents = {
  attribute: 'AttributesField',
  checkbox: 'CheckboxField',
  code: 'CodeField',
  password: 'PasswordField',
  radio: 'RadioField',
  select: 'SelectField',
  'select-multi': 'SelectMultiField',
  team: 'TeamField',
  'team-multi': 'TeamMultiField',
  text: 'TextField',
  'text-multi': 'TextMultiField',
  user: 'UserField',
  'user-multi': 'UserMultiField',
};

const getBindingsType = dataSources =>
  dataSources.reduce(
    (reduction, dataSource) => ({
      ...reduction,
      [dataSource.name]: dataSource.type,
    }),
    {},
  );

const getFormOptionsType = formOptions =>
  formOptions.reduce(
    (reduction, formOption) => ({
      ...reduction,
      [formOption.name]: [formOption.type],
    }),
    {},
  );

const getAlterFieldsDescription = fields => (
  <>
    <div>
      Define customizations to the default field configurations to support a new
      use case. Use this prop to change the component used for a specific field
      or add additional constraints.
    </div>
    {fields
      .filter(field => field.description)
      .map(field => (
        <Fragment key={field.name}>
          <br />
          <strong style={{ fontFamily: 'monospace' }}>{field.name} </strong>
          {field.description}
        </Fragment>
      ))}
  </>
);

const AlterFieldsType = ({ fields, showType }) => (
  <ObjectType
    typeSpec={fields.reduce(
      (reduction, { name, type }) => ({
        ...reduction,
        [name]: <FieldTypeLink type={type} onClick={showType(type)} />,
      }),
      {},
    )}
  />
);

const ComponentsType = ({ showType }) => (
  <ObjectType
    typeSpec={Object.values(fieldTypeComponents)
      .sort()
      .reduce(
        (reduction, value) => ({
          ...reduction,
          [value]: <ComponentTypeLink type={value} showType={showType} />,
        }),
        {
          FormButtons: (
            <ComponentTypeLink type="FormButtons" showType={showType} />
          ),
          FormError: <ComponentTypeLink type="FormError" showType={showType} />,
          FormLayout: (
            <ComponentTypeLink type="FormLayout" showType={showType} />
          ),
        },
      )}
  />
);

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

const DataSourcesObjectType = () => (
  <ObjectType typeSpec={{ '[prop: string]': <a href="#">DataSource</a> }} />
);

const FieldTypeLink = ({ onClick, type = 'T' }) => (
  <a
    href="#"
    role="button"
    onClick={event => {
      event.preventDefault();
      onClick();
    }}
  >
    Field&lt;{type}&gt;
  </a>
);

const OrderedSetLink = ({ type = 'T' }) => (
  <>
    <a
      href="https://immutable-js.github.io/immutable-js/docs/#/OrderedSet"
      target="_blank"
      rel="noopener noreferrer"
    >
      OrderedSet
    </a>
    &lt;{type}&gt;
  </>
);

export const FormProps = ({ dataSources, fields, formOptions }) => {
  const [showingTypes, setShowingTypes] = useState([{ name: 'Props' }]);
  const showType = name => type => (...typeParams) => () => {
    setShowingTypes([...showingTypes, { name, type, typeParams }]);
  };
  const currentType = showingTypes[showingTypes.length - 1]['type'];
  return (
    <>
      <h3>
        {showingTypes.map(({ name, type, typeParams = [] }, i) => {
          const Wrapper = props =>
            i < showingTypes.length - 1 ? (
              <>
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setShowingTypes(showingTypes.slice(0, i + 1));
                  }}
                >
                  {props.children}
                </a>
                &nbsp;/&nbsp;
              </>
            ) : (
              <span>{props.children}</span>
            );
          return (
            <Wrapper key={i}>
              {name}
              {type && (
                <>
                  : {type}
                  <span style={{ fontFamily: 'monospace' }}>
                    {typeParams.length > 0 && `<${typeParams.join(', ')}>`}
                  </span>
                </>
              )}
            </Wrapper>
          );
        })}
      </h3>
      {currentType === 'Field' ? (
        <FieldProps
          bindings={getBindingsType(dataSources)}
          type={showingTypes[showingTypes.length - 1]['typeParams'][0]}
          showType={showType}
        />
      ) : Object.values(fieldTypeComponents).includes(currentType) ? (
        <FieldComponentProps type={currentType} />
      ) : currentType === 'FormButtons' ? (
        <FormButtonProps formOptions={getFormOptionsType(formOptions)} />
      ) : currentType === 'FormError' ? (
        <FormErrorProps />
      ) : currentType === 'FormLayout' ? (
        <FormLayoutProps
          bindings={getBindingsType(dataSources)}
          formOptions={getFormOptionsType(formOptions)}
        />
      ) : (
        <PropsTable>
          {formOptions.map(formOption => (
            <PropRow
              key={formOption.name}
              name={formOption.name}
              type={formOption.type}
              description={formOption.description}
            />
          ))}
          <PropRow
            name="addDataSources?"
            type={<DataSourcesObjectType />}
            description="Define additional data sources to be fetched by the form. Usually these will be used to fetch supporting data for additional/altered fields."
          />
          <PropRow
            name="addFields?"
            type={
              <>
                <FieldTypeLink onClick={showType('addFields')('Field')('T')} />
                []
              </>
            }
            description="Define additional fields to add to the form. The values of these fields will not be automatically submitted so they are usually used in the `serialize` function of built-in fields."
          />
          <PropRow
            name="alterFields?"
            type={
              <AlterFieldsType
                fields={fields}
                showType={showType('alterFields')('Field')}
              />
            }
            description={getAlterFieldsDescription(fields)}
          />
          <PropRow
            name="autoFocus?"
            type="string | number"
            description="When provided the specified field will be focused when the form initializes. Once the form is initialized, subsequent changes to this prop will result in focusing the new field."
          />

          <PropRow
            name="fieldSet?"
            type={
              <>
                <div>string[] |</div>
                <div>
                  ((fieldNames: <OrderedSetLink type="string" />) => string[] |{' '}
                  <OrderedSetLink type="string" />)
                </div>
              </>
            }
            description="Specify a subset of the fields that should be visible and included when the form is submitted. Useful for forms that are split into multiple tabs or steps."
          />
          <PropRow name="formKey?" odd type="string" />
          <PropRow
            name="onSave?"
            type={
              <>
                (
                <TypePopover
                  name="formOptions: O"
                  typeSpec={getFormOptionsType(formOptions)}
                />
                ) => (result: R) => void
              </>
            }
          />
          <PropRow
            name="onError?"
            type={
              <>
                (
                <TypePopover
                  name="formOptions: O"
                  typeSpec={getFormOptionsType(formOptions)}
                />
                ) => (error: unknown) => void
              </>
            }
          />
          <PropRow
            name="components?"
            type={<ComponentsType showType={showType('components')} />}
          />
        </PropsTable>
      )}
    </>
  );
};
