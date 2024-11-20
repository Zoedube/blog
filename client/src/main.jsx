import React from 'react'
import './style.scss';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from "./context/authContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
);