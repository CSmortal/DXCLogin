import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";


i18n
    .use(initReactI18next)
    .init({
        lng: "english",
        resources: {
            english: {
                translation: require("./locales/en.json"),
            },
            chinese: {
                translation: require("./locales/zh.json"),
            },
            // Add more language resources as needed.
        },
    })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App i18n={i18n}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
