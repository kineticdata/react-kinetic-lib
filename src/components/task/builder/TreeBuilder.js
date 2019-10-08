import React, { createRef, Component, Fragment } from 'react';
import { connect, dispatch } from '../../../store';
import './builder.redux';
import { isPointInNode } from './helpers';
import { SvgCanvas } from './SvgCanvas';
import { Node } from './Node';
import { Connector } from './Connector';

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

  findDuplicateConnector = (nodeId1, nodeId2) =>
    this.props.tree.connectors.some(
      connector =>
        (connector.headId === nodeId1 && connector.tailId === nodeId2) ||
        (connector.headId === nodeId2 && connector.tailId === nodeId1),
    );

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
    return this.props.children({
      treeBuilder: (
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
        </Fragment>
      ),
    });
  }
}

const mapStateToProps = (state, props) => ({
  tree: state.getIn(['trees', props.treeKey, 'tree']),
});
export const TreeBuilder = connect(mapStateToProps)(TreeBuilderComponent);
