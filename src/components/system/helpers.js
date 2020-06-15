import { getIn, List } from 'immutable';

export const propertiesFromAdapters = (taskDbAdapters = List()) =>
  taskDbAdapters.flatMap(adapter =>
    adapter
      .get('properties', List())
      .map(property => property.set('type', adapter.get('type'))),
  );

export const propertiesFromValues = (values, prefix = '') => {
  const adapterType = formPropertyName(prefix, 'type');
  const propertiesType = formPropertyName(
    prefix,
    'properties',
    values.get(adapterType),
  );
  return values
    .filter((value, name) => name.startsWith(propertiesType))
    .mapKeys(name => name.replace(`${propertiesType}_`, ''));
};

export const formPropertyName = (...names) =>
  names.filter(n => n !== '').join('_');

const getAdapterProperty = (adapter, propertyName) => {
  const property = adapter
    .getIn(['adapter', 'properties'], List())
    .find(p => p.get('name') === propertyName);

  return property ? property.get('value', null) : null;
};

const getPropertyValue = (property, defaultAdapter) => {
  const defaultType = getIn(defaultAdapter, ['adapter', 'type'], null);
  const type = property.get('type');
  const propertyValue = property.get('value', '') || '';

  if (defaultType && defaultType === type) {
    const defaultProperty = getAdapterProperty(
      defaultAdapter,
      property.get('name'),
    );

    return defaultProperty || propertyValue || '';
  } else {
    return propertyValue;
  }
};

export const adapterPropertiesFields = ({
  adapterProperties,
  defaultAdapter,
  prefix = '',
}) =>
  adapterProperties.map(property => {
    return {
      name: formPropertyName(
        prefix,
        'properties',
        property.get('type'),
        property.get('name'),
      ),
      label: property.get('label') || property.get('name'),
      visible: ({ values }) =>
        values.get(formPropertyName(prefix, 'type')) === property.get('type'),
      type: property.get('sensitive')
        ? 'password'
        : property.has('options')
        ? 'select'
        : 'text',
      helpText: property.get('description'),
      required: ({ values }) =>
        values.get(formPropertyName(prefix, 'type')) === property.get('type') &&
        property.get('required', false),
      transient: true,
      options: property.get('options', undefined),
      initialValue: getPropertyValue(property, defaultAdapter),
    };
  });
