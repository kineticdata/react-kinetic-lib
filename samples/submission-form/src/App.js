import React from 'react';
import { KineticLib, SubmissionForm } from '@kineticdata/react';

export const App = () => (
  <KineticLib noSocket>
    {({ initialized }) =>
      initialized ? (
        <SubmissionForm
          kappSlug="services"
          formSlug="rendering"
          id="e8c2c25e-6d3a-11ea-aa96-c1c26fdda6c5"
        />
      ) : (
        <div>Initializing...</div>
      )
    }
  </KineticLib>
);
