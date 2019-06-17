import React from 'react';
import axios from 'axios';
import { Map } from 'immutable';
import { bundle } from '../../../helpers/coreHelpers';
import { I18nContext } from './I18nContext';

export class I18nProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { translations: Map() };
    this.loading = Map();
    // this effectively enables translations for the CE client-side code
    bundle.config.translations = bundle.config.translations || {};
  }

  componentDidMount() {
    this.loadTranslations(this.props.locale, 'shared');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.locale !== this.props.locale) {
      this.loadTranslations(this.props.locale, 'shared');
    }
    if (
      !this.state.translations.equals(prevState.translations) &&
      this.state.translations.get(this.props.locale) &&
      bundle.config
    ) {
      bundle.config.translations = {
        ...bundle.config.translations,
        ...this.state.translations.get(this.props.locale).toJS(),
      };
    }
  }

  loadTranslations = (locale, context) => {
    if (!this.loading.hasIn([locale, context])) {
      this.loading = this.loading.setIn([locale, context], true);
      // check to see if the translation context was already loaded by the CE
      // client-side code (like if K.load is used in a form event)
      if (bundle.config.translations[context]) {
        this.setState(state => ({
          translations: state.translations.setIn(
            [locale, context],
            Map(bundle.config.translations[context]),
          ),
        }));
      } else {
        const url = `${bundle.apiLocation()}/translations/entries?cache&context=${context}&locale=${locale ||
          ''}`;
        axios
          .get(url)
          .then(response => {
            this.setState(state => ({
              translations: state.translations.setIn(
                [locale, context],
                Map(
                  response.data.entries.map(entry => [entry.key, entry.value]),
                ),
              ),
            }));
          })
          .catch(error => {
            this.setState(state => ({
              translations: state.translations.setIn([locale, context], Map()),
            }));
          });
      }
    }
  };

  render() {
    if (this.state.translations) {
      return (
        <I18nContext.Provider
          value={{
            context: this.props.context || 'shared',
            locale: this.props.locale || 'en',
            translations: this.state.translations,
            loadTranslations: this.loadTranslations,
          }}
        >
          {this.props.children}
        </I18nContext.Provider>
      );
    } else {
      return null;
    }
  }
}
