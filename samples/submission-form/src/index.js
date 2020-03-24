import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

const renderApp = initial => {
  const root = document.getElementById('root');
  ReactDOM.unmountComponentAtNode(root);
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root,
  );
};

renderApp(true);

if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp(false);
  });
}
