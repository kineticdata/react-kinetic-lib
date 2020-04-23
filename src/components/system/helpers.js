import { List } from 'immutable';

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

export const taskAdapterPropertiesFields = (adapterProperties, prefix = '') =>
  adapterProperties.map(properties => ({
    name: formPropertyName(
      prefix,
      'properties',
      properties.get('type'),
      properties.get('name'),
    ),
    label: properties.get('name'),
    visible: ({ values }) =>
      values.get(formPropertyName(prefix, 'type')) === properties.get('type'),
    type: properties.get('sensitive')
      ? 'password'
      : properties.has('options')
      ? 'select'
      : 'text',
    helpText: properties.get('description'),
    required: ({ values }) =>
      values.get(formPropertyName(prefix, 'type')) === properties.get('type') &&
      properties.get('required', false),
    transient: true,
    options: properties.get('options', undefined),
  }));
