import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {GoogleOAuthProvider} from '@react-oauth/google'

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <GoogleOAuthProvider clientId="531839352181-2bh6hediu8ssbddu9f92ocr3ob1pqbbq.apps.googleusercontent.com">
    <App />
</GoogleOAuthProvider>
)