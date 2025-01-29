import React, { Component } from 'react';
import Header from '../templates/Header';
import { dataFormatada } from '../nav/Home';
import axios from 'axios';
import './Animais.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const initialState = {
    animal: {nomeAnimal: '', dataNascimento: '', sexo: '', pesoAnimal: 0.0, raca: '', brinco: 0, lote: '', pai: '', mae: '' },
    list: []
}

//url para conexão com o banco de dados (db.json)
const bdUrl = 'http://localhost:3005/animal';
//const bdUrl = 'https://backend-milkmanager.onrender.com/animal';

export default class Animais extends Component {

    state = { ...initialState };

    //Função para atualizar o estado do ANIMAL a partir do que o usuário digita no formulário    
    updateField(event) {
        const animal = { ...this.state.animal };
        animal[event.target.name] = event.target.value;
        this.setState({ animal });
    }

    //função para atualizar o estado do array de ANIMAIS chamado de list, dentro do objeto initialState
    componentDidMount() {
        axios(bdUrl).then(resposta => {
            this.setState({ list: resposta.data });
        }).catch(error => {
            console.error("Erro ao carregar os dados dos animais cadastrados", error);
        });
    }

    //função para limpar o estado atual do ANIMAL
    clear(){
        this.setState({ animal: initialState.animal });
    }

     //função para atualizar a lista de animais colocando o novo animal ou animal atualizado no topo da lista
     getUpdatedList(animal) {
        const list = this.state.list.filter(a => a.id !== animal.id);
        list.unshift(animal)
        return list;
    }
    /*Validação de formulário*/
    validateForm() {
        const { nomeAnimal, dataNascimento, sexo, pesoAnimal, raca, brinco, lote } = this.state.animal;
        const errors = [];
    
        if (!nomeAnimal.trim()) errors.push("O campo 'Nome' é obrigatório.");
        if (!dataNascimento.trim()) errors.push("O campo 'Data de Nascimento' é obrigatório e deve ser anterior ou igual a data de hoje.");
        if (!sexo.trim()) errors.push("O campo 'Sexo' é obrigatório.");
        if (!pesoAnimal || pesoAnimal <= 0) errors.push("O campo 'Peso' deve ser maior que zero.");
        if (!raca.trim()) errors.push("O campo 'Raça' é obrigatório.");
        if (!brinco || brinco <= 0) errors.push("O campo 'Brinco' deve ser um número positivo.");
        if (!lote.trim()) errors.push("O campo 'Lote' é obrigatório.");
    
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return false;
        }
    
        return true;
    }

    //função para gravar um novo usuário ou para alterar
    save() {

        if (!this.validateForm()) {
            return; // Interrompe o fluxo se a validação falhar
        }
        const animal = this.state.animal;
        const method = animal.id ? 'put' : 'post' //Se o user.id estiver setado não será um novo usuário e utilizaremos o put, caso contrário é um novo usuário e será usado o método post
        const url = animal.id ? `${bdUrl}/${animal.id}` : bdUrl //Se o user.id estiver setado é uma atualização e nela precisa contar o id no usuário que será alterado, caso contrário, nenhum id será incluído na url
        axios[method](url, animal)
            .then(resp => {
                const list = this.getUpdatedList(resp.data);
                this.setState({ animal: initialState.animal, list })
            })
    }

    //função para carregar um animal
    load(animal){
        this.setState({ animal })
    }

    //função para remover um animal
    remove(animal) {
        const confirmDelete = window.confirm(`Você tem certeza que deseja excluir o animal "${animal.nomeAnimal}"?`);
        
        if (confirmDelete) {
            axios.delete(`${bdUrl}/${animal.id}`).then(() => {
                const list = this.state.list.filter(a => a.id !== animal.id);
                this.setState({ list });
                alert(`O animal "${animal.nomeAnimal}" foi excluído com sucesso!`);
            }).catch(error => {
                console.error("Erro ao excluir o animal:", error);
                alert("Ocorreu um erro ao tentar excluir o animal. Tente novamente mais tarde.");
            });
        } else {
            alert(`A exclusão do animal "${animal.nomeAnimal}" foi cancelada.`);
        }
    }


    //função para criar tabela
    renderTable(){
        return(
            <div className='registreTable'>
                <table className='table table-striped m-3 tableAnimal'>
                <thead className='table-dark text-center'>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Nascimento</th>
                        <th>Sexo</th>
                        <th>Peso</th>
                        <th>Raça</th>
                        <th>Brinco</th>
                        <th>Lote</th>
                        <th>Pai</th>
                        <th>Mãe</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
            </div>
        )
    }
   
 
       //função para criar linhas de uma tabela
    renderRows(){

        return this.state.list.map(animal => {
            //ajusta o formado da data de nascimento do animal
            
            /*const dataNascimentoFormatada = new Date(animal.dataNascimento).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });*/
            const dataNascimentoFormatada = new Date(animal.dataNascimento + "T00:00:00").toISOString().split("T")[0].split('-').reverse().join('/');


            return (
                <tr className='text-center' key={animal.id}>
                    <td>{animal.id}</td>
                    <td>{animal.nomeAnimal}</td>
                    <td>{dataNascimentoFormatada}</td>
                    <td>{animal.sexo}</td>
                    <td>{animal.pesoAnimal}</td>
                    <td>{animal.raca}</td>
                    <td>{animal.brinco}</td>
                    <td>{animal.lote}</td>
                    <td>{animal.pai}</td>
                    <td>{animal.mae}</td>
                    <td className='buttons'>
                        <button className='btn btn-success me-4 btnEdit' onClick={() => this.load(animal)}><i className='fa fa-pencil'></i></button>
                        <button className='btn btn-warning btnRemove' onClick={() => this.remove(animal)}><i className='fa fa-trash'></i></button>
                    </td>

                </tr>
            )
        })
    }


    renderForm() {
        return(
                <React.Fragment>
                    <Header  icon='magnifying-glass' location='Consulta e Cadastro' subject={dataFormatada} />
                    <main className='cadastro mt-3 ms-3'>
                        
                            <div className='m-3 fs-1'>
                                Novo Animal
                                <hr />
                                <p className='fs-4 text-muted'>Digite os dados do novo animal</p>
                                <form method='POST' action=''>
                                    <div className='formsAnimalLine fs-4 m-5'>
                                        <span>
                                            <label htmlFor='nomeAnimal'>Nome</label><br />
                                            <input type='text' size='40' className='form-control' name='nomeAnimal' value={this.state.animal.nomeAnimal} onChange={e => this.updateField(e)} placeholder='Nome do seu animal...' />
                                        </span>
                                        <span>
                                            <label htmlFor='dataNascimento'>Nascimento</label><br />
                                            <input type='date' name='dataNascimento' placeholder='Data de Nascimento...' value={this.state.animal.dataNascimento} onChange={e => this.updateField(e)} className='form-control'/>
                                        </span>
                                        <span>
                                            <label htmlFor='pai'>Pai</label><br />
                                            <input type='text' size='40' name='pai' placeholder='Nome do pai...' value={this.state.animal.pai} onChange={e => this.updateField(e)} className='form-control' />
                                        </span>
                                        <span>
                                            <label htmlFor='mae'>Mãe</label><br />
                                            <input type='text' size='40' name='mae' placeholder='Nome da mãe...' value={this.state.animal.mae} onChange={e => this.updateField(e)} className='form-control' />
                                        </span>
                                        <span>
                                            <label htmlFor='peso'>Peso</label><br />
                                            <input type='number' name='pesoAnimal' placeholder='Peso... Ex: 90.50' value={this.state.animal.pesoAnimalçk} onChange={e => this.updateField(e)} className='form-control' step="0.01"/>
                                        </span>
                                        <span>
                                            <label htmlFor='brinco'>Brinco</label><br />
                                            <input type='number' name='brinco' placeholder='Número do brinco...' value={this.state.animal.brinco} onChange={e => this.updateField(e)} className='form-control' />
                                        </span>   
                                        
                                    </div>
                                    <div className='formsAnimalLine fs-4 m-5'>
                                        <span>
                                            <label htmlFor='lote'>Lote</label><br />
                                            <select className="form-select mb-3 fs-6" name='lote' value={this.state.animal.lote} onChange={e => this.updateField(e)}>
                                                <option>Selecione o lote...</option>
                                                <option value="1">Lote 01</option>
                                                <option value="2">Lote 02</option>
                                                <option value="3">Lote 03</option>
                                            </select>
                                        </span>
                                        <span>
                                            <label htmlFor='sexo'>Sexo</label><br />
                                            <select className="form-select mb-3" name='sexo' value={this.state.animal.sexo} onChange={e => this.updateField(e)}>
                                                <option value=''>Selecione o sexo...</option>
                                                <option value="macho">Macho</option>
                                                <option value="femea">Fêmea</option>
                                            </select>
                                            
                                        </span>
                                
                                        <span>
                                            <label htmlFor='raca'>Raça</label><br />
                                            <select className="form-select mb-3" name='raca' value={this.state.animal.raca} onChange={e => this.updateField(e)}>
                                                <option selected>Selecione a raça...</option>
                                                <option value="Holandes">Holandes</option>
                                                <option value="Gir">Gir</option>
                                                <option value="Girolando">Girolando</option>
                                                <option value="Jersey">Jersey</option>
                                                <option value="Jersolando">Jersolando</option>
                                                <option value="Nelore">Nelore</option>
                                                <option value="Anelorado">Anelorado</option>
                                            </select>
                                        </span>                
                                    </div>
                                    <div>
                                        <button type='button' className='btn btn-success ms-5 mg' onClick={event => this.save(event)}>Cadastrar</button>
                                        <button type='button' className='btn btn-warning ms-5 mg' onClick={event => this.clear(event)}>Limpar</button>
                                    </div>
                                </form>
                            </div>
                        
                    
                    </main>
                    
                </React.Fragment>
            );
        
    }

    render() {
        return (
            <div>
                {this.renderForm()}
                {this.renderTable()}
            </div>
        );
    }
}
