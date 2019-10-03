import React, { Component } from 'react';
import { Range } from 'immutable';
import { SvgCanvas } from './SvgCanvas';
import { Node } from './Node';
import { Connector } from './Connector';

export class Builder extends Component {
  constructor(props) {
    super(props);
    this.connectors = [];
  }

  connectorRef = el => {
    this.connectors.push(el);
  };

  render() {
    const connectors = [
      <Connector
        ref={this.connectorRef}
        key={0}
        from={{ x: 0, y: 0 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={1}
        from={{ x: 400, y: 0 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={2}
        from={{ x: 800, y: 0 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={3}
        from={{ x: 1200, y: 0 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={4}
        from={{ x: 1600, y: 0 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={5}
        from={{ x: 400, y: 200 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={6}
        from={{ x: 1200, y: 200 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={7}
        from={{ x: 0, y: 400 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={8}
        from={{ x: 400, y: 400 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={9}
        from={{ x: 800, y: 400 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={10}
        from={{ x: 1200, y: 400 }}
        to={{ x: 800, y: 200 }}
      />,
      <Connector
        ref={this.connectorRef}
        key={11}
        from={{ x: 1600, y: 400 }}
        to={{ x: 800, y: 200 }}
      />,
    ];
    return (
      <SvgCanvas>
        {connectors}
        {Range(0, 1000)
          .toArray()
          .map(i => (
            <Node
              key={i}
              x={(i * 400) % 4000}
              y={Math.floor((i * 400) / 4000) * 200}
              connectors={this.connectors}
            />
          ))}
      </SvgCanvas>
    );
  }
}
