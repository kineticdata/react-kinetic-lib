import React, { Component, createRef } from 'react';
import { throttle } from 'lodash-es';
import { getScale } from './helpers';
import * as constants from './constants';
import { dispatch } from '../../../store';

const addNode = ({ treeKey, x, y }) => () =>
  dispatch('TREE_ADD_NODE', { treeKey, x, y, name: 'Foo' });

const addConnectedNode = ({ treeKey, x, y, parentId }) => () =>
  dispatch('TREE_ADD_NODE_WITH_CONNECTOR', {
    treeKey,
    x,
    y,
    parentId,
    name: 'Foo',
  });

const updateNode = ({ treeKey, id, x, y }) =>
  dispatch('TREE_UPDATE_NODE', { treeKey, id, x, y });

const removeNode = ({ treeKey, id }) => () =>
  dispatch('TREE_REMOVE_NODE', { treeKey, id });

export class Node extends Component {
  constructor(props) {
    super(props);
    this.el = createRef();
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
    updateNode({
      treeKey: this.props.treeKey,
      id: this.props.id,
      x: this.x,
      y: this.y,
    });
  };

  move = throttle(event => {
    event.stopPropagation();
    event.preventDefault();
    const deltaX = event.clientX - this.lastX;
    const deltaY = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.x += deltaX / this.scale;
    this.y += deltaY / this.scale;
    Object.values(
      this.props.connectorRefsMap.byHead[this.props.id] || {},
    ).forEach(connector => connector.setFrom({ x: this.x, y: this.y }));
    Object.values(
      this.props.connectorRefsMap.byTail[this.props.id] || {},
    ).forEach(connector => connector.setTo({ x: this.x, y: this.y }));
    this.draw();
  }, 32);

  draw = () => {
    this.el.current.setAttribute('x', this.x);
    this.el.current.setAttribute('y', this.y);
  };

  // Helper function that syncs the instance's `x` and `y` values with the ones
  // passed via the props and calls draw if the internal state has changed as a
  // result.
  sync = () => {
    const dirty = this.props.x !== this.x || this.props.y !== this.y;
    this.x = this.props.x;
    this.y = this.props.y;
    if (dirty) {
      this.draw();
    }
  };

  componentDidMount() {
    this.sync();
  }

  componentDidUpdate() {
    this.sync();
  }

  render() {
    const { treeKey, id, x, y } = this.props;
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
          x={constants.NODE_RECT_OFFSET_X}
          y={constants.NODE_RECT_OFFSET_Y}
          onMouseDown={this.drag}
        />
        <circle
          r={6}
          fill="red"
          cx={
            constants.NODE_RECT_OFFSET_X + constants.NODE_STROKE_WIDTH / 2 + 6
          }
          cy={
            constants.NODE_RECT_OFFSET_Y + constants.NODE_STROKE_WIDTH / 2 + 6
          }
          onClick={removeNode({ treeKey, id })}
        />
        <circle
          r={9}
          fill="orange"
          cx={constants.NODE_CENTER_X}
          cy={constants.NODE_RECT_OFFSET_Y + constants.NODE_HEIGHT}
          onClick={addConnectedNode({ treeKey, x, y, parentId: id })}
        />
      </svg>
    );
  }
}
