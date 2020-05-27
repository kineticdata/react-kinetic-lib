import { generateForm } from '../../form/Form';
import {
  fetchKapps,
  fetchForms,
  createContext,
  updateContext,
} from '../../../apis';
import { Map } from 'immutable';

const dataSources = ({ datastore }) => ({
  kapps: {
    fn: fetchKapps,
    params: [],
    transform: result => result.kapps,
  },
  forms: {
    fn: fetchForms,
    params: [],
    // params: isDatastore && [{ datastore: isDatastore }],
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

const fields = ({ datastore }) => ({ kapps, forms }) =>
  kapps && [
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
      options: ({ kapps }) =>
        kapps.map(kapp =>
          Map({
            value: kapp.get('name'),
            label: kapp.get('name'),
          }),
        ),
      required: ({ values }) => values.get('type') === 'form',
      visible: ({ values }) => values.get('type') === 'form',
      transient: ({ values }) => !values.get('type') === 'form',
    },
    {
      name: 'form',
      label: 'Form',
      type: 'text',
      required: ({ values }) =>
        values.get('type') === 'form' || values.get('type') === 'datastore',
      visible: ({ values }) =>
        values.get('type') === 'form' || values.get('type') === 'datastore',
      transient: ({ values }) =>
        !values.get('type') === 'form' && !values.get('type') === 'datastore',
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: ({ values }) => values.get('type') === 'custom',
      visible: ({ values }) => values.get('type') === 'custom',
      transient: ({ values }) => !values.get('type') === 'custom',
    },
  ];

export const ContextForm = generateForm({
  formOptions: ['datastore', 'kappName'],
  dataSources,
  fields,
  handleSubmit,
});

ContextForm.displayName = 'ContextForm';
