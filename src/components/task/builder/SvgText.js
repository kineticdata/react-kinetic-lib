import React, { Component } from 'react';
import { List } from 'immutable';
import { shallowEqual } from 'recompose';

const ELLIPSIS = ' \u2026';
const STYLE = {
  dominantBaseline: 'central',
  pointerEvents: 'none',
  textAnchor: 'middle',
};

export class SvgText extends Component {
  constructor(props) {
    super(props);
    this.state = { lineOffset: 0, lines: [] };
  }

  // Need to call getLines on componentDidMount because we cannot measure the
  // given text with getBBoxForWord (below) until this component is fully
  // rendered.
  componentDidMount() {
    this.getLines(this.props.children);
  }

  // When we get new props we are going to re-compute the lines for the text
  // because we may have new text or the position may have changed. Note that
  // since this operation performs several DOM manipulations we use the
  // shouldComponentUpdate method to prevent unnecessary checks.
  componentWillReceiveProps(nextProps) {
    if (this.shouldComponentUpdate(nextProps, this.state)) {
      this.getLines(nextProps.children);
    }
  }

  shouldComponentUpdate(
    { x, y, width, height, children },
    { linesOffset, lines },
  ) {
    return (
      this.state.linesOffset !== linesOffset ||
      !shallowEqual(this.state.lines, lines) ||
      this.props.x !== x ||
      this.props.y !== y ||
      this.props.width !== width ||
      this.props.height !== height ||
      !shallowEqual(this.props.children, children)
    );
  }

  // Helper method that uses the 'sampleEl' reference element to measure the
  // size of a given word. We insert the word into the DOM and measure the
  // sample element and then remove it from the DOM.
  getBBoxForWord(word) {
    const sampleEl = this.sampleEl;
    sampleEl.appendChild(document.createTextNode(word));
    const result = sampleEl.parentNode.getBBox();
    sampleEl.removeChild(sampleEl.childNodes[0]);
    return result;
  }

  getLines(text = '') {
    const width = this.props.width - this.props.padding * 2;
    const lineHeight = this.getBBoxForWord('K').height;
    const [first, ...rest] = text.split(/\s+/);
    const allLines = rest.reduce((memo, word) => {
      const next = `${memo.last()} ${word}`;
      return this.getBBoxForWord(next).width < width
        ? memo.set(memo.size - 1, next)
        : memo.push(word);
    }, List([first]));
    const maxLines = Math.floor(this.props.height / lineHeight);
    const lines =
      allLines.size <= maxLines
        ? allLines
        : allLines
            .take(maxLines)
            .update(maxLines - 1, line => `${line}${ELLIPSIS}`);
    const divisor = Math.min(maxLines, lines.size) + 1;
    const lineOffset = this.props.height / divisor;
    this.setState({ lines, lineOffset });
  }

  render() {
    return (
      <g className={this.props.className}>
        <text style={{ opacity: 0 }}>
          <tspan
            ref={el => {
              this.sampleEl = el;
            }}
          />
        </text>
        <text>
          {this.state.lines.map((line, i) => (
            <tspan
              style={STYLE}
              key={line}
              x={this.props.x + this.props.width / 2}
              y={this.props.y + this.state.lineOffset * (i + 1)}
            >
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  }
}
