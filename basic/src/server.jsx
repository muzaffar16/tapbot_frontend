// server.jsx (SSR handler)
import express from 'express'
import { renderToString } from 'react-dom/server'
import App from './App'
import fetch from 'node-fetch'
import { StaticRouter } from 'react-router-dom/server'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 5173

app.use(express.static('dist'))

app.get('*', async (req, res) => {
  const params = new URLSearchParams(req.url.split('?')[1])
  const website = params.get('website')
  const licenseKey = params.get('licenseKey')

  let initialConfig = null
  let webData = null
  let isValid = false
  let isInternet = true

  if (website && licenseKey) {
    initialConfig = { website, licenseKey }
    try {
      const apiURL = `${process.env.VITE_API_URL || 'http://localhost:3000'}/check/${website}/${licenseKey}`
      const result = await fetch(apiURL)
      const data = await result.json()
      isValid = data.valid || false
      webData = data.resultJson || {}
    } catch (err) {
      isInternet = false
    }
  }

  const appHtml = renderToString(
    <StaticRouter location={req.url}>
      <App initialConfig={initialConfig} ssrData={{ isValid, webData, isInternet }} />
    </StaticRouter>
  )

  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>TapBot</title></head>
      <body>
        <div id="root">${appHtml}</div>
        <script>window.__INITIAL_CONFIG__ = ${JSON.stringify(initialConfig)}</script>
        <script>window.__SSR_DATA__ = ${JSON.stringify({ isValid, webData, isInternet })}</script>
        <script type="module" src="/main.jsx"></script>
      </body>
    </html>
  `

  res.send(html)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
