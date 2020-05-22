import { get, List, Map } from 'immutable';
import { generateForm } from '../../form/Form';
import { fetchAvailableLocales, enableLocale } from '../../../apis';

const dataSources = ({ localeCode }) => ({
  locales: {
    fn: fetchAvailableLocales,
    params: [],
    // params: localeCode && [{ localeCode, include: 'details' }],
    transform: result => result.locales,
  },
});

const handleSubmit = () => values => {
  const localeCode = values.toJS();
  console.log('LC:', localeCode);
  return enableLocale({ localeCode: localeCode.code });
  // return localeCode
  //   ? updateLocale({ localeCode, locale })
  //   : enableLocale({ locale });
};

const fields = ({ localeCode }) => () => {
  console.log('hello!!!');
  return (
    !localeCode && [
      {
        name: 'code',
        label: 'Locale',
        type: 'text',
        options: ({ locales }) =>
          locales
            ? locales.map(locale =>
                Map({
                  value: locale.get('code'),
                  label: locale.get('name'),
                }),
              )
            : List(),
      },
    ]
  );
};

export const LocaleForm = generateForm({
  formOptions: ['localeCode'],
  dataSources,
  fields,
  handleSubmit,
});

LocaleForm.displayName = 'LocaleForm';
