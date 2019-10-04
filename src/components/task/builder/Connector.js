import React, { Component, createRef } from 'react';
import * as constants from './constants';
import { getArrowPoints, getRectIntersections } from './helpers';

export class Connector extends Component {
  constructor(props) {
    super(props);
    this.connector = createRef();
    this.connectorCircle = createRef();
    this.connectorArrow = createRef();
  }

  dragTail = event => {
    this.draggingTail = true;
    this.props.canvasRef.current.watchDrag({
      relative: false,
      event,
      onMove: this.setFrom,
      onDrop: () => {
        this.draggingTail = false;
      },
    });
  };

  dragHead = event => {
    this.draggingHead = true;
    this.props.canvasRef.current.watchDrag({
      relative: false,
      event,
      onMove: this.setTo,
      onDrop: () => {
        this.draggingHead = false;
      },
    });
  };

  setTo = ({ x, y }) => {
    this.to = { x, y };
    this.draw();
  };

  setFrom = ({ x, y }) => {
    this.from = { x, y };
    this.draw();
  };

  draw = () => {
    const points = getRectIntersections(this.from, this.to);
    const tailPoint = this.draggingTail
      ? [this.from.x, this.from.y]
      : points[0];
    const headPoint = this.draggingHead ? [this.to.x, this.to.y] : points[1];
    const [x1, y1] = tailPoint;
    const [x2, y2] = headPoint;
    this.connector.current.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
    this.connectorCircle.current.setAttribute('cx', x1);
    this.connectorCircle.current.setAttribute('cy', y1);
    this.connectorArrow.current.setAttribute(
      'points',
      getArrowPoints(tailPoint, headPoint),
    );
  };

  // Helper function that syncs the instance's `fromX`, `fromY`, `toX`, and
  // `toY` values with the ones passed via the `from` and `to` props and calls
  // draw if the internal state has changed as a result.
  sync = () => {
    const { from, to } = this.props;
    const dirty =
      !this.from ||
      !this.to ||
      this.from.x !== from.x ||
      this.from.y !== from.y ||
      this.to.x !== to.x ||
      this.to.x !== to.y;
    this.from = { x: from.x, y: from.y };
    this.to = { x: to.x, y: to.y };
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
