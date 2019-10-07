import React, { Component, createRef, Fragment } from 'react';
import { dispatch } from '../../../store';
import * as constants from './constants';
import { getRectIntersections, isIE11, isPointInNode } from './helpers';
import { SvgText } from './SvgText';
import filter from '../../../assets/task/icons/filter.svg';

export class Connector extends Component {
  constructor(props) {
    super(props);
    this.connector = createRef();
    this.connectorBody = createRef();
    this.connectorTail = createRef();
    this.connectorLabel = createRef();
  }

  dragTail = event => {
    this.props.canvasRef.current.watchDrag({
      relative: false,
      event,
      onMove: this.setTailPoint,
      onDrop: () => {
        const nodeId = this.props.nodes.findIndex(
          isPointInNode(this.tailPoint),
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
          isPointInNode(this.headPoint),
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
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = getRectIntersections(this);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
    const attribute = isIE11 ? 'transform' : 'style';
    const connectorValue = isIE11
      ? `translate(${x2} ${y2}) rotate(${angle})`
      : `transform: translate(${x2}px, ${y2}px) rotate(${angle}deg)`;
    const connectorLabelValue = isIE11
      ? `translate(${x1 + dx / 2} ${y1 + dy / 2})`
      : `transform: translate(${x1 + dx / 2}px, ${y1 + dy / 2}px)`;
    this.connector.current.setAttribute(attribute, connectorValue);
    this.connectorTail.current.setAttribute('cx', length);
    this.connectorBody.current.setAttribute('x2', length);
    this.connectorLabel.current.setAttribute(attribute, connectorLabelValue);
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
        <g ref={this.connector}>
          <line
            ref={this.connectorBody}
            className="connector-body"
            x1="0"
            y1="0"
            y2="0"
          />
          <circle
            ref={this.connectorTail}
            className="connector-tail high-detail"
            r={constants.CONNECTOR_TAIL_RADIUS}
            cy="0"
            onMouseDown={this.dragTail}
          />
          <polygon
            className="connector-head high-detail"
            points={constants.CONNECTOR_HEAD_POINTS}
            onMouseDown={this.dragHead}
          />
        </g>
        <g ref={this.connectorLabel} className="connector-button">
          <rect
            className="high-detail"
            x={-constants.ICON_CENTER}
            y={-constants.ICON_CENTER}
            height={constants.ICON_SIZE}
            width={constants.ICON_SIZE}
            rx="3"
            ry="3"
          />
          {this.props.label ? (
            <Fragment>
              <rect
                className="high-detail"
                x={-constants.CONNECTOR_LABEL_CENTER_X}
                y={-constants.CONNECTOR_LABEL_CENTER_Y}
                height={constants.CONNECTOR_LABEL_HEIGHT}
                width={constants.CONNECTOR_LABEL_WIDTH}
                rx="3"
                ry="3"
              />
              <SvgText
                className="connector-label med-detail"
                x={-constants.CONNECTOR_LABEL_CENTER_X}
                y={-constants.CONNECTOR_LABEL_CENTER_Y}
                width={constants.CONNECTOR_LABEL_WIDTH}
                height={constants.CONNECTOR_LABEL_HEIGHT}
                padding={constants.CONNECTOR_LABEL_PADDING}
              >
                {this.props.label}
              </SvgText>
            </Fragment>
          ) : (
            <image
              className="high-detail"
              xlinkHref={filter}
              x={-constants.ICON_CENTER}
              y={-constants.ICON_CENTER}
            />
          )}
        </g>
      </g>
    );
  }
}
