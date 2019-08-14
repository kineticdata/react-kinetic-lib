import React, { Component, createRef } from 'react';

export class Scroller extends Component {
  constructor(props) {
    super(props);
    this.parent = createRef();
    this.child = createRef();
    this.lastTop = 0;
  }

  componentDidMount() {
    this.scroll();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scroll();
  }

  scroll() {
    const parent = this.parent.current;
    const child = this.child.current;
    if (child.offsetTop > this.lastTop) {
      if (
        child.offsetTop + child.clientHeight >
        parent.scrollTop + parent.clientHeight
      ) {
        child.scrollIntoView(false);
      }
    } else if (child.offsetTop < this.lastTop) {
      if (child.offsetTop < parent.scrollTop) {
        child.scrollIntoView(true);
      }
    }
    this.lastTop = child.offsetTop;
  }

  render() {
    return this.props.children({
      parentRef: this.parent,
      childRef: this.child,
    });
  }
}
