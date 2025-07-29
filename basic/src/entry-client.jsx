import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'


const ssrData = window.__SSR_DATA__
const initialConfig = window.__INITIAL_CONFIG__

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <App ssrData={ssrData} initialConfig={initialConfig} />
)
