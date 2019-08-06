import React, { Component, Fragment } from 'react';
import {
  CompositeDecorator,
  convertFromRaw,
  Editor,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js';
import detectIndent from 'detect-indent';
import detectNewLine from 'detect-newline';
import classNames from 'classnames';
import {
  checkFocus,
  checkTypeaheadEntity,
  closeVariableMenu,
  findTypeaheadEntity,
  getCurrentIndentation,
  insert,
  openVariableMenu,
  selectVariable,
} from './draftHelpers';
import { processCode, processTemplate } from './languageHelpers';
import { VariableMenu } from './VariableMenu';

export class CodeInput extends Component {
  constructor(props) {
    super(props);
    this.newLine = detectNewLine(props.value) || '\n';
    this.indentation = detectIndent(props.value).indent || '  ';
    this.editor = null;
    this.state = {
      editorState: EditorState.createWithContent(
        convertFromRaw({
          entityMap: {},
          blocks: [
            {
              text: props.value,
            },
          ],
        }),
        new CompositeDecorator([
          {
            strategy: (contentBlock, callback, contentState) => {
              const { start, end } = findTypeaheadEntity(
                contentBlock,
                contentState,
              );
              if (start !== null) {
                callback(start, end);
              }
            },
            component: ({ children, entityKey, contentState }) => {
              const entityData = contentState.getEntity(entityKey).getData();
              return (
                <Fragment>
                  <span
                    className="variable-typeahead"
                    id="variable-typeahead-target"
                  >
                    {children}
                  </span>
                  <VariableMenu
                    bindings={this.props.bindings}
                    selected={entityData.selected}
                    onSelect={this.handleSelect}
                    target="variable-typeahead-target"
                  />
                </Fragment>
              );
            },
          },
          {
            strategy: (contentBlock, callback, contentState) => {
              const {
                start: typeaheadStart,
                end: typeaheadEnd,
              } = findTypeaheadEntity(contentBlock, contentState);
              const text =
                typeaheadStart !== null
                  ? contentBlock.getText().slice(0, typeaheadStart) +
                    ' '.repeat(typeaheadEnd - typeaheadStart) +
                    contentBlock.getText().slice(typeaheadEnd)
                  : contentBlock.getText();
              const processor = props.template ? processTemplate : processCode;
              this.tokenStarts = {};
              this.tokenEnds = {};
              processor(text)
                .filter(token => typeof token === 'object')
                .forEach(({ content, index: start, type }) => {
                  const end = start + content.length;
                  this.tokenStarts[start] = type;
                  this.tokenEnds[end] = type;
                  if (start < typeaheadStart && end > typeaheadStart) {
                    callback(start, typeaheadStart);
                  }
                  if (start < typeaheadEnd && end > typeaheadEnd) {
                    callback(typeaheadEnd, end);
                  }
                  if (
                    !(start < typeaheadStart && end > typeaheadStart) &&
                    !(start < typeaheadEnd && end > typeaheadEnd)
                  ) {
                    callback(start, end);
                  }
                });
            },
            component: ({ children, start, end }) => (
              <span
                className={classNames(
                  'code',
                  this.tokenStarts[start] || this.tokenEnds[end],
                  {
                    interpolation: props.template,
                  },
                )}
              >
                {children}
              </span>
            ),
          },
        ]),
      ),
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.value !== prevProps.value &&
      this.props.value !==
        this.state.editorState
          .getCurrentContent()
          .getFirstBlock()
          .getText()
    ) {
      this.onChange(
        EditorState.push(
          this.state.editorState,
          convertFromRaw({
            entityMap: {},
            blocks: [
              {
                text: this.props.value,
              },
            ],
          }),
          'insert-characters',
        ),
      );
    }
  }

  onChange = (editorState, focus) => {
    this.setState(
      { editorState: checkFocus(checkTypeaheadEntity(editorState)) },
      () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(
            editorState
              .getCurrentContent()
              .getFirstBlock()
              .getText(),
          );
        }
        if (focus) {
          this.focus();
        }
      },
    );
  };

  handleReturn = event => {
    const currentIndentation = getCurrentIndentation(
      this.newLine,
      this.state.editorState,
    );
    this.onChange(
      insert(this.newLine + currentIndentation, this.state.editorState),
    );
    return 'handled';
  };

  handleDroppedFiles = (selection, [file]) => {
    if (typeof this.props.onChange === 'function') {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.props.onChange(fileReader.result);
      };
      fileReader.readAsText(file);
    }
  };

  handleKeyCommand = (command, editorState) => {
    if (command === 'open-variable-menu') {
      this.onChange(openVariableMenu(editorState));
    }
    if (command === 'close-variable-menu') {
      this.onChange(closeVariableMenu(editorState));
    }
    if (command === 'insert-tab') {
      this.onChange(insert(this.indentation, this.state.editorState));
    }
    return 'not-handled';
  };

  handleSelect = value => () => {
    this.onChange(
      selectVariable(
        this.state.editorState,
        value,
        this.props.bindings,
        this.props.template,
      ),
      true,
    );
  };

  keyBindingFn = event => {
    if (
      event.keyCode === 52 &&
      event.shiftKey &&
      !this.props.bindings.isEmpty()
    ) {
      return 'open-variable-menu';
    } else if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      return 'close-variable-menu';
    } else if (
      event.keyCode === 9 &&
      this.props.value.indexOf(this.newLine) > -1
    ) {
      event.preventDefault();
      return 'insert-tab';
    }
    return getDefaultKeyBinding(event);
  };

  handleRef = el => (this.editor = el);

  focus = () => {
    if (this.editor) {
      this.editor.focus();
    }
  };

  stopEscape = event => {
    if (event.keyCode === 27) {
      event.stopPropagation();
    }
  };

  render() {
    return (
      <div onKeyUp={this.stopEscape}>
        <Editor
          readOnly={this.props.disabled}
          editorState={this.state.editorState}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onChange={this.onChange}
          handleReturn={this.handleReturn}
          ref={this.handleRef}
          handleDroppedFiles={this.handleDroppedFiles}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.keyBindingFn}
        />
      </div>
    );
  }
}
