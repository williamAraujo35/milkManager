import './App.css';
import React from 'react';
import Logo from '../templates/Logo';
import Menu from '../templates/Menu';
import Footer from '../templates/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter } from 'react-router-dom';
import Routes from '../main/Routes';
import Background from '../templates/Background';
import Header from '../templates/Header';



export default props =>
    <div className='app'>
      <HashRouter>
          <Logo />
          <Menu />
          <Routes />
          <Footer />
      </HashRouter>
    </div>
  