import 'tailwindcss/tailwind.css';
import "../css/font-awesome.css";
import "../css/index.css";
import "../css/game-img.css";
import type { AppProps } from 'next/app';
import React from 'react';
import ReactDOM from 'react-dom';
import store from '../store'
import { Provider } from 'react-redux'

function App({ Component, pageProps }: AppProps) {

  return (
      <Provider store={store}>
      <Component {...pageProps} />

      </Provider>
  )
}

export default  App
