import { generateForm } from '../../form/Form';
import { fetchEnabledLocales, upsertTranslations } from '../../../apis';

const dataSources = () => ({
  locales: {
    fn: fetchEnabledLocales,
    params: [],
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

const fields = () => ({ locales }) =>
  locales && [
    {
      name: 'locale',
      label: 'Locale',
      type: 'text',
      required: true,
      options: ({ locales }) => locales,
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
  ];

export const EntryForm = generateForm({
  formOptions: [],
  dataSources,
  fields,
  //   handleSubmit,
});

EntryForm.displayName = 'EntryForm';
