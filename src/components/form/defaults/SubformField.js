import React from 'react';
import { SubmissionForm } from '../..';

export class SubformField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: null };
  }

  closeSubform = () => {
    this.setState({ open: null });
  };

  newSubmission = () => {
    this.setState({ open: 'new' });
  };

  editSubmission = id => {
    this.setState({ open: id });
  };

  deleteSubmission = id => {
    this.props.onChange(
      this.props.value.filter(submission => submission.id !== id),
    );
  };

  render() {
    return (
      <div
        className="subform-field"
        style={{ border: '2px solid lightslategrey', padding: '1rem' }}
      >
        <h1>Subform Field</h1>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Values</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.value.map(submission => (
              <tr key={submission.id}>
                <td>{submission.id}</td>
                <td>
                  <pre>{JSON.stringify(submission.values)}</pre>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => this.editSubmission(submission.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => this.deleteSubmission(submission.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {this.props.value.isEmpty() && (
              <tr>
                <td colSpan={3}>There are no child submissions</td>
              </tr>
            )}
          </tbody>
        </table>

        {this.state.open === null ? (
          <button type="button" onClick={this.newSubmission}>
            New
          </button>
        ) : (
          <button type="button" onClick={this.closeSubform}>
            Cancel
          </button>
        )}
        {this.state.open === 'new' ? (
          <SubmissionForm
            kappSlug={this.props.options.get('kappSlug')}
            formSlug={this.props.options.get('formSlug')}
            onSave={formOptions => submission => {
              this.props.onChange(this.props.value.push(submission));
              this.closeSubform();
            }}
          />
        ) : this.state.open ? (
          <SubmissionForm
            id={this.state.open}
            onSave={formOptions => updated => {
              this.props.onChange(
                this.props.value.map(submission =>
                  submission.id === updated.id ? updated : submission,
                ),
              );
              this.closeSubform();
            }}
          />
        ) : null}
      </div>
    );
  }
}
