import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'
import Mainpg from './components/mainpg'
import Bot from './components/bot'
import Complain from './components/complain'

const isSSR = typeof window === 'undefined'

const App = ({ ssrData,initialConfig }) => {
  const Router = isSSR ? StaticRouter : BrowserRouter
  const routerProps = isSSR ? { location: '/' } : {}
  //  console.log("✅ App loaded with ssrData:", ssrData)
  useEffect(() => {
    // console.log("✅ App loaded with ssrData:", ssrData)
  }, [])


  return (
    <Router {...routerProps}>
      <Routes>
        <Route
          path="/"
          element={
            <Mainpg
              isPopup={false}
              initialConfig={initialConfig}
              ssrData={ssrData}
            />
          }
        />
        <Route path="/bot" element={<Bot isPopup={false} ssrData={ssrData} />} />
        <Route path="/complain" element={<Complain isPopup={false} ssrData={ssrData} />} />
      </Routes>
    </Router>
  )
}

export default App



