import {
  fetchSystemDefaultTaskDbAdapter,
  fetchTaskDbAdapters,
  updateSystemDefaultTaskDbAdapter,
} from '../../apis/system';
import { generateForm } from '../form/Form';
import {
  propertiesFromAdapters,
  propertiesFromValues,
  taskAdapterPropertiesFields,
} from './helpers';
import { get, Map } from 'immutable';

const dataSources = () => ({
  defaultTaskDbAdapter: {
    fn: fetchSystemDefaultTaskDbAdapter,
    params: [],
  },
  taskDbAdapters: {
    fn: fetchTaskDbAdapters,
    params: () => [],
    transform: result => result.adapters,
  },
  adapterProperties: {
    fn: propertiesFromAdapters,
    params: ({ taskDbAdapters }) => taskDbAdapters && [taskDbAdapters],
  },
});

const handleSubmit = () => values => {
  const adapter = values.toJS();
  return updateSystemDefaultTaskDbAdapter({ adapter });
};

const fields = () => ({
  defaultTaskDbAdapter,
  taskDbAdapters,
  adapterProperties,
}) => {
  if (taskDbAdapters && adapterProperties) {
    const taskAdapters = taskAdapterPropertiesFields(adapterProperties);
    return [
      {
        name: 'type',
        label: 'Task Adapter',
        type: 'select',
        options: ({ taskDbAdapters }) =>
          taskDbAdapters.map(adapter =>
            Map({
              label: adapter.get('name'),
              value: adapter.get('type'),
            }),
          ),
        initialValue: get(defaultTaskDbAdapter, 'type', ''),
      },
      {
        name: 'properties',
        label: 'Task Adapter Properties',
        type: 'text',
        required: false,
        visible: false,
        serialize: ({ values }) => propertiesFromValues(values),
      },
      ...taskAdapters,
    ];
  }
};

export const SystemTaskAdapterForm = generateForm({
  formOptions: [],
  dataSources,
  fields,
  handleSubmit,
});

SystemTaskAdapterForm.displayName = 'SystemTaskAdapterForm';
