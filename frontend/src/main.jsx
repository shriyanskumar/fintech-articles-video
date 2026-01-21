import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.onerror = function (msg, url, line, col, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="color:red;padding:20px;background:#fff;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;overflow:auto;">
      <h1>Runtime Error</h1>
      <p><strong>Message:</strong> ${msg}</p>
      <p><strong>File:</strong> ${url}</p>
      <p><strong>Line:</strong> ${line}:${col}</p>
      <pre style="background:#eee;padding:10px;margin-top:20px;">${error?.stack || 'No stack trace'}</pre>
    </div>`;
  }
  return false;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

