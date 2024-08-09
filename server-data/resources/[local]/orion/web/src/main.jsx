import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { VisibilityProvider } from './providers/visibilityProvider.jsx';
import { DataProvider } from './providers/dataContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <VisibilityProvider>
        <App />
      </VisibilityProvider>
    </DataProvider>
  </React.StrictMode>,
);
