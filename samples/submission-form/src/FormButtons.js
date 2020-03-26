import React from 'react';

export const FormButtons = props => (
  <div className="field is-horizontal">
    <div className="field-label" />
    <div className="field-body">
      <div className="field is-grouped">
        <div className="control">
          <button
            className="button is-primary"
            type="submit"
            disabled={!props.dirty || props.submitting}
            onClick={props.submit}
          >
            {props.submitting ? (
              <span className="fa fa-circle-o-notch fa-spin fa-fw" />
            ) : (
              <span className="fa fa-check fa-fw" />
            )}
            Submit
          </button>
        </div>
        <div className="control">
          <button className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </div>
  </div>
);
