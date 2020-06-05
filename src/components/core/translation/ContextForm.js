import { generateForm } from '../../form/Form';
import {
  fetchKapps,
  fetchForms,
  createContext,
  updateContext,
} from '../../../apis';
import { Map } from 'immutable';

const dataSources = () => ({
  kapps: {
    fn: fetchKapps,
    params: [],
    transform: result => result.kapps,
  },
  forms: {
    fn: fetchForms,
    params: ({ values }) =>
      values && [
        {
          kappSlug: values.get('kapp'),
          datastore: !values.get('kapp'),
        },
      ],
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

const fields = () => ({ kapps, forms }) =>
  kapps && [
    {
      name: 'kapp',
      label: 'Kapp',
      type: 'text',
      options: ({ kapps }) =>
        kapps &&
        kapps.map(kapp =>
          Map({
            value: kapp.get('slug'),
            label: kapp.get('name'),
          }),
        ),
      onChange: ({ values }, { setValue }) => {
        if (values.get('kapp')) {
          setValue('name', `kapps.${values.get('kapp')}`);
        } else {
          setValue('name', '');
        }
        setValue('form', null);
      },
    },
    {
      name: 'form',
      label: 'Form',
      type: 'text',
      required: ({ values }) => values.get('kapp'),
      options: ({ forms }) =>
        forms &&
        forms.map(form =>
          Map({
            value: form.get('slug'),
            label: form.get('name'),
          }),
        ),
      onChange: ({ values }, { setValue }) => {
        if (values.get('form')) {
          if (values.get('name')) {
            setValue(
              'name',
              values.get('name').concat(`.forms.${values.get('form')}`),
            );
          } else {
            setValue('name', `datastore.forms.${values.get('form')}`);
          }
        } else {
          if (values.get('name').includes('datastore')) {
            setValue('name', '');
          } else {
            setValue(
              'name',
              values
                .get('name')
                .split('.')
                .slice(0, 2)
                .join('.'),
            );
          }
        }
      },
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      enabled: ({ values }) => !values.get('kapp') && !values.get('form'),
    },
  ];

export const ContextForm = generateForm({
  dataSources,
  fields,
  handleSubmit,
});

ContextForm.displayName = 'ContextForm';
