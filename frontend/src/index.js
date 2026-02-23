import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a2e1e',
          color: '#e8f5e4',
          border: '1px solid rgba(111,207,151,0.2)',
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
    />
  </BrowserRouter>
);
