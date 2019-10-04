import React, { Component, createRef } from 'react';
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
    this.props.canvasRef.current.watchDrag({
      event,
      onMove: this.move,
      onDrop: () => {
        updateNode({
          treeKey: this.props.treeKey,
          id: this.props.id,
          x: this.x,
          y: this.y,
        });
      },
    });
  };

  move = ({ dx, dy }) => {
    this.x += dx;
    this.y += dy;
    Object.values(
      this.props.connectorRefsMap.byHead[this.props.id] || {},
    ).forEach(connector => connector.setHead({ x: this.x, y: this.y }));
    Object.values(
      this.props.connectorRefsMap.byTail[this.props.id] || {},
    ).forEach(connector => connector.setTail({ x: this.x, y: this.y }));
    this.draw();
  };

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
