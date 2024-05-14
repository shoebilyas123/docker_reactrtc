import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles.css';
import App from './app';
import ContextProvider from './socketContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
