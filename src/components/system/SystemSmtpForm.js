import { generateForm } from '../form/Form';
import {
  fetchSystemDefaultSmtpAdapter,
  updateSystemDefaultSmtpAdapter,
} from '../../apis/system';
import { adapterPropertiesFields, propertiesFromValues } from './helpers';
import { handleFormErrors } from '../../helpers';

const dataSources = () => ({
  adapter: {
    fn: fetchSystemDefaultSmtpAdapter,
    params: [],
    transform: result => result.adapter,
  },
});

const handleSubmit = () => values =>
  updateSystemDefaultSmtpAdapter({ adapter: values.get('properties') }).then(
    handleFormErrors('adapter'),
  );

const fields = () => ({ adapter }) => {
  if (adapter) {
    const properties = adapterPropertiesFields({ adapterProperties: adapter });
    return [
      ...properties,
      {
        name: 'properties',
        label: 'SMTP Adapter Properties',
        type: 'text',
        required: false,
        visible: false,
        serialize: ({ values }) => propertiesFromValues(values),
      },
    ];
  }
};

export const SystemSmtpForm = generateForm({
  dataSources,
  fields,
  handleSubmit,
});

SystemSmtpForm.displayName = 'SystemMailForm';
