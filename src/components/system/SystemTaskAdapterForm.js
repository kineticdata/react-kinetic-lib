import {
  fetchSystemDefaultTaskDbAdapter,
  updateSystemDefaultTaskDbAdapter,
} from '../../apis/system';
import { generateForm } from '../form/Form';
import {
  adapterProperties,
  MSSQL_FIELDS,
  ORACLE_FIELDS,
  POSTGRES_FIELDS,
  VALIDATE_DB_ADAPTERS,
} from './helpers';
import { getIn } from 'immutable';
import { handleFormErrors } from '../../helpers';

const dataSources = () => ({
  defaultTaskDbAdapter: {
    fn: fetchSystemDefaultTaskDbAdapter,
    params: [],
    transform: result => result.adapter,
  },
});

const handleSubmit = () => values => {
  const type = values.get('type');

  const adapter = {
    type,
    properties: adapterProperties(values, type),
  };
  return updateSystemDefaultTaskDbAdapter({ adapter }).then(
    handleFormErrors('adapter'),
  );
};

const fields = () => ({ defaultTaskDbAdapter }) =>
  defaultTaskDbAdapter && [
    {
      name: 'type',
      label: 'Task Adapter',
      type: 'select',
      options: VALIDATE_DB_ADAPTERS,
      initialValue: getIn(defaultTaskDbAdapter, ['type'], ''),
    },
    ...MSSQL_FIELDS('type', defaultTaskDbAdapter, [], null),
    ...ORACLE_FIELDS('type', defaultTaskDbAdapter, [], null),
    ...POSTGRES_FIELDS('type', defaultTaskDbAdapter, [], null),
  ];

export const SystemTaskAdapterForm = generateForm({
  formOptions: [],
  dataSources,
  fields,
  handleSubmit,
});

SystemTaskAdapterForm.displayName = 'SystemTaskAdapterForm';
