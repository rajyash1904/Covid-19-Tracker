import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import Home from './Home/Home';
import {GlobalContext, covidDataService} from './Context/GlobalContext';
//import { Trial } from './Trial';
ReactDOM.render(
  <React.StrictMode>
    <GlobalContext.Provider value = {new covidDataService()}>
      <Home/>
    </GlobalContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
