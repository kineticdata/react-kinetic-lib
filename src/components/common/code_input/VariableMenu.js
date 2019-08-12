import React, { Component } from 'react';

export class VariableMenu extends Component {
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
    const el = document.getElementById(this.props.target);
    if (el !== this.state.el) {
      const { x, y, height } = el.getBoundingClientRect();
      this.setState({ position: { left: x, top: y + height }, el });
    }
  }

  render() {
    const { onSelect, options } = this.props;
    const { top, left } = this.state.position || {};
    return (
      !!top && (
        <div
          style={{ position: 'fixed', left, top }}
          className="variable-typeahead-menu"
          contentEditable={false}
        >
          <ul>
            {options.map(([label, value]) => (
              <li
                key={label}
                onClick={onSelect(label, value, this.props.template)}
                style={{ userSelect: 'none', MozUserSelect: 'none' }}
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
