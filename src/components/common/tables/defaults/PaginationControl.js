import React from 'react';
import { I18n } from '../../../core/i18n/I18n';

export const PaginationControl = ({ nextPage, prevPage, loading }) => (
  <div>
    <button onClick={prevPage} disabled={loading || !prevPage}>
      <I18n>Previousss</I18n>
    </button>
    <button onClick={nextPage} disabled={loading || !nextPage}>
      <I18n>Next</I18n>
    </button>
  </div>
);

export default PaginationControl;
