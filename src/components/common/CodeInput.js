import React, { Component } from 'react';
import {
  CompositeDecorator,
  convertFromRaw,
  Editor,
  EditorState,
  Modifier,
} from 'draft-js';
import detectIndent from 'detect-indent';
import detectNewLine from 'detect-newline';
import Prism from 'prismjs';
import classNames from 'classnames';

export class CodeInput extends Component {
  constructor(props) {
    super(props);
    this.newLine = detectNewLine(props.value) || '\n';
    this.indentation = detectIndent(props.value).indent || '  ';
    this.tokenTypes = {};
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
            strategy: (contentBlock, callback) => {
              const processor = props.template ? processTemplate : processCode;
              processor(contentBlock.getText())
                .filter(token => typeof token === 'object')
                .forEach(({ content, index, type }) => {
                  this.tokenTypes[index] = type;
                  callback(index, index + content.length);
                });
            },
            component: decoratorProps => (
              <span
                className={classNames(
                  'code',
                  this.tokenTypes[decoratorProps.start],
                  { interpolation: props.template },
                )}
              >
                {decoratorProps.children}
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

  onChange = editorState => {
    this.setState({ editorState }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(
          editorState
            .getCurrentContent()
            .getFirstBlock()
            .getText(),
        );
      }
    });
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

  handleTab = event => {
    event.preventDefault();
    this.onChange(insert(this.indentation, this.state.editorState));
    return 'handled';
  };

  handleRef = el => (this.editor = el);

  focus = () => {
    if (this.editor) {
      this.editor.focus();
    }
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

  render() {
    return (
      <Editor
        readOnly={this.props.disabled}
        editorState={this.state.editorState}
        onChange={this.onChange}
        handleReturn={this.handleReturn}
        onTab={this.handleTab}
        ref={this.handleRef}
        handleDroppedFiles={this.handleDroppedFiles}
      />
    );
  }
}

const insert = (text, editorState) =>
  EditorState.push(
    editorState,
    editorState.getSelection().isCollapsed()
      ? Modifier.insertText(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          text,
        )
      : Modifier.replaceText(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          text,
        ),
    'insert-characters',
  );

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
    },
  );
  return result.concat(
    processTemplate(string.slice(localIndex), index + localIndex),
  );
};
