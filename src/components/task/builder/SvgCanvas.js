import React, { createRef, Component } from 'react';
import { throttle } from 'lodash-es';
import { isIE11 } from './helpers';

const PAN_THROTTLE = 33;
const SCALE_MIN = 0.1;
const SCALE_MAX = 1;
const ZOOM_MODIFIER = 2000;
const ZOOM_THROTTLE = 33;

export class SvgCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = createRef();
    this.transformer = createRef();
    // Since the scroll event is throttled and we get the incremental scroll
    // changes we need to accumulate them outside of the throttled logic.
    this.scrollDelta = 0;
    this.viewport = { scale: 1.0, x: 0, y: 0 };
  }

  // This event handler is bound by passing it as a react prop so that
  // propagation of click events on things inside the svg canvas (like nodes
  // and connectors) works properly. Otherwise this event was firing before
  // onMouseDown defined in <Node>.
  startPan = event => {
    event.preventDefault();
    event.stopPropagation();
    this.lastX = event.nativeEvent.offsetX;
    this.lastY = event.nativeEvent.offsetY;
    this.canvas.current.addEventListener('mousemove', this.onMousemove);
    this.canvas.current.addEventListener('mouseup', this.stopPan);
    this.canvas.current.addEventListener('mouseleave', this.stopPan);
  };

  stopPan = event => {
    event.preventDefault();
    event.stopPropagation();
    this.canvas.current.removeEventListener('mousemove', this.onMousemove);
    this.canvas.current.removeEventListener('mouseup', this.stopPan);
    this.canvas.current.removeEventListener('mouseleave', this.stopPan);
  };

  pan = throttle(event => {
    const { offsetX, offsetY } = event;
    const deltaX = offsetX - this.lastX;
    const deltaY = offsetY - this.lastY;
    this.lastX = offsetX;
    this.lastY = offsetY;
    this.viewport.x += deltaX;
    this.viewport.y += deltaY;
    this.setTransform();
  }, PAN_THROTTLE);

  zoom = throttle(event => {
    const { offsetX, offsetY } = event;
    // Compute the new scale value, the deltaY from the mouse event is usually
    // somewhere between 0 and 100 so we divide that by a large number to get
    // much smaller increments.
    let scale = this.viewport.scale - this.scrollDelta / ZOOM_MODIFIER;
    this.scrollDelta = 0;
    // If the newly computed scale value is less than the minimum or more than
    // the maximum we use those values instead.
    if (scale < SCALE_MIN) {
      scale = SCALE_MIN;
    } else if (scale > SCALE_MAX) {
      scale = SCALE_MAX;
    }
    if (scale !== this.viewport.scale) {
      // In order to keep the mouse cursor in the same position relative to the
      // svg graph while zooming we also need to adjust the viewport's x and y
      // values which result in translation of the graph.
      const svgX = (offsetX - this.viewport.x) / this.viewport.scale;
      const svgY = (offsetY - this.viewport.y) / this.viewport.scale;
      this.viewport.x += svgX * (this.viewport.scale - scale);
      this.viewport.y += svgY * (this.viewport.scale - scale);
      this.viewport.scale = scale;
      this.setTransform();
    }
  }, ZOOM_THROTTLE);

  onWheel = event => {
    event.preventDefault();
    event.stopPropagation();
    this.scrollDelta += event.deltaY;
    this.zoom(event);
  };

  onMousemove = event => {
    event.preventDefault();
    event.stopPropagation();
    this.pan(event);
  };

  setTransform(duration) {
    const { scale, x, y } = this.viewport;
    if (!isIE11) {
      const transition = duration
        ? `transition: transform ${duration}ms ease-in`
        : '';
      this.transformer.current.setAttribute(
        'style',
        `transform: translate(${x}px, ${y}px) scale(${scale});${transition}`,
      );
    } else {
      this.transformer.current.setAttribute(
        'transform',
        `translate(${x} ${y}) scale(${scale})`,
      );
    }
  }

  componentDidMount() {
    this.canvas.current.addEventListener('wheel', this.onWheel);
    this.setTransform();
  }

  render() {
    return (
      <svg
        ref={this.canvas}
        className="rkl tree-builder"
        style={{ height: '100%', width: '100%' }}
        onMouseDown={this.startPan}
      >
        <g ref={this.transformer}>{this.props.children}</g>
      </svg>
    );
  }
}
