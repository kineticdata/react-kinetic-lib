import React, { createRef, Component, Fragment } from 'react';
import { connect, dispatch } from '../../../store';
import './builder.redux';
import { SvgCanvas } from './SvgCanvas';
import { Node } from './Node';
import { Connector } from './Connector';

const undo = treeKey => () => dispatch('TREE_UNDO', { treeKey });
const redo = treeKey => () => dispatch('TREE_REDO', { treeKey });

export class TreeBuilderComponent extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.connectorRefsMap = {
      byHead: {},
      byTail: {},
    };
  }

  connectorRef = (id, headId, tailId) => el => {
    if (el) {
      this.connectorRefsMap.byHead[headId] =
        this.connectorRefsMap.byHead[headId] || {};
      this.connectorRefsMap.byTail[tailId] =
        this.connectorRefsMap.byTail[tailId] || {};
      this.connectorRefsMap.byHead[headId][id] = el;
      this.connectorRefsMap.byTail[tailId][id] = el;
    } else {
      delete this.connectorRefsMap.byHead[headId][id];
      delete this.connectorRefsMap.byTail[tailId][id];
    }
  };

  render() {
    return (
      this.props.tree && (
        <Fragment>
          <SvgCanvas ref={this.canvasRef}>
            {this.props.tree.connectors
              .map((connector, id) => (
                <Connector
                  ref={this.connectorRef(
                    id,
                    connector.headId,
                    connector.tailId,
                  )}
                  key={id}
                  treeKey={this.props.treeKey}
                  canvasRef={this.canvasRef}
                  id={id}
                  label={connector.label}
                  headId={connector.headId}
                  tailId={connector.tailId}
                  nodes={this.props.tree.nodes}
                />
              ))
              .toArray()}
            {this.props.tree.nodes
              .map((node, id) => (
                <Node
                  key={id}
                  treeKey={this.props.treeKey}
                  canvasRef={this.canvasRef}
                  id={id}
                  name={node.name}
                  x={node.x}
                  y={node.y}
                  connectorRefsMap={this.connectorRefsMap}
                />
              ))
              .toArray()}
          </SvgCanvas>
          <div style={{ position: 'fixed', top: '5px', left: '5px' }}>
            <button type="button" onClick={undo(this.props.treeKey)}>
              undo
            </button>
            <button type="button" onClick={redo(this.props.treeKey)}>
              redo
            </button>
          </div>
        </Fragment>
      )
    );
  }
}

const mapStateToProps = (state, props) => ({
  tree: state.getIn(['trees', props.treeKey, 'tree'], null),
});
export const TreeBuilder = connect(mapStateToProps)(TreeBuilderComponent);
