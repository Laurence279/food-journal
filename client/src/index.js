import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <Auth0Provider
  domain="dev-ldock2kl.us.auth0.com"
  clientId="U7YagI2I4d6mVU3FTj50W3ueRKAyw5In"
  redirectUri={window.location.origin}
  audience="https://dev-ldock2kl.us.auth0.com/api/v2/"
  scope="read:current_user"
>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
//registerServiceWorker();
