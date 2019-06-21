import React, { Fragment } from 'react';
import Autosuggest from 'react-autosuggest';

const StatusDefault = props => (
  <div>
    {props.info && (
      <div>
        {props.info}
        <button onClick={props.clearFilterField}>&times;</button>
      </div>
    )}
    {props.warning && <div>{props.warning}</div>}
    {props.filterFieldOptions &&
      props.filterFieldOptions.map(({ label, onClick }, i) => (
        <button onClick={onClick} key={i}>
          {label}
        </button>
      ))}
  </div>
);

const SelectionsContainerDefault = ({ children }) => (
  <table className="selections">
    <tbody>{children}</tbody>
  </table>
);

const SuggestionsContainerDefault = ({ open, children, containerProps }) => (
  <div {...containerProps} className={`suggestions ${open ? 'open' : ''}`}>
    {children}
  </div>
);

const TypeaheadInputDefault = ({ inputProps }) => <input {...inputProps} />;

export default class Typeahead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: true,
      newValue:
        this.props.textMode && this.props.value
          ? this.props.getSuggestionValue(this.props.value)
          : '',
      error: null,
      empty: false,
      nextPageToken: null,
      searchField: null,
      searchValue: '',
      suggestions: [],
      touched: false,
    };
  }

  edit = event => {
    this.setState({ editing: true });
  };

  remove = index => event => {
    this.props.onChange(this.props.value.delete(index));
  };

  onChange = (event, { newValue }) => {
    this.setState({ newValue, touched: true });
  };

  // when clicking enter to select then blur this clears the selected value or
  // sets to custom, I think because suggestions in empty when the menu is closed.
  onBlur = () => {
    const { custom, getSuggestionValue, multiple, textMode } = this.props;
    const { newValue, suggestions, touched } = this.state;
    const match = suggestions.find(
      suggestion => getSuggestionValue(suggestion) === newValue,
    );
    const customValue = custom && custom(newValue);
    this.setState({
      newValue:
        !touched || (textMode && (match || customValue)) ? newValue : '',
      editing: multiple || textMode,
      touched: false,
    });
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur();
    }
    if (textMode && touched) {
      this.props.onChange(match || customValue || null);
    }
  };

  onSelect = (event, { method, suggestion }) => {
    if (method === 'enter') {
      event.preventDefault();
    }
    const { getSuggestionValue, multiple, textMode, value } = this.props;
    this.setState({
      editing: multiple || textMode,
      newValue: multiple || !textMode ? '' : getSuggestionValue(suggestion),
      touched: false,
    });
    this.props.onChange(multiple ? value.push(suggestion) : suggestion);
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
      Status = StatusDefault,
      SuggestionsContainer = SuggestionsContainerDefault,
    } = this.props.components;
    const { className, ...props } = containerProps;
    return (
      <SuggestionsContainer
        containerProps={props}
        open={className === 'OPEN' || this.state.error || this.state.empty}
      >
        <Status
          {...this.props.getStatusProps({
            searchField: this.state.searchField,
            setSearchField: this.setSearchField,
            error: this.state.error,
            value: this.state.searchValue,
            empty: this.state.empty,
            more: !!this.state.nextPageToken,
            custom: !!this.props.custom,
          })}
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
    const { Input = TypeaheadInputDefault } = this.props.components;
    return <Input inputProps={inputProps} />;
  };

  setSearchField = searchField => () => {
    this.setState({ searchField });
  };

  handleSearch = searchValue => ({ suggestions, error, nextPageToken }) => {
    const custom = this.props.custom ? this.props.custom(searchValue) : null;
    const existing = (this.props.multiple ? this.props.value : []).map(
      this.props.getSuggestionValue,
    );
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
      value,
    } = this.props;
    const { editing, newValue, suggestions } = this.state;
    return (
      <div className="kinetic-typeahead">
        <SelectionsContainer>
          {multiple &&
            value.map((selection, i) => (
              <Fragment key={i}>
                {Selection ? (
                  <Selection selection={selection} remove={this.remove(i)} />
                ) : (
                  getSuggestionValue(selection)
                )}
              </Fragment>
            ))}
          {!multiple && Selection && !editing && value && (
            <Selection selection={value} edit={this.edit} />
          )}
        </SelectionsContainer>
        {(!value || editing) && (
          <Autosuggest
            ref={el => (this.autosuggest = el)}
            inputProps={{
              value: newValue,
              onBlur: this.onBlur,
              onFocus: this.props.onFocus,
              onChange: this.onChange,
              placeholder,
            }}
            theme={{
              suggestionsContainerOpen: 'OPEN',
              container: 'typeahead-container',
            }}
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
