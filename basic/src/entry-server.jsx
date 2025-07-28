// import React from 'react';


import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render({ url, initialConfig,ssrData }) {
  // console.log("server entry",ssrData)
  return renderToString(<App initialConfig={initialConfig}  ssrData={ssrData} />)
}




