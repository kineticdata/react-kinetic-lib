import {
  fetchSystemDefaultTaskDbAdapter,
  fetchTaskDbAdapters,
  updateSystemDefaultTaskDbAdapter,
} from '../../apis/system';
import { generateForm } from '../form/Form';
import {
  adapterPropertiesFields,
  propertiesFromAdapters,
  propertiesFromValues,
} from './helpers';
import { getIn, Map } from 'immutable';
import { handleFormErrors } from '../../helpers';

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
  return updateSystemDefaultTaskDbAdapter({ adapter }).then(
    handleFormErrors('adapter'),
  );
};

const fields = () => ({
  defaultTaskDbAdapter,
  taskDbAdapters,
  adapterProperties,
}) => {
  if (taskDbAdapters && defaultTaskDbAdapter && adapterProperties) {
    const taskAdapters = adapterPropertiesFields({
      adapterProperties,
      defaultAdapter: defaultTaskDbAdapter,
    });
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
        initialValue: getIn(defaultTaskDbAdapter, ['adapter', 'type'], ''),
      },
      {
        name: 'properties',
        label: 'Task Adapter Properties',
        type: null,
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
