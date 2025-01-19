import React from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';



export default props =>
    <aside className="menu">
        <Link to='/'>
            <i className='fa-solid fa-house-chimney'></i> Início
        </Link>
        <Link to='/animais'>
            <i class="fa-solid fa-cow"></i> Consulta & Cadastro
        </Link>
        <Link to='/relatorios'>
            <i class="fa-solid fa-clipboard"></i> Relatórios
        </Link>
    </aside>