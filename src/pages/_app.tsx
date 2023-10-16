import 'tailwindcss/tailwind.css';
import '../css/font-awesome.css';
import '../css/index.css';
import '../css/game-img.css';
import type { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
