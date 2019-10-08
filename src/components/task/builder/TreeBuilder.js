import React, { createRef, Component, Fragment } from 'react';
import { connect, dispatch } from '../../../store';
import './builder.redux';
import { isPointInNode } from './helpers';
import { SvgCanvas } from './SvgCanvas';
import { Node } from './Node';
import { Connector } from './Connector';

const undo = treeKey => () => dispatch('TREE_UNDO', { treeKey });
const redo = treeKey => () => dispatch('TREE_REDO', { treeKey });

export class TreeBuilderComponent extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.connectorMap = {
      byHead: {},
      byTail: {},
    };
    this.nodeMap = {};
  }

  findNodeByPoint = point => this.props.tree.nodes.find(isPointInNode(point));

  getConnectorsByHead = nodeId =>
    Object.values(this.connectorMap.byHead[nodeId] || {});

  getConnectorsByTail = nodeId =>
    Object.values(this.connectorMap.byTail[nodeId] || {});

  registerConnector = connector => connectorInstance => {
    const { headId, id, tailId } = connector;
    this.connectorMap.byHead[headId] = this.connectorMap.byHead[headId] || {};
    this.connectorMap.byTail[tailId] = this.connectorMap.byTail[tailId] || {};
    if (connectorInstance) {
      connectorInstance.setTreeBuilder(this);
      this.connectorMap.byHead[headId][id] = connectorInstance;
      this.connectorMap.byTail[tailId][id] = connectorInstance;
    } else {
      delete this.connectorMap.byHead[headId][id];
      delete this.connectorMap.byTail[tailId][id];
    }
  };

  registerNode = node => nodeInstance => {
    const { id } = node;
    if (nodeInstance) {
      nodeInstance.setTreeBuilder(this);
      this.nodeMap[id] = nodeInstance;
    } else {
      delete this.nodeMap[id];
    }
  };

  watchDrag = (...args) => this.canvasRef.current.watchDrag(...args);

  render() {
    const { tree: { connectors = [], nodes = [] } = {}, treeKey } = this.props;
    return (
      <Fragment>
        <SvgCanvas ref={this.canvasRef}>
          {connectors.map(connector => (
            <Connector
              key={connector.id}
              ref={this.registerConnector(connector)}
              treeKey={treeKey}
              connector={connector}
            />
          ))}
          {nodes.map(node => (
            <Node
              key={node.id}
              ref={this.registerNode(node)}
              treeKey={treeKey}
              node={node}
            />
          ))}
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
    );
  }
}

const mapStateToProps = (state, props) => ({
  tree: state.getIn(['trees', props.treeKey, 'tree'], null),
});
export const TreeBuilder = connect(mapStateToProps)(TreeBuilderComponent);
