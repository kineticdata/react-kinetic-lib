import React, { Component, createRef } from 'react';
import { dispatch } from '../../../store';
import * as constants from './constants';
import { isIE11 } from './helpers';
import { SvgText } from './SvgText';

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
    const attribute = isIE11 ? 'transform' : 'style';
    const value = isIE11
      ? `translate(${this.x} ${this.y})`
      : `transform: translate(${this.x}px,  ${this.y}px)`;
    this.el.current.setAttribute(attribute, value);
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
    const { treeKey, id, x, y, name } = this.props;
    return (
      <g ref={this.el}>
        <rect
          className="node"
          height={constants.NODE_HEIGHT}
          width={constants.NODE_WIDTH}
          rx={constants.NODE_RADIUS}
          ry={constants.NODE_RADIUS}
          onMouseDown={this.drag}
        />
        <SvgText
          className="node-name"
          x={0}
          y={0}
          height={constants.NODE_HEIGHT}
          width={constants.NODE_WIDTH}
          padding={10}
        >
          {name}
        </SvgText>
        <circle
          r={6}
          fill="red"
          cx="0"
          cy="0"
          onClick={removeNode({ treeKey, id })}
        />
        <circle
          r={9}
          fill="orange"
          cx={constants.NODE_CENTER_X}
          cy={constants.NODE_HEIGHT}
          onClick={addConnectedNode({ treeKey, x, y, parentId: id })}
        />
      </g>
    );
  }
}
