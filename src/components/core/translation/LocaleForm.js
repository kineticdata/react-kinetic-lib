import { generateForm } from '../../form/Form';
import { fetchLocale, enableLocale } from '../../../apis';

const dataSources = ({ localeCode }) => ({
  // locale: {
  //   fn: fetchLocale,
  //   params: localeCode && [{ localeCode, include: 'details' }],
  //   transform: result => result.locale,
  // },
});

const handleSubmit = ({ localeCode }) => values =>
  new Promise((resolve, reject) => {
    const locale = values.toJS();
    (localeCode
      ? enableLocale({ localeCode, locale })
      : null
     /*: createLocale({ locale })*/)
      // : createLocale({ locale })
      .then(({ locale, error }) => {
        if (locale) {
          resolve(locale);
        } else {
          reject(error.message || 'There was an error saving the locale');
        }
      });
  });

const fields = () => () => [
  {
    name: 'code',
    label: 'Code',
    type: 'text',
    required: true,
  },
];

export const LocaleForm = generateForm({
  dataSources,
  fields,
  handleSubmit,
});

LocaleForm.displayName = 'LocaleForm';
