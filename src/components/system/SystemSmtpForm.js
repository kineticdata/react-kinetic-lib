import { generateForm } from '../form/Form';
import {
  fetchSystemDefaultSmtpAdapter,
  updateSystemDefaultSmtpAdapter,
} from '../../apis/system';
import { adapterPropertiesFields, propertiesFromValues } from './helpers';

const dataSources = () => ({
  adapter: {
    fn: fetchSystemDefaultSmtpAdapter,
    params: [],
    transform: result => result.adapter,
  },
});

const handleSubmit = () => values =>
  updateSystemDefaultSmtpAdapter({ adapter: values.get('properties') });

const fields = () => ({ adapter }) => {
  if (adapter) {
    const properties = adapterPropertiesFields(adapter);
    return (
      adapter && [
        ...properties,
        {
          name: 'properties',
          label: 'SMTP Adapter Properties',
          type: 'text',
          required: false,
          visible: false,
          serialize: ({ values }) => propertiesFromValues(values),
        },
      ]
    );
  }
};

export const SystemSmtpForm = generateForm({
  dataSources,
  fields,
  handleSubmit,
});

SystemSmtpForm.displayName = 'SystemMailForm';
