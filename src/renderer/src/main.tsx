import React from 'react'
import ReactDOM from 'react-dom/client'
import Application from './application'

const rootElement = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
)
