// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter>
    <App
      initialConfig={window.__INITIAL_CONFIG__}
      ssrData={window.__SSR_DATA__}
    />
  </BrowserRouter>
)
