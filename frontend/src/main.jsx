import React from 'react'; //The core React library, required for JSX and component-based rendering.
import ReactDOM from 'react-dom/client'; //Handles rendering React components into the actual DOM (web page).
import { BrowserRouter } from "react-router-dom";

import App from './App.jsx';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>
)
