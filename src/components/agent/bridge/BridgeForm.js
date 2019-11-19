import { get, getIn, List, Map } from 'immutable';
import { generateForm } from '../../form/Form';
import {
  fetchBridge,
  createBridge,
  updateBridge,
  fetchAdapters,
} from '../../../apis';

const dataSources = ({ bridgeSlug }) => ({
  bridge: {
    fn: fetchBridge,
    params: bridgeSlug && [{ bridgeSlug, include: 'details' }],
    transform: result => result.bridge,
  },
  adapters: {
    fn: fetchAdapters,
    params: [{ include: 'details', type: 'bridge' }],
    transform: result => result.adapters,
  },
});

const handleSubmit = ({ bridgeSlug }) => values =>
  (bridgeSlug ? updateBridge : createBridge)({
    bridgeSlug,
    bridge: values.toJS(),
  }).then(({ bridge, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the model';
    }
    return bridge;
  });

const BRIDGE_FIELDS = ['slug', 'adapterClass', 'properties', 'linked'];

const fields = ({ bridgeSlug, adapterClass }) => ({ bridge, adapters }) => {
  let properties = [];
  const initialAdapterClass = get(bridge, 'adapterClass', adapterClass);

  if (adapters) {
    const adapter = adapters.find(a => a.get('class') === initialAdapterClass);

    const adapterProperties = adapter
      ? List(adapter.get('properties'))
      : List();

    properties = !adapterProperties.isEmpty()
      ? adapterProperties
          .map(property => ({
            name: property.get('name'),
            label: property.get('name'),
            type: property.get('sensitive') ? 'password' : 'text',
            required: property.get('required'),
            transient: true,
            initialValue: getIn(
              bridge,
              ['properties', property.get('name')],
              '',
            ),
          }))
          .toArray()
      : [];
  }

  if (adapters && (!bridgeSlug || (bridgeSlug && bridge))) {
    const fields =
      adapters &&
      (!bridgeSlug || (bridgeSlug && bridge)) &&
      [
        {
          name: 'slug',
          label: 'Bridge Slug',
          type: 'text',
          required: true,
          initialValue: get(bridge, 'slug', ''),
          helpText: 'Unique name used in the bridge path.',
        },
        {
          name: 'adapterClass',
          label: 'Adapter Class',
          type: 'text',
          enabled: false,
          required: false,
          initialValue: initialAdapterClass,
          options: adapters.map(adapter =>
            Map({
              value: adapter.get('class'),
              label: adapter.get('name'),
            }),
          ),
        },
        {
          name: 'properties',
          visible: false,
          initialValue: get(bridge, 'properties', {}),
          serialize: ({ values }) =>
            values.filter((v, k) => !BRIDGE_FIELDS.includes(k)).toJS(),
        },
      ].concat(properties);
    return fields;
  } else {
    return false;
  }
};

export const BridgeForm = generateForm({
  formOptions: ['bridgeSlug', 'adapterClass'],
  dataSources,
  fields,
  handleSubmit,
});

BridgeForm.displayName = 'BridgeForm';
