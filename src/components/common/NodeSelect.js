import React from 'react';
import { Typeahead } from './Typeahead';

const searchNodes = ({ nodes, tasks }) => (field, value) =>
  Promise.resolve({
    suggestions: nodes
      .toList()
      .map(node => [node, tasks.get(node.definitionId)])
      .filter(
        ([node, task]) =>
          node.name.toLowerCase().includes(value.toLowerCase()) ||
          (task && task.name.toLowerCase().includes(value.toLowerCase())),
      )
      .toArray(),
  });

const pairToValue = ([node, task] = []) => (node && node.name) || '';

const getStatusProps = props => ({
  warning: props.error
    ? 'There was an error searching nodes.'
    : props.empty
    ? 'No matching nodes.'
    : null,
});

export const NodeSelect = props => (
  <Typeahead
    components={props.components || {}}
    textMode={props.textMode}
    multiple={props.multiple}
    search={searchNodes(props)}
    minSearchLength={props.minSearchLength}
    alwaysRenderSuggestions={props.alwaysRenderSuggestions}
    getSuggestionLabel={pairToValue}
    getSuggestionValue={pairToValue}
    getStatusProps={getStatusProps}
    highlightFirstSuggestion={false}
    value={props.value}
    onChange={pair => props.onChange(pair && pair.first())}
    onFocus={props.onFocus}
    onHighlight={pair => props.onHighlight(pair && pair.first())}
    onBlur={props.onBlur}
    placeholder={props.placeholder}
  />
);
