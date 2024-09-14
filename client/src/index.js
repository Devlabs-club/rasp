import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
)
