import React, { Component, Fragment } from 'react';
import { List } from 'immutable';
import moment from 'moment';

import { fetchMessageHistory } from '../../apis/discussions';
import { UserMessageGroup } from './UserMessageGroup';

export class MessageHistory extends Component {
  state = { versions: null, index: null };
  static defaultProps = {
    timeFormat: 'MMMM D, YYYY h:mm A',
  };

  componentDidMount() {
    const previous = fetchMessageHistory({
      discussionId: this.props.discussion.id,
      id: this.props.message.id,
    }).then(response => {
      const versions = response.messages.reverse();
      const index = versions.findIndex(
        m => m.versionId === this.props.message.versionId,
      );
      this.setState({
        versions,
        index: index !== -1 ? index : versions.length - 1,
      });
    });
  }

  render() {
    if (this.state.versions) {
      const currentVersion = this.state.versions[this.state.index];
      return (
        <Fragment>
          <div className="message-versions-controls">
            <div className="timestamp">
              Changed on{' '}
              {moment(currentVersion.updatedAt).format(this.props.timeFormat)}
            </div>
            <div className="page-info">
              {this.state.index + 1} of {this.state.versions.length}
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-sm btn-inverse"
                disabled={this.state.index <= 0}
                onClick={() =>
                  this.setState(state => ({ index: state.index - 1 }))
                }
              >
                <i className="fa fa-fw fa-caret-left" />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-inverse"
                disabled={this.state.index >= this.state.versions.length - 1}
                onClick={() =>
                  this.setState(state => ({ index: state.index + 1 }))
                }
              >
                <i className="fa fa-fw fa-caret-right" />
              </button>
            </div>
          </div>
          <div className="message-versions">
            <UserMessageGroup
              discussion={this.props.discussion}
              profile={this.props.profile}
              messages={List([currentVersion])}
            />
          </div>
        </Fragment>
      );
    }
    return null;
  }
}
