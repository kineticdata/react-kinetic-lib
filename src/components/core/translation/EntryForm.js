import { generateForm } from '../../form/Form';
import { fetchEnabledLocales, upsertTranslations } from '../../../apis';
import { Map } from 'immutable';

const dataSources = () => ({
  locales: {
    fn: fetchEnabledLocales,
    params: [
      {
        include: 'authorization,details',
      },
    ],
    transform: result => result.locales,
  },
});

// const handleSubmit = ({ entryName }) => values =>
//   new Promise((resolve, reject) => {
//     const entry = values.toJS();
//     (entryName
//       ? updateEntry({ entryName, entry })
//       : createEntry({ entry })
//     ).then(({ entry, error }) => {
//       if (entry) {
//         resolve(entry);
//       } else {
//         reject(error.message || 'There was an error saving the entry');
//       }
//     });
//   });

const fields = ({ entry }) => ({ locales }) => {
  locales && console.log('loc:', locales.toJS());
  return (
    locales && [
      {
        name: 'locale',
        label: 'Locale',
        type: 'text',
        required: true,
        enabled: !entry,
        options: ({ locales }) =>
          locales &&
          locales.map(loc => {
            console.log('lC:', loc.get('code'));
            return Map({
              value: loc.get('code'),
              label: loc.get('code'),
            });
          }),
      },
      {
        name: 'key',
        label: 'Key',
        type: 'text',
        required: true,
      },
      {
        name: 'entry',
        label: 'Translation',
        type: 'text',
        required: true,
      },
    ]
  );
};

export const EntryForm = generateForm({
  formOptions: ['entry'],
  dataSources,
  fields,
});

EntryForm.displayName = 'EntryForm';
