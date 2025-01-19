import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../nav/Home';
import Animais from '../nav/Animais';
import Relatorios from '../nav/Relatorios';

export default props =>
    <main className='body'>
        <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/animais' element={<Animais />} />
            <Route path='/relatorios' element={<Relatorios />} />
            <Route path='*' element={<Home />} />
            </Routes>
    </main>
    