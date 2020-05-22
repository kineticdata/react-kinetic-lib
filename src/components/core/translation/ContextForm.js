import { generateForm } from '../../form/Form';
import {
  fetchKapps,
  fetchForms,
  createContext,
  updateContext,
} from '../../../apis';

const dataSources = ({ isDatastore }) => ({
  kapps: {
    fn: fetchKapps,
    params: [],
    transform: result => result.kapps,
  },
  forms: {
    fn: fetchForms,
    params: isDatastore && [{ datastore: isDatastore }],
    transform: result => result.forms,
  },
});

const handleSubmit = ({ contextName }) => values =>
  new Promise((resolve, reject) => {
    const context = values.toJS();
    (contextName
      ? updateContext({ contextName, context })
      : createContext({ context })
    ).then(({ context, error }) => {
      if (context) {
        resolve(context);
      } else {
        reject(error.message || 'There was an error saving the context');
      }
    });
  });

const fields = () => () => [
  {
    name: 'type',
    label: 'Type',
    type: 'radio',
    required: true,
    options: () => [
      { value: 'form', label: 'Form' },
      { value: 'datastore', label: 'Datastore' },
      { value: 'custom', label: 'Custom' },
    ],
  },
  {
    name: 'kapp',
    label: 'Kapp',
    type: 'text',
    required: false,
  },
  {
    name: 'form',
    label: 'Form',
    type: 'text',
    required: true,
  },
];

export const ContextForm = generateForm({
  dataSources,
  fields,
  handleSubmit,
});

ContextForm.displayName = 'ContextForm';
