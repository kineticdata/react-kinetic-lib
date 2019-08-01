import React, { Component, Fragment } from 'react';
import {
  CompositeDecorator,
  convertFromRaw,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
} from 'draft-js';
import detectIndent from 'detect-indent';
import detectNewLine from 'detect-newline';
import { getIn } from 'immutable';
import Prism from 'prismjs';
import classNames from 'classnames';

const TYPEAHEAD_ENTITY_TYPE = 'TYPEAHEAD';

const bindings = {
  Form: {
    Name: "form('name')",
    Slug: "form('slug')",
    'Attribute - Manager': "form('attributes:Manager')",
    'Attribute - Location': "form('attributes:Location')",
  },
  Identity: {
    Username: "identity('username')",
  },
  Values: {
    'First Name': "values('First Name')",
    'Last Name': "values('Last Name')",
    Priority: "values('First Name')",
  },
  'Something Really Long': "really('LONG VARIABLE')",
};

class VariableMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { position: null };
  }

  componentDidMount() {
    this.setPosition();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.setPosition();
  }

  setPosition() {
    const el = document.getElementById('variable-typeahead-target');
    if (el !== this.state.el) {
      const { x, y, height } = el.getBoundingClientRect();
      this.setState({ position: { left: x, top: y + height }, el });
    }
  }

  render() {
    const { bindings, selected, onSelect } = this.props;
    const { top, left } = this.state.position || {};
    return (
      !!top && (
        <div
          style={{ position: 'fixed', left, top }}
          className="variable-typeahead-menu"
          contentEditable={false}
        >
          <ul>
            {Object.entries(getIn(bindings, selected)).map(([label, value]) => (
              <li
                key={label}
                onClick={onSelect(label)}
                style={{ userSelect: 'none' }}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )
    );
  }
}

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
                    bindings={bindings}
                    selected={entityData.selected}
                    onSelect={this.handleSelect}
                    el={this.portalEl}
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
        bindings,
        this.props.template,
      ),
      true,
    );
  };

  keyBindingFn = event => {
    if (event.keyCode === 52 && event.shiftKey) {
      return 'open-variable-menu';
    } else if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      return 'close-variable-menu';
    } else if (event.keyCode === 9) {
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

  render() {
    return (
      <div onKeyUp={blockEscape} style={{ position: 'relative' }}>
        <Editor
          readOnly={this.props.disabled}
          editorState={this.state.editorState}
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

const selectVariable = (editorState, value, bindings, isTemplate) => {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getFirstBlock();
  const { start, end, entity } = findTypeaheadEntity(
    contentBlock,
    contentState,
  );
  const selected = [...entity.getData().selected, value];
  const variable = getIn(bindings, selected);
  if (typeof variable === 'string') {
    return EditorState.push(
      editorState,
      Modifier.replaceText(
        contentState,
        editorState
          .getSelection()
          .set('anchorOffset', start)
          .set('focusOffset', end),
        isTemplate ? '${' + variable + '}' : variable,
      ),
      'insert-characters',
    );
  } else {
    const editorState1 = EditorState.push(
      editorState,
      Modifier.insertText(contentState, editorState.getSelection(), value),
      'insert-characters',
    );
    const selection = editorState1.getSelection();
    const contentState1 = editorState1
      .getCurrentContent()
      .createEntity(TYPEAHEAD_ENTITY_TYPE, 'IMMUTABLE', { selected });
    return EditorState.forceSelection(
      EditorState.push(
        editorState1,
        Modifier.applyEntity(
          contentState1,
          selection.set('anchorOffset', start),
          contentState1.getLastCreatedEntityKey(),
        ),
        'apply-entity',
      ),
      selection,
    );
  }
};

const blockEscape = event => {
  if (event.keyCode === 27) {
    event.stopPropagation();
  }
};

const checkFocus = editorState =>
  editorState.getSelection().getHasFocus()
    ? editorState
    : closeVariableMenu(editorState);

// Helper responsible for clearing the typeahead entity based on the selection
// state. We do this by checking to see whether the current selection is within
// or immediately following the entity range. This works when the entity is a
// single "$" character and should work (or be close) when we want to filter
// menu items because the filter text should also be within that entity range.
const checkTypeaheadEntity = editorState => {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getFirstBlock();
  const selection = editorState.getSelection();
  const { start, end } = findTypeaheadEntity(contentBlock, contentState);
  if (
    start === null ||
    (selection.getStartOffset() > start && selection.getEndOffset() <= end)
  ) {
    return editorState;
  } else {
    return closeVariableMenu(editorState);
  }
};

const openVariableMenu = editorState => {
  const editorState1 = insert('$', closeVariableMenu(editorState));
  const selection = editorState1.getSelection();
  const dollarSelection = selection.set(
    'anchorOffset',
    selection.getAnchorOffset() - 1,
  );
  const contentState = editorState1.getCurrentContent();
  const contentState1 = contentState.createEntity(
    TYPEAHEAD_ENTITY_TYPE,
    'IMMUTABLE',
    { selected: [] },
  );
  const contentState2 = Modifier.applyEntity(
    contentState,
    dollarSelection,
    contentState1.getLastCreatedEntityKey(),
  );
  const editorState2 = EditorState.push(
    editorState1,
    contentState2,
    'apply-entity',
  );
  return EditorState.forceSelection(editorState2, selection);
};

const closeVariableMenu = editorState => {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getFirstBlock();
  const selection = editorState.getSelection();
  const { start, end } = findTypeaheadEntity(contentBlock, contentState);
  const entitySelection = selection
    .set('anchorOffset', start)
    .set('focusOffset', end);
  if (start !== null) {
    // If you don't force the selection after clearing the entity, the entity
    // range will be selected.
    return EditorState.forceSelection(
      EditorState.push(
        editorState,
        Modifier.applyEntity(contentState, entitySelection, null),
        'apply-entity',
      ),
      selection,
    );
  } else {
    return editorState;
  }
};

const findTypeaheadEntity = (contentBlock, contentState) => {
  let i = 0;
  const chars = contentBlock.getCharacterList();
  while (i < chars.size && !isTypeaheadEntity(chars.get(i), contentState)) {
    i++;
  }
  if (i === chars.size) {
    return { start: null, end: null };
  } else {
    const start = i;
    const entity = contentState.getEntity(chars.get(i).getEntity());
    while (i < chars.size && isTypeaheadEntity(chars.get(i), contentState)) {
      i++;
    }
    return { start, end: i, entity };
  }
};

const isTypeaheadEntity = (character, contentState) =>
  character.getEntity() &&
  contentState.getEntity(character.getEntity()).getType() ===
    TYPEAHEAD_ENTITY_TYPE;

const insert = (text, editorState) => {
  const selection = editorState.getSelection();
  return EditorState.push(
    editorState,
    selection.isCollapsed()
      ? Modifier.insertText(editorState.getCurrentContent(), selection, text)
      : Modifier.replaceText(editorState.getCurrentContent(), selection, text),
    'insert-characters',
  );
};

const getCurrentIndentation = (newLine, editorState) => {
  const text = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getText();
  const textBeforeCursor = text.slice(
    0,
    editorState.getSelection().getStartOffset(),
  );
  const lineBeforeCursor = textBeforeCursor.slice(
    textBeforeCursor.lastIndexOf(newLine) + 1,
  );
  return lineBeforeCursor.replace(/\S.*$/, '');
};

const processCode = string =>
  Prism.tokenize(string, Prism.languages.javascript).reduce(
    ([tokens, index], token) => [
      [
        ...tokens,
        typeof token === 'string'
          ? { content: token, index }
          : { type: token.type, content: token.content, index },
      ],
      index + token.length,
    ],
    [[], 0],
  )[0];

const processTemplate = (string, index = 0) => {
  const openingIndex = string.indexOf('${');
  return openingIndex > -1
    ? [
        string.slice(0, openingIndex),
        ...processInterpolation(
          string.slice(openingIndex),
          index + openingIndex,
        ),
      ]
    : [string];
};

const processInterpolation = (string, index) => {
  const result = [
    {
      type: 'opening-interpolation',
      content: '${',
      index,
    },
  ];
  let localIndex = 2;
  let curlyDepth = 0;
  Prism.tokenize(string.slice(localIndex), Prism.languages.javascript).some(
    token => {
      if (typeof token === 'string') {
        result.push({
          content: token,
          index: index + localIndex,
        });
      } else {
        if (token.type === 'punctuation' && token.content === '}') {
          if (curlyDepth > 0) {
            curlyDepth--;
            result.push({
              type: token.type,
              content: token.content,
              index: index + localIndex,
            });
          } else {
            result.push({
              type: 'closing-interpolation',
              content: '}',
              index: index + localIndex,
            });
            // Because we used `some` instead of `forEach` returning true here
            // is like breaking the loop. Also make sure we increment the local
            // index here because returning will prevent us from reaching the
            // increment at the end.
            localIndex += token.length;
            return true;
          }
        } else {
          if (token.type === 'punctuation' && token.content === '{') {
            curlyDepth++;
          }
          result.push({
            type: token.type,
            content: token.content,
            index: index + localIndex,
          });
        }
      }
      localIndex += token.length;
      return false;
    },
  );
  return result.concat(
    processTemplate(string.slice(localIndex), index + localIndex),
  );
};
