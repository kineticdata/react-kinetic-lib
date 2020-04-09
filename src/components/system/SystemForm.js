import { get } from 'immutable';
import { generateForm } from '../form/Form';

const DISPLAY_TYPES = ['Display Page', 'Redirect', 'Default'];

const fetchSystemConfiguration = () =>
  Promise.resolve({
    systemConfiguration: {
      displayPageType: 'Display Page',
      displayPageValue: '',
    },
  });

const updateSystemConfiguration = () => Promise.resolve();

const handleSubmit = () => values => {
  return updateSystemConfiguration({ systemConfiguration: values });
};

const dataSources = () => ({
  systemConfiguration: {
    fn: fetchSystemConfiguration,
    params: [],
    transform: result => result.systemConfiguration,
  },
});

const fields = () => ({ systemConfiguration }) => [
  {
    name: 'displayPageType',
    label: 'Page Display Type',
    type: 'select',
    options: DISPLAY_TYPES.map(displayType => ({
      value: displayType,
      label: displayType,
    })),
    required: true,
    initialValue: get(systemConfiguration, 'displayPageType') || 'Display Page',
    helpText:
      'Determines how the application works. For kinops, Single Page App is used.',
  },
  {
    name: 'displayPageValue',
    label: 'Page Display Value',
    type: 'text',
    visible: ({ values }) => get(values, 'displayPageType') !== 'Default',
    required: ({ values }) => get(values, 'displayPageType') !== 'Default',
  },
];

export const SystemForm = generateForm({
  formOptions: [],
  dataSources,
  fields,
  handleSubmit,
});

SystemForm.displayName = 'SystemForm';
