import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Find the root element in the HTML
const rootElement = document.getElementById('root');

// Render the App component
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
