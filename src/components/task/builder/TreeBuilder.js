import React, { createRef, Component, Fragment } from 'react';
import { pick } from 'lodash-es';
import { connect, dispatch } from '../../../store';
import { configureTreeBuilder } from './builder.redux';
import { isPointInNode } from './helpers';
import { Connector as ConnectorModel } from './models';
import { SvgCanvas } from './SvgCanvas';
import { Node } from './Node';
import { Connector } from './Connector';

export class TreeBuilderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { newConnector: null };
    this.newConnector = createRef();
    this.canvasRef = createRef();
    this.connectorMap = {
      byHead: {},
      byTail: {},
    };
    this.nodeMap = {};
  }

  componentDidMount() {
    this.checkConfig();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkConfig();
  }

  checkConfig() {
    // until this instance of the tree builder is mounted the builder state will
    // be undefined (not in redux at all), once mounted it will be set to a null
    // placeholder then we will call configureTreeBuilder with the component's
    // props at that time
    if (this.props.treeBuilderState === null) {
      configureTreeBuilder(
        pick(this.props, ['treeKey', 'sourceName', 'sourceGroup', 'name']),
      );
    }
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

  // helper provided so that the plus button on a node can start the process of
  // creating a new connector, since the drop position may not be valid we do
  // not want to persist anything to redux state until we can confirm the drop
  // is valid so we store the temp connector in component state so it will be
  // rendered and then on move we update the Connector instance (by ref) with
  // the new position
  dragNewConnector = node => position => {
    if (!this.state.newConnector) {
      this.setState(state => ({
        newConnector:
          state.newConnector ||
          ConnectorModel({
            dragging: 'head',
            headPosition: position,
            tailId: node.id,
            tailPosition: node.position,
          }),
      }));
    }
    if (this.newConnector.current) {
      this.newConnector.current.setTreeBuilder(this);
      this.newConnector.current.setHead(position, true);
    }
  };

  // helper provided so that the plus button on a node can create a new
  // connector in conjunction with `dragNewConnector` above
  dropNewConnector = () => {
    if (this.newConnector.current) {
      this.newConnector.current.dropHead();
    }
    this.setState({ newConnector: null });
  };

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
    const { selected, treeBuilderState, treeKey } = this.props;
    if (treeBuilderState) {
      const { saving, tree } = treeBuilderState;
      return this.props.children({
        actions: {
          deleteConnector: id =>
            dispatch('TREE_REMOVE_CONNECTOR', { treeKey, id }),
          deleteNode: id => dispatch('TREE_REMOVE_NODE', { treeKey, id }),
          updateConnector: values =>
            dispatch('TREE_UPDATE_CONNECTOR', { treeKey, ...values }),
          updateNode: values =>
            dispatch('TREE_UPDATE_NODE', { treeKey, ...values }),
          save: ({
            overwrite = false,
            newName = '',
            onError = this.props.onError,
            onSave = this.props.onSave,
          }) => {
            dispatch('TREE_SAVE', {
              newName,
              overwrite,
              onError,
              onSave,
              treeKey,
            });
          },
        },
        name: tree.name,
        saving,
        treeBuilder: (
          <Fragment>
            <SvgCanvas ref={this.canvasRef}>
              {tree.connectors
                .map(connector => (
                  <Connector
                    key={connector.id}
                    ref={this.registerConnector(connector)}
                    treeKey={treeKey}
                    connector={connector}
                    primary={
                      selected.getIn([0, 'connectorId']) === connector.id
                    }
                    selected={selected.some(
                      ({ connectorId }) => connectorId === connector.id,
                    )}
                    onSelect={this.props.onSelectConnector}
                  />
                ))
                .toList()}
              {this.state.newConnector && (
                <Connector
                  ref={this.newConnector}
                  treeKey={treeKey}
                  connector={this.state.newConnector}
                />
              )}
              {tree.nodes
                .map(node => (
                  <Node
                    key={node.id}
                    ref={this.registerNode(node)}
                    treeKey={treeKey}
                    node={node}
                    primary={selected.getIn([0, 'nodeId']) === node.id}
                    selected={selected.some(({ nodeId }) => nodeId === node.id)}
                    onSelect={this.props.onSelectNode}
                  />
                ))
                .toList()}
            </SvgCanvas>
          </Fragment>
        ),
      });
    }
    return null;
  }
}

const mapStateToProps = (state, props) => ({
  treeBuilderState: state.getIn(['trees', props.treeKey]),
  tree: state.getIn(['trees', props.treeKey, 'tree']),
});
export const TreeBuilder = connect(mapStateToProps)(TreeBuilderComponent);
