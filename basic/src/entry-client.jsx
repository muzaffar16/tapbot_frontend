import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ✅ Make sure these variables are not undefined
// console.log('👀 window.__SSR_DATA__:', window.__SSR_DATA__)
// console.log('👀 window.__INITIAL_CONFIG__:', window.__INITIAL_CONFIG__)

const ssrData = window.__SSR_DATA__
const initialConfig = window.__INITIAL_CONFIG__

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <App ssrData={ssrData} initialConfig={initialConfig} />
)
