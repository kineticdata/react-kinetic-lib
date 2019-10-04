import React, { createRef, Component } from 'react';
import { throttle } from 'lodash-es';
import { isIE11 } from './helpers';
import * as constants from './constants';

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

  watchDrag = ({ event, onMove, onDrop, scaled = true, relative = true }) => {
    event.preventDefault();
    event.stopPropagation();
    // boolean to prevent race condition where onMove could be called after
    // onDrop was called
    let dragging = true;
    // for relative mode, track the last x and y positions so we can pass the
    // deltas to onMove
    let lastX = event.nativeEvent.clientX;
    let lastY = event.nativeEvent.clientY;
    // for non-relative mode we want to calculate the virtual position in the
    // canvas, to do this we need to subtract the offsets below from the client
    // position (this is because offsetX and offsetY can't be trusted in IE).
    const offsetLeft = this.canvas.current.parentNode.offsetLeft;
    const offsetTop = this.canvas.current.parentNode.offsetTop;
    const moveHandler = throttle(event => {
      event.preventDefault();
      event.stopPropagation();
      const { clientX, clientY } = event;
      if (dragging) {
        if (relative) {
          const dx = (clientX - lastX) / (scaled ? this.viewport.scale : 1);
          const dy = (clientY - lastY) / (scaled ? this.viewport.scale : 1);
          lastX = clientX;
          lastY = clientY;
          onMove({ dx, dy });
        } else {
          const x =
            (clientX - offsetLeft - this.viewport.x) / this.viewport.scale;
          const y =
            (clientY - offsetTop - this.viewport.y) / this.viewport.scale;
          onMove({ x, y });
        }
      }
    }, constants.THROTTLE_DRAG);
    const dropHandler = event => {
      event.preventDefault();
      event.stopPropagation();
      dragging = false;
      this.canvas.current.removeEventListener('mousemove', moveHandler);
      this.canvas.current.removeEventListener('mouseup', dropHandler);
      this.canvas.current.removeEventListener('mouseleave', dropHandler);
      if (onDrop) {
        onDrop();
      }
    };
    this.canvas.current.addEventListener('mousemove', moveHandler);
    this.canvas.current.addEventListener('mouseup', dropHandler);
    this.canvas.current.addEventListener('mouseleave', dropHandler);
  };

  drag = event => {
    this.watchDrag({ event, onMove: this.pan, scaled: false });
  };

  pan = ({ dx, dy }) => {
    this.viewport.x += dx;
    this.viewport.y += dy;
    this.setTransform();
  };

  zoom = throttle(event => {
    const { offsetX, offsetY } = event;
    // Compute the new scale value, the deltaY from the mouse event is usually
    // somewhere between 0 and 100 so we divide that by a large number to get
    // much smaller increments.
    let scale =
      this.viewport.scale - this.scrollDelta / constants.CANVAS_ZOOM_MODIFIER;
    this.scrollDelta = 0;
    // If the newly computed scale value is less than the minimum or more than
    // the maximum we use those values instead.
    if (scale < constants.CANVAS_SCALE_MIN) {
      scale = constants.CANVAS_SCALE_MIN;
    } else if (scale > constants.CANVAS_SCALE_MAX) {
      scale = constants.CANVAS_SCALE_MAX;
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
  }, constants.THROTTLE_ZOOM);

  onWheel = event => {
    event.preventDefault();
    event.stopPropagation();
    this.scrollDelta += event.deltaY;
    this.zoom(event);
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
        onMouseDown={this.drag}
      >
        <g ref={this.transformer}>{this.props.children}</g>
      </svg>
    );
  }
}
