import React, { Component, createRef } from 'react';
import * as constants from './constants';
import { getArrowPoints, getRectIntersections, isPointInRect } from './helpers';
import { dispatch } from '../../../store';

export class Connector extends Component {
  constructor(props) {
    super(props);
    this.connector = createRef();
    this.connectorCircle = createRef();
    this.connectorArrow = createRef();
  }

  dragTail = event => {
    this.props.canvasRef.current.watchDrag({
      relative: false,
      event,
      onMove: this.setTailPoint,
      onDrop: () => {
        const nodeId = this.props.nodes.findIndex(
          isPointInRect(this.tailPoint),
        );
        if (nodeId === -1 || nodeId === this.tailId || nodeId === this.headId) {
          this.setTailPoint(null);
        } else {
          dispatch('TREE_UPDATE_CONNECTOR_TAIL', {
            treeKey: this.props.treeKey,
            id: this.props.id,
            nodeId,
          });
        }
      },
    });
  };

  dragHead = event => {
    this.props.canvasRef.current.watchDrag({
      relative: false,
      event,
      onMove: this.setHeadPoint,
      onDrop: () => {
        const nodeId = this.props.nodes.findIndex(
          isPointInRect(this.headPoint),
        );
        if (nodeId === -1 || nodeId === this.tailId || nodeId === this.headId) {
          this.setHeadPoint(null);
        } else {
          dispatch('TREE_UPDATE_CONNECTOR_HEAD', {
            treeKey: this.props.treeKey,
            id: this.props.id,
            nodeId,
          });
        }
      },
    });
  };

  setHeadPoint = point => {
    this.headPoint = point;
    this.draw();
  };

  setTailPoint = point => {
    this.tailPoint = point;
    this.draw();
  };

  setHead = ({ x, y }) => {
    this.headRect = { x, y };
    this.draw();
  };

  setTail = ({ x, y }) => {
    this.tailRect = { x, y };
    this.draw();
  };

  draw = () => {
    const points = getRectIntersections(this);
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points;
    this.connector.current.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
    this.connectorCircle.current.setAttribute('cx', x1);
    this.connectorCircle.current.setAttribute('cy', y1);
    this.connectorArrow.current.setAttribute('points', getArrowPoints(points));
  };

  // Helper function that checks for changes to the `headId` / `tailId` props
  // and resets the `headPoint` / `tailPoint` instance variables if the ids were
  // changed and redraws.
  sync = () => {
    const { headId, tailId } = this.props;
    const headRect = this.props.nodes.get(headId);
    const tailRect = this.props.nodes.get(tailId);
    const dirty =
      this.headId !== headId ||
      this.tailId !== tailId ||
      this.headRect.x !== headRect.x ||
      this.headRect.y !== headRect.y ||
      this.tailRect.x !== tailRect.x ||
      this.tailRect.y !== tailRect.y;
    this.headId = headId;
    this.headRect = headRect;
    this.tailId = tailId;
    this.tailRect = tailRect;
    if (dirty) {
      this.headPoint = null;
      this.tailPoint = null;
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
    return (
      <g className="connector">
        <path ref={this.connector} className="body" />
        <circle
          ref={this.connectorCircle}
          className="head"
          r={constants.CONNECTOR_HEAD_RADIUS}
          onMouseDown={this.dragTail}
        />
        <polygon
          ref={this.connectorArrow}
          className="tail"
          onMouseDown={this.dragHead}
        />
      </g>
    );
  }
}
