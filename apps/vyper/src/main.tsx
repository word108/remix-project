import React from 'react'
import * as ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import App from './app/app'

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <App />
  );
}

