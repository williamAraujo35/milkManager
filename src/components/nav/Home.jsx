import React from 'react';
import './Home.css';
import Header from '../templates/Header';

//DATA ATUAL
const dataAtual = new Date();
const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
}).format(dataAtual);

export { dataFormatada }

export default props =>
     <React.Fragment>
          <Header icon='house-chimney' location='Início' subject={dataFormatada} />
          <main className='background m-3'>
               <div className='fs-1'>
                    <p className='mt-3 ms-3 title'>Bem vindo ao MilkManager!</p>
                    <hr />
                    <p className=' ms-3 fs-4 text-muted'>Seu sistema para gerenciamento de animais...</p>
               </div>
          </main>
     </React.Fragment>
   

   