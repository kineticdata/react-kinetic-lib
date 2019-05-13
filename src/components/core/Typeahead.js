import React, { Fragment } from 'react';
import Autosuggest from 'react-autosuggest';

const SelectionsContainerDefault = ({ children }) => (
  <ul className="selections">{children}</ul>
);

const SuggestionsContainerDefault = ({ open, children, containerProps }) => (
  <div {...containerProps} className={`suggestions ${open ? 'open' : ''}`}>
    {children}
  </div>
);

const TypeaheadInputDefault = ({ inputProps }) => (
  <input {...inputProps} className="form-control" />
);

export default class Typeahead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: true,
      newValue: '',
      error: null,
      empty: false,
      nextPageToken: null,
      searchField: null,
      searchValue: '',
      suggestions: [],
      touched: false,
      value: props.multiple ? [] : '',
    };
  }

  edit = event => {
    this.setState({ editing: true });
  };

  remove = index => event => {
    this.setState(({ value }) => ({
      value: [...value.slice(0, index), ...value.slice(index + 1)],
    }));
  };

  onChange = (event, { newValue }) => {
    this.setState({ newValue, touched: true });
  };

  // when clicking enter to select then blur this clears the selected value or
  // sets to custom, I think because suggestions in empty when the menu is closed.
  onBlur = () => {
    const { custom, getSuggestionValue, multiple, textMode } = this.props;
    this.setState(({ newValue, suggestions, touched, value }) => {
      const match = suggestions.find(
        suggestion => getSuggestionValue(suggestion) === newValue,
      );
      const customValue = custom && custom(newValue);
      return {
        newValue:
          !touched || (textMode && (match || customValue)) ? newValue : '',
        value: textMode && touched ? match || customValue || '' : value,
        editing: multiple || textMode,
        touched: false,
      };
    });
  };

  onSelect = (event, { method, suggestion }) => {
    if (method === 'enter') {
      event.preventDefault();
    }
    const { multiple, textMode } = this.props;
    this.setState(({ newValue, value }) => ({
      editing: multiple || textMode,
      newValue: multiple || !textMode ? '' : newValue,
      value: multiple ? [...value, suggestion] : suggestion,
      touched: false,
    }));
  };

  onSearch = ({ value }) => {
    this.setState({ searchValue: value });
  };

  onClearSuggestions = () => {
    this.setState({
      suggestions: [],
      error: null,
      empty: false,
      nextPageToken: null,
      searchField: null,
      searchValue: '',
    });
  };

  renderSuggestionContainer = ({ containerProps, children, query }) => {
    const {
      SearchStatus,
      SearchActions,
      SuggestionsContainer = SuggestionsContainerDefault,
    } = this.props.components;
    const { className, ...props } = containerProps;
    return (
      <SuggestionsContainer
        containerProps={props}
        open={className === 'OPEN' || this.state.error || this.state.empty}
      >
        <SearchStatus
          searchField={this.state.searchField}
          setSearchField={this.setSearchField}
          error={this.state.error}
          value={this.state.searchValue}
          empty={this.state.empty}
          more={!!this.state.nextPageToken}
          custom={!!this.props.custom}
        />
        <SearchActions
          setSearchField={this.setSearchField}
          error={this.state.error}
          value={this.state.searchValue}
        />
        {children}
      </SuggestionsContainer>
    );
  };

  renderSuggestion = (suggestion, { isHighlighted }) => {
    const { Suggestion } = this.props.components;
    return Suggestion ? (
      <Suggestion suggestion={suggestion} active={isHighlighted} />
    ) : (
      this.props.getSuggestionValue(suggestion)
    );
  };

  renderInput = inputProps => {
    const { TypeaheadInput = TypeaheadInputDefault } = this.props.components;
    return <TypeaheadInput inputProps={inputProps} />;
  };

  setSearchField = searchField => () => {
    this.setState({ searchField });
  };

  handleSearch = searchValue => ({ suggestions, error, nextPageToken }) => {
    const custom = this.props.custom ? this.props.custom(searchValue) : null;
    const existing = (this.props.multiple
      ? this.state.value
      : [this.state.value]
    ).map(this.props.getSuggestionValue);
    const filtered = suggestions.filter(
      suggestion =>
        !existing.includes(this.props.getSuggestionValue(suggestion)),
    );
    const newSuggestions =
      custom && !this.props.textMode ? [...filtered, custom] : filtered;
    return this.setState({
      suggestions: newSuggestions,
      error,
      nextPageToken,
      empty: newSuggestions.length === 0 && !custom,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { searchField, searchValue, touched } = this.state;
    if (
      touched &&
      (searchField !== prevState.searchField ||
        searchValue !== prevState.searchValue ||
        !prevState.touched)
    ) {
      searchValue
        ? this.props
            .search(searchField, searchValue)
            .then(this.handleSearch(searchValue))
        : this.onClearSuggestions();
    }
    if (this.state.editing && !prevState.editing) {
      this.autosuggest.input.focus();
    }
  }

  shouldRenderSuggestions = value => {
    return value.length > 0;
  };

  render() {
    const {
      components: {
        Selection,
        SelectionsContainer = SelectionsContainerDefault,
      } = {},
      multiple,
      placeholder,
      getSuggestionValue,
    } = this.props;
    const { editing, newValue, suggestions, value } = this.state;
    return (
      <div className="kinetic-typeahead">
        {multiple && (
          <SelectionsContainer>
            {value.map((selection, i) => (
              <li key={i}>
                {Selection ? (
                  <Selection selection={selection} remove={this.remove(i)} />
                ) : (
                  getSuggestionValue(selection)
                )}
              </li>
            ))}
          </SelectionsContainer>
        )}
        {!multiple && Selection && !editing && value && (
          <Selection selection={value} edit={this.edit} />
        )}
        {(!value || editing) && (
          <Autosuggest
            ref={el => (this.autosuggest = el)}
            inputProps={{
              value: newValue,
              onBlur: this.onBlur,
              onChange: this.onChange,
              placeholder,
            }}
            theme={{ suggestionsContainerOpen: 'OPEN' }}
            highlightFirstSuggestion
            shouldRenderSuggestions={this.shouldRenderSuggestions}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSearch}
            onSuggestionsClearRequested={this.onClearSuggestions}
            onSuggestionSelected={this.onSelect}
            renderSuggestion={this.renderSuggestion}
            renderSuggestionsContainer={this.renderSuggestionContainer}
            renderInputComponent={this.renderInput}
            getSuggestionValue={getSuggestionValue}
          />
        )}
      </div>
    );
  }
}
