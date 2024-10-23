import React from 'react'
import ReactDOM from 'react-dom/client'
import ReferralApp from './ReferralApp'
import WebApp from '@twa-dev/sdk'
import './index.css'

WebApp.ready()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReferralApp />
  </React.StrictMode>,
)

WebApp.expand()