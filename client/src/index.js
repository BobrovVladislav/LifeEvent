import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext.js";
import { EventProvider } from "./context/EventContext.js";
import './assets/styles/globals.scss';
import App from './App';

const CombinedProvider = ({ children }) => (
  <AuthProvider>
    <EventProvider>
      {children}
    </EventProvider>
  </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CombinedProvider>
        <App />
      </CombinedProvider>
    </BrowserRouter>
  </React.StrictMode>
);
