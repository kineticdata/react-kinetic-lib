import React, { Component, createRef } from 'react';
import * as constants from './constants';
import { getArrowPoints, getRectIntersections } from './helpers';

export class Connector extends Component {
  constructor(props) {
    super(props);
    this.from = props.from;
    this.to = props.to;
    this.connector = createRef();
    this.connectorCircle = createRef();
    this.connectorArrow = createRef();
  }

  dragTail = event => {
    console.log('on drag tail');
  };

  dragHead = event => {
    console.log('on drag head');
  };

  setTo = to => {
    this.to = to;
    this.draw();
  };

  setFrom = from => {
    this.from = from;
    this.draw();
  };

  draw = () => {
    const points = getRectIntersections(this.from, this.to);
    const [[x1, y1], [x2, y2]] = points;
    this.connector.current.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`);
    this.connectorCircle.current.setAttribute('cx', x1);
    this.connectorCircle.current.setAttribute('cy', y1);
    this.connectorArrow.current.setAttribute('points', getArrowPoints(points));
  };

  componentDidMount() {
    this.draw();
  }

  render() {
    return (
      <g>
        <path ref={this.connector} className="connector" />
        <circle
          r={constants.CONNECTOR_HEAD_RADIUS}
          ref={this.connectorCircle}
          className="connector-tail"
          onMouseDown={this.dragTail}
        />
        <polygon
          ref={this.connectorArrow}
          className="connector-head"
          onMouseDown={this.dragHead}
        />
      </g>
    );
  }
}
