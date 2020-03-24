import React from 'react';
import { KineticLib, SubmissionForm } from '@kineticdata/react';

export const App = () => (
  <KineticLib noSocket>
    {({ initialized }) =>
      initialized ? (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1 0 0', padding: '1rem' }}>
            <h2>New Submission</h2>
            <SubmissionForm kappSlug="services" formSlug="rendering" />
          </div>
          <div style={{ flex: '1 0 0', padding: '1rem' }}>
            <h2>Edit Submission</h2>
            <SubmissionForm id="e8c2c25e-6d3a-11ea-aa96-c1c26fdda6c5" />
          </div>
        </div>
      ) : (
        <div>Initializing...</div>
      )
    }
  </KineticLib>
);
