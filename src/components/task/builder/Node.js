import React, { Component, createRef } from 'react';
import { getScale } from './helpers';
import * as constants from './constants';

export class Node extends Component {
  constructor(props) {
    super(props);
    this.el = createRef();
    this.x = props.x;
    this.y = props.y;
  }

  drag = event => {
    event.stopPropagation();
    event.preventDefault();
    const transformerEl = this.el.current.parentNode;
    const canvasEl = transformerEl.parentNode;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.scale = getScale(transformerEl);
    canvasEl.addEventListener('mouseup', this.drop);
    canvasEl.addEventListener('mouseleave', this.drop);
    canvasEl.addEventListener('mousemove', this.move);
  };

  drop = event => {
    event.stopPropagation();
    event.preventDefault();
    const canvasEl = this.el.current.parentNode.parentNode;
    canvasEl.removeEventListener('mouseup', this.drop);
    canvasEl.removeEventListener('mouseleave', this.drop);
    canvasEl.removeEventListener('mousemove', this.move);
  };

  move = event => {
    event.stopPropagation();
    event.preventDefault();
    const deltaX = event.clientX - this.lastX;
    const deltaY = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.x += deltaX / this.scale;
    this.y += deltaY / this.scale;
    this.props.connectors.forEach(connector =>
      connector.setTo({ x: this.x, y: this.y }),
    );
    this.setPosition();
  };

  setPosition = () => {
    this.el.current.setAttribute('x', this.x);
    this.el.current.setAttribute('y', this.y);
  };

  componentDidMount() {
    this.setPosition();
  }

  render() {
    return (
      <svg
        ref={this.el}
        height={constants.NODE_SVG_HEIGHT}
        width={constants.NODE_SVG_WIDTH}
      >
        <rect
          className="node"
          height={constants.NODE_HEIGHT}
          width={constants.NODE_WIDTH}
          strokeWidth={constants.NODE_STROKE_WIDTH}
          rx={constants.NODE_RADIUS}
          ry={constants.NODE_RADIUS}
          x={constants.NODE_STROKE_WIDTH}
          y={constants.NODE_STROKE_WIDTH}
          onMouseDown={this.drag}
        />
      </svg>
    );
  }
}
