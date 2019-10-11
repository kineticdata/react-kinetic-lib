import React from 'react';
import Autosuggest from 'react-autosuggest';
import { fromJS, is, List } from 'immutable';

const DEBOUNCE_DURATION = 150;

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

const SelectionsContainerDefault = ({ selections, input }) => (
  <table>
    <tbody>
      {selections}
      <tr>
        <td>{input}</td>
      </tr>
    </tbody>
  </table>
);

const SuggestionsContainerDefault = ({ open, children, containerProps }) => (
  <div {...containerProps}>{children}</div>
);

const TypeaheadInputDefault = ({ inputProps }) => <input {...inputProps} />;

export class Typeahead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.createStateFromProps(props),
      minSearchLength:
        typeof props.minSearchLength === 'number'
          ? Math.max(parseInt(props.minSearchLength, 10), 0)
          : this.props.alwaysRenderSuggestions
          ? 0
          : 1,
    };
  }

  createStateFromProps = props => ({
    editing: props.textMode || props.multiple,
    newValue:
      props.textMode && props.value
        ? props.getSuggestionLabel(props.value)
        : '',
    error: null,
    empty: false,
    nextPageToken: null,
    searchField: null,
    searchValue: '',
    suggestions: [],
    touched: false,
  });

  edit = event => {
    this.setState({ editing: true });
  };

  remove = index => event => {
    this.props.onChange(this.props.value.delete(index));
  };

  onChange = (event, { newValue, method }) => {
    if (method !== 'escape') {
      this.setState({ newValue, touched: true });
    } else {
      this.setState(this.createStateFromProps(this.props));
    }
  };

  // when clicking enter to select then blur this clears the selected value or
  // sets to custom, I think because suggestions in empty when the menu is closed.
  onBlur = () => {
    const {
      custom,
      getSuggestionLabel,
      getSuggestionValue,
      multiple,
      textMode,
    } = this.props;
    const { newValue, suggestions, touched } = this.state;
    const match = suggestions.find(
      suggestion =>
        getSuggestionLabel(suggestion) === newValue ||
        getSuggestionValue(suggestion) === newValue,
    );
    const customValue = custom && fromJS(custom(newValue));
    this.setState({
      newValue:
        !touched || (textMode && (match || customValue))
          ? getSuggestionLabel(match || customValue)
          : '',
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

  onKeyDown = ({ keyCode }) => {
    if ((keyCode === 40 || keyCode === 38) && !this.state.touched) {
      this.setState({ touched: true, searchValue: this.state.newValue });
    }
  };

  onSelect = (event, { method, suggestion }) => {
    if (method === 'enter') {
      event.preventDefault();
    }
    const { getSuggestionLabel, multiple, textMode, value } = this.props;
    this.setState({
      editing: multiple || textMode,
      newValue: multiple || !textMode ? '' : getSuggestionLabel(suggestion),
      touched: false,
    });
    this.props.onChange(multiple ? value.push(suggestion) : suggestion);
  };

  onSearch = ({ value, reason }) => {
    if (reason !== 'escape-pressed') {
      if (reason === 'input-focused' && this.props.alwaysRenderSuggestions) {
        this.setState({ searchValue: value, touched: true });
      } else {
        this.setState({ searchValue: value });
      }
    } else {
      this.setState(this.createStateFromProps(this.props));
    }
    return false;
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

  SelectionDefault = ({ selection, remove, edit }) => (
    <tr>
      <td>{this.props.getSuggestionLabel(selection)}</td>
      <td>
        <button type="button" onClick={edit || remove}>
          &times;
        </button>
      </td>
    </tr>
  );

  SuggestionDefault = ({ active, suggestion }) => {
    const suggestionLabel = this.props.getSuggestionLabel(suggestion);
    return (
      <div>{active ? <strong>{suggestionLabel}</strong> : suggestionLabel}</div>
    );
  };

  renderSuggestion = (suggestion, { isHighlighted }) => {
    const { Suggestion = this.SuggestionDefault } = this.props.components;
    return <Suggestion suggestion={suggestion} active={isHighlighted} />;
  };

  renderInput = inputProps => {
    const { Input = TypeaheadInputDefault } = this.props.components;
    return <Input inputProps={inputProps} />;
  };

  setSearchField = searchField => () => {
    this.setState({ searchField });
  };

  handleSearch = searchValue => ({ suggestions, error, nextPageToken }) => {
    if (this.state.searchValue === searchValue) {
      const custom =
        this.props.custom && fromJS(this.props.custom(searchValue));
      const existing = (this.props.multiple ? this.props.value : []).map(
        this.props.getSuggestionValue,
      );
      const filtered = suggestions
        .map(suggestion => fromJS(suggestion))
        .filter(
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
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { searchField, searchValue, touched } = this.state;
    if (
      touched &&
      (searchField !== prevState.searchField ||
        searchValue !== prevState.searchValue ||
        !prevState.touched)
    ) {
      if (searchValue.length >= this.state.minSearchLength) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.props
            .search(searchField, searchValue)
            .then(this.handleSearch(searchValue));
        }, DEBOUNCE_DURATION);
      } else {
        this.onClearSuggestions();
      }
    }
    if (this.state.editing && !prevState.editing) {
      this.autosuggest.input.focus();
    }
    if (!is(this.props.value, prevProps.value)) {
      this.setState(this.createStateFromProps(this.props));
    }
  }

  shouldRenderSuggestions = value => {
    return value.length >= this.state.minSearchLength;
  };

  render() {
    const {
      multiple,
      placeholder,
      getSuggestionLabel,
      textMode,
      value,
      components: {
        Selection = this.SelectionDefault,
        SelectionsContainer = SelectionsContainerDefault,
      } = {},
    } = this.props;
    const { editing, newValue, suggestions } = this.state;
    return (
      <SelectionsContainer
        multiple={multiple}
        selections={
          multiple
            ? value.map((selection, i) => (
                <Selection
                  key={i}
                  selection={selection}
                  remove={this.remove(i)}
                />
              ))
            : !textMode && !editing && value
            ? List.of(<Selection key={0} selection={value} edit={this.edit} />)
            : List()
        }
        input={
          !value || editing ? (
            <Autosuggest
              ref={el => (this.autosuggest = el)}
              inputProps={{
                value: newValue,
                onBlur: this.onBlur,
                onFocus: this.props.onFocus,
                onChange: this.onChange,
                onKeyDown: this.onKeyDown,
                placeholder,
              }}
              theme={{
                suggestionsContainerOpen: 'OPEN',
              }}
              highlightFirstSuggestion
              alwaysRenderSuggestions={true}
              shouldRenderSuggestions={this.shouldRenderSuggestions}
              suggestions={this.state.touched ? suggestions : []}
              onSuggestionsFetchRequested={this.onSearch}
              onSuggestionsClearRequested={this.onClearSuggestions}
              onSuggestionSelected={this.onSelect}
              renderSuggestion={this.renderSuggestion}
              renderSuggestionsContainer={this.renderSuggestionContainer}
              renderInputComponent={this.renderInput}
              getSuggestionValue={getSuggestionLabel}
            />
          ) : null
        }
      />
    );
  }
}
