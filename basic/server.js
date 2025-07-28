// server.js (fixed version)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import fetch from 'node-fetch'
import multer from 'multer'
import FormData from 'form-data'
import dotenv from 'dotenv'
dotenv.config()


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5174
const api = process.env.VITE_API_URL
async function createServer() {
  const app = express()
  const upload = multer()

  app.use(express.json())


  // Proxy chat API
  app.post('/chat-relay', express.json(), async (req, res) => {
    try {
      const { message, sessionId } = req.body
      const websiteName = req.query.websiteName

      if (!message || !websiteName) {
        return res.status(400).json({ error: 'Missing message or websiteName' })
      }

      const response = await fetch(`${api}/chat/${websiteName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId })
      })

      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      console.error('Chat relay error:', err)
      res.status(500).json({ error: 'Failed to connect to backend chat API' })
    }
  })

  // Proxy complaint API
  app.post('/submit-complaint', upload.single('attachment'), async (req, res) => {
    try {
      console.log("enter complain")
      const formData = new FormData()
      formData.append('order_id', req.body.order_id)
      formData.append('mobile_number', req.body.mobile_number)
      formData.append('email', req.body.email)
      formData.append('message', req.body.message)

      if (req.file) {
        formData.append('attachment', req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype
        })
      }

      const response = await fetch(`${api}/complain`, {
        method: 'POST',
        body: formData
      })


      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      console.error('Complaint relay error:', err)
      res.status(500).json({ message: 'Error submitting complaint.' })
    }
  })



  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })

    app.use(vite.middlewares)

    app.use('*all', async (req, res, next) => {
      try {
        const url = req.originalUrl
        const fullUrl = new URL(url, `http://${req.headers.host}`)
        const website = fullUrl.searchParams.get('website')
        const licenseKey = fullUrl.searchParams.get('licenseKey')

        let ssrData = { isValid: false, webData: {}, isInternet: true }

        if (website && licenseKey) {
          try {
            const apiUrl = `${api}/check/${website}/${licenseKey}`
            const response = await fetch(apiUrl)
            const json = await response.json()
            ssrData.isValid = json.valid || false
            ssrData.webData = json.resultJson || {}
          } catch (error) {
            console.error('API fetch error:', error)
            ssrData.isInternet = false
          }
        }

        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)

        const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
        const appHtml = await render({ url, initialConfig: { website, licenseKey }, ssrData })

        const html = template.replace('<!--ssr-outlet-->', appHtml).replace('</body>', `
          <script>
            window.__SSR_DATA__ = ${JSON.stringify(ssrData)};
            window.__INITIAL_CONFIG__ = ${JSON.stringify({ website, licenseKey })};
          </script>
        </body>`)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (e) {
        vite.ssrFixStacktrace(e)
        next(e)
      }
    })
  } else {
    console.log('Running in production mode', api, port)
    app.use('/assets', express.static(path.resolve(__dirname, 'dist/client/assets')))

    app.use('*all', async (req, res, next) => {
      try {
        const url = req.originalUrl
        const fullUrl = new URL(url, `http://${req.headers.host}`)
        const website = fullUrl.searchParams.get('website')
        const licenseKey = fullUrl.searchParams.get('licenseKey')
        let ssrData = { isValid: false, webData: {}, isInternet: true }
        if (website && licenseKey) {
          try {
            const apiUrl = `${api}/check/${website}/${licenseKey}`
            const response = await fetch(apiUrl)
            const json = await response.json()
            ssrData.isValid = json.valid || false
            ssrData.webData = json.resultJson || {}
          } catch (error) {
            ssrData.isInternet = false
          }
        }

        const templatePath = path.resolve(__dirname, 'dist/client/index.html')
        if (!fs.existsSync(templatePath)) {
          return res.status(500).send('index.html not found in dist/client')
        }

        const template = fs.readFileSync(templatePath, 'utf-8')
        const { render } = await import('./dist/server/entry-server.js')

        const appHtml = await render({ url, initialConfig: { website, licenseKey }, ssrData })

        const html = template.replace('<!--ssr-outlet-->', appHtml).replace('</body>', `
          <script>
            window.__SSR_DATA__ = ${JSON.stringify(ssrData)};
            window.__INITIAL_CONFIG__ = ${JSON.stringify({ website, licenseKey })};
          </script>
        </body>`)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (err) {
        console.error(err)
        next(err)
      }
    })
  }


  app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
}

createServer()