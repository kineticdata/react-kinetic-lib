import React, { Component, createRef } from 'react';
import { isArray, isFunction } from 'lodash-es';
import classNames from 'classnames';
import { dispatch } from '../../../store';
import * as constants from './constants';
import { addNewTask, isIE11 } from './helpers';
import { Point } from './models';
import { SvgText } from './SvgText';
import routineIcon from '../../../assets/task/icons/routine.svg';
import deferIcon from '../../../assets/task/icons/defer.svg';
import plusIcon from '../../../assets/task/icons/plus_small.svg';

export class Node extends Component {
  constructor(props) {
    super(props);
    this.el = createRef();
  }

  setTreeBuilder(treeBuilder) {
    this.treeBuilder = treeBuilder;
  }

  /*****************************************************************************
   * Click handlers                                                            *
   ****************************************************************************/

  addNewNode = () => {
    if (isFunction(this.props.onNew)) {
      this.props.onNew(
        addNewTask(this.props.treeKey, this.props.tree, this.props.node),
      );
    }
  };

  onSelect = shiftKey => () => {
    if (isFunction(this.props.onSelect)) {
      this.props.onSelect(this.props.node, shiftKey);
    }
  };

  /*****************************************************************************
   * Drag-and-drop support                                                     *
   * Leverages the `watchDrag` helper exposed by the `TreeBuilder` instance.   *
   * On move we need to update any related connectors manually (for maximum    *
   * performance).                                                             *
   * On drop we dispatch an action to update the node in redux to persist the  *
   * change.                                                                   *
   * We also watch for drag on the plus button, which should leverage the      *
   * `TreeBuilder` instance to start creating a new connector                  *
   ****************************************************************************/

  drag = event => {
    this.treeBuilder.watchDrag({
      event,
      onMove: this.move,
      onDrop: this.drop,
      onClick: this.onSelect(event.shiftKey),
    });
  };

  dragPlus = event => {
    this.treeBuilder.watchDrag({
      event,
      relative: false,
      onMove: this.treeBuilder.dragNewConnector(this.props.node),
      onDrop: this.treeBuilder.dropNewConnector,
      onClick: this.addNewNode,
    });
  };

  drop = () => {
    dispatch('TREE_UPDATE_NODE_POSITION', {
      treeKey: this.props.treeKey,
      id: this.props.node.id,
      position: this.position,
    });
  };

  move = ({ dx, dy }) => {
    this.position = Point({ x: this.position.x + dx, y: this.position.y + dy });
    this.treeBuilder
      .getConnectorsByHead(this.props.node.id)
      .forEach(connector => connector.setHead(this.position, false));

    this.treeBuilder
      .getConnectorsByTail(this.props.node.id)
      .forEach(connector => connector.setTail(this.position, false));
    this.draw();
  };

  /*****************************************************************************
   * React lifecycle                                                           *
   * Check the `node` prop for change, which should be an immutable record.    *
   * If that prop changes we need to sync the instance's `position` value and  *
   * call `draw`.                                                              *
   ****************************************************************************/

  shouldComponentUpdate(nextProps) {
    return (
      !this.props.node.equals(nextProps.node) ||
      this.props.primary !== nextProps.primary ||
      this.props.selected !== nextProps.selected ||
      this.props.highlighted !== nextProps.highlighted
    );
  }

  componentDidMount() {
    this.position = this.props.node.position;
    this.draw();
  }

  componentDidUpdate() {
    this.position = this.props.node.position;
    this.draw();
  }

  /*****************************************************************************
   * Rendering                                                                 *
   * To make the drag-and-drop perform as fast as possible we manually         *
   * manipulate some DOM elements in the `draw` method below. Anything that    *
   * changes the instance's `position` property should also call `draw`        *
   ****************************************************************************/

  draw() {
    const attribute = isIE11 ? 'transform' : 'style';
    const value = isIE11
      ? `translate(${this.position.x} ${this.position.y})`
      : `transform: translate(${this.position.x}px,  ${this.position.y}px)`;
    this.el.current.setAttribute(attribute, value);
  }

  render() {
    const { node, highlighted, primary, selected, tasks } = this.props;
    const { defers, definitionId, name } = node;
    const invalid = !name;
    const isRoutine =
      definitionId &&
      tasks.get(definitionId) &&
      isArray(tasks.get(definitionId).inputs);
    return (
      <g ref={this.el}>
        <rect
          className={classNames('node', {
            highlighted,
            invalid,
            selected,
            primary,
          })}
          height={constants.NODE_HEIGHT}
          width={constants.NODE_WIDTH}
          rx={constants.NODE_RADIUS}
          ry={constants.NODE_RADIUS}
          onMouseDown={this.drag}
        />
        <SvgText
          className="node-name med-detail"
          x={0}
          y={0}
          height={constants.NODE_HEIGHT}
          width={constants.NODE_WIDTH}
          padding={constants.NODE_NAME_PADDING}
        >
          {name}
        </SvgText>
        {defers && (
          <image
            className="high-detail"
            xlinkHref={deferIcon}
            height={constants.ICON_SIZE}
            width={constants.ICON_SIZE}
            x={constants.NODE_BADGE_OFFSET}
            y={-constants.ICON_CENTER}
          />
        )}
        {isRoutine && (
          <image
            className="high-detail"
            xlinkHref={routineIcon}
            height={constants.ICON_SIZE}
            width={constants.ICON_SIZE}
            x={constants.NODE_BADGE_OFFSET}
            y={constants.NODE_HEIGHT - constants.ICON_CENTER}
          />
        )}
        <image
          className="high-detail"
          xlinkHref={plusIcon}
          height={constants.ICON_SIZE}
          width={constants.ICON_SIZE}
          x={constants.NODE_CENTER_X - constants.ICON_CENTER}
          y={constants.NODE_HEIGHT - constants.ICON_CENTER}
          onMouseDown={this.dragPlus}
        />
      </g>
    );
  }
}
