import './Header.css';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'

export default props =>
    <header className='header'>
      <div className='title'>
         <i className={`fa-solid fa-${props.icon} m-3`}></i>{props.location}
      </div>
       <p className='subtitle ms-4 text-muted'>{props.subject}</p>
    </header>


