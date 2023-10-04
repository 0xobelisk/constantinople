// import Home from "./home";
// import 'tailwindcss/tailwind.css';
// import "../css/font-awesome.css";
// import "../css/index.css";
// import store from '../store'
// import { Provider } from 'react-redux'
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './_app';

// ReactDOM.render(
//   <React.StrictMode>
//     <div>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </div>
//   </React.StrictMode>,
//   document.getElementById('root')
// );


import type { NextPage } from 'next';
import Home from "./home";


const IndexPage: NextPage = () => {
  return (
      <main>
          <Home/>
      </main>
  )
}

export default IndexPage


