import { generateForm } from '../../form/Form';
import {
  fetchContextKeys,
  createContext,
  updateContext,
} from '../../../apis';

const dataSources = ({ contextName }) => ({
  locale: {
    fn: fetchContextKeys,
    params: contextName && [{ contextName, include: 'details' }],
    transform: result => result.context,
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
    name: 'name',
    label: 'Context Name',
    type: 'text',
    required: true,
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
