import React, { Component, Fragment } from 'react';
import Header from '../templates/Header';
import { dataFormatada } from '../nav/Home';
import './Relatorios.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const bdUrl = 'http://localhost:3005/animal';

export default class Relatorios extends Component {

    state = {
        animal: { nomeAnimal: '', dataNascimento: '', sexo: '', pesoAnimal: 0.0, raca: '', brinco: 0, lote: '', pai: '', mae: '' },
        list: [],
        originalList: [],
        filters: { dataNascimento: '', pai: '', mae: '', brinco: '', lote: '', sexo: '', raca: '' },
        paiOptions: [],
        maeOptions: []
    };

    componentDidMount() {
        axios(bdUrl)
            .then(resposta => {
                const list = resposta.data;
                const paiOptions = [...new Set(list.map(animal => animal.pai))].filter(pai => pai);
                const maeOptions = [...new Set(list.map(animal => animal.mae))].filter(mae => mae);

                this.setState({ 
                    list, 
                    originalList: list, 
                    paiOptions, 
                    maeOptions 
                });
            })
            .catch(error => console.error("Erro ao carregar os dados dos animais cadastrados", error));
    }

    handleFilterChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            filters: { ...this.state.filters, [name]: value }
        });
    };

    applyFilters = () => {
        const { originalList, filters } = this.state;

        const filteredList = originalList.filter(animal => {
            return (
                (!filters.dataNascimento || 
                    new Date(animal.dataNascimento).getFullYear().toString() === filters.dataNascimento) &&
                (!filters.pai || animal.pai === filters.pai) &&
                (!filters.mae || animal.mae === filters.mae) &&
                (!filters.brinco || animal.brinco === parseInt(filters.brinco)) &&
                (!filters.lote || animal.lote === filters.lote) &&
                (!filters.sexo || animal.sexo === filters.sexo) &&
                (!filters.raca || animal.raca === filters.raca)
            );
        });
    
        this.setState({ list: filteredList });
    };

    handleFilterClick = (event) => {
        event.preventDefault();
        this.applyFilters();
    };

    clearFilters = () => {
        this.setState(
            {
                filters: {
                    dataNascimento: '',
                    pai: '',
                    mae: '',
                    brinco: '',
                    lote: '',
                    sexo: '',
                    raca: ''
                }
            },
            this.applyFilters // Chama o método de filtrar após atualizar os filtros
        );
    };

    renderFilter() {
        return (
            <div className='mt-3 me-3 reportAnimals'>
                <div className='d-flex justify-content-center fs-4 bg-dark reportTitle lh-1'>
                    <p className='mt-3 fontTitle'>Aplicação de filtros</p>
                </div>
                <div className='reportFilterForm fs-4'>
                    <form className='ms-4'>
                        <span>
                            <label htmlFor='dataNascimento'>Ano de Nascimento</label><br />
                            <select className="form-select mb-3 fs-6" value={this.state.filters.dataNascimento} name='dataNascimento' onChange={this.handleFilterChange}>
                                <option>Selecione o ano...</option>
                                {[...Array(26)].map((_, i) => (
                                    <option key={i} value={2025 - i}>{2025 - i}</option>
                                ))}
                            </select>
                        </span>

                        <span>
                            <label htmlFor='pai'>Pai</label><br />
                            <select className="form-select mb-3 fs-6" value={this.state.filters.pai} name='pai' onChange={this.handleFilterChange}>
                                <option value="">Selecione o pai...</option>
                                {this.state.paiOptions.map((pai, index) => (
                                    <option key={index} value={pai}>{pai}</option>
                                ))}
                            </select>
                        </span>
                        
                        <span>
                            <label htmlFor='mae'>Mãe</label><br />
                            <select className="form-select mb-3 fs-6" value={this.state.filters.mae} name='mae' onChange={this.handleFilterChange}>
                                <option value="">Selecione a mãe...</option>
                                {this.state.maeOptions.map((mae, index) => (
                                    <option key={index} value={mae}>{mae}</option>
                                ))}
                            </select>
                        </span>
                        <span>
                            <label htmlFor='lote'>Lote</label><br />
                            <select className="form-select mb-3 fs-6" value={this.state.filters.lote} name='lote' onChange={this.handleFilterChange}>
                                <option value="">Selecione o lote...</option>
                                <option value="1">Lote 01</option>
                                <option value="2">Lote 02</option>
                                <option value="3">Lote 03</option>
                            </select>
                        </span>

                        <span>
                            <label htmlFor='sexo'>Sexo</label><br />
                            <select className="form-select mb-3 fs-6" value={this.state.filters.sexo} name='sexo' onChange={this.handleFilterChange}>
                                <option value="">Selecione o sexo...</option>
                                <option value="macho">Macho</option>
                                <option value="femea">Fêmea</option>
                            </select>
                        </span>

                        <span>
                            <label htmlFor='raca'>Raça</label><br />
                            <select className="form-select mb-3 fs-6" value={this.state.filters.raca} name='raca' onChange={this.handleFilterChange}>
                                <option value="">Selecione a raça...</option>
                                <option value="Holandes">Holandês</option>
                                <option value="Gir">Gir</option>
                                <option value="Girolando">Girolando</option>
                                <option value="Jersey">Jersey</option>
                                <option value="Jersolando">Jersolando</option>
                                <option value="Nelore">Nelore</option>
                                <option value="Anelorado">Anelorado</option>
                            </select>
                        </span>
                    </form>
                    <div className='d-flex justify-content-end me-5 mt-0'>
                        <button 
                            className='btn btn-success lh-1 fs-6 mb-4' 
                            onClick={this.handleFilterClick}>
                            <i className="fa-solid fa-filter"></i> Filtrar
                        </button>
                        <button 
                            className='btn btn-warning lh-1 fs-6 mb-4 ms-3' onClick={this.clearFilters}>
                            <i class="fa-solid fa-shower"></i> Limpar
                        </button>


                    </div>
                    </div>
                {this.renderReport()}
            </div>
        );
    }

    renderPage() {
        return (
            <div>
                <Header icon='clipboard' location='Relatórios' subject={dataFormatada} />
                <main className='m-3'>
                    <div className='divRelatorios'>
                        <div className='m-3 fs-1'>
                            Geração de Relatórios
                            <hr />
                            <p className='fs-4 text-muted'>Consulte seu rebanho, através da construção de relatórios gerenciais.</p>
                        </div>
                    </div>
                    {this.renderFilter()}
                </main>
            </div>
        );
    }

    renderReport() {
        return (
            <div className='d-flex flex-column mt-3 containerReport mb-5'>
                <p className='reportHeaderTitle fs-5 lh-base p-1'>Relatório de Animais - {dataFormatada}</p>

                <div className='reportTable'>
                    {this.renderTable()}
                </div>
                <div className='d-flex justify-content-start mt-4 buttonExport'>
                    <button className='btn btn-success lh-1 fs-6 exportReport' name='exportarRelatorio' onClick={this.exportReportToPDF}>
                        <i className="fa-solid fa-print"></i> Exportar
                    </button>
                </div>
            </div>
            
        );
    }

    renderTable(){
        return(
            <div className='table'>
                <table className='table table-striped mt-3 reportTable'>
                <thead className='table-dark text-center lh-1'>
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
                    </tr>
                </thead>
                <tbody>
                    {this.renderRow()}
                </tbody>
            </table>
            </div>
        )
    }

    renderRow(){
        return this.state.list.map(animal => {
            //ajusta o formado da data de nascimento do animal
            const dataNascimentoFormatada = new Date(animal.dataNascimento).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });   

            return(
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
                </tr>
            )
        })
    }

    //Criação e exportação de relatório
    exportReportToPDF = () => {
        const doc = new jsPDF();
    
        // Título do relatório
        const title = `Relatório de Animais - ${dataFormatada}`;
        doc.setFontSize(16);
        doc.text(title, 10, 10);
    
        // Configurar a tabela
        const tableColumn = [
            "Id", "Nome", "Nascimento", "Sexo", "Peso", 
            "Raça", "Brinco", "Lote", "Pai", "Mãe"
        ];
        const tableRows = [];
    
        // Adiciona os dados à tabela
        this.state.list.forEach(animal => {
            const dataNascimentoFormatada = new Date(animal.dataNascimento).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
    
            const animalData = [
                animal.id,
                animal.nomeAnimal,
                dataNascimentoFormatada,
                animal.sexo,
                animal.pesoAnimal,
                animal.raca,
                animal.brinco,
                animal.lote,
                animal.pai,
                animal.mae
            ];
            tableRows.push(animalData);
        });
    
        // Gera a tabela
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });
    
        // Salva o PDF
        doc.save('relatorio_animais.pdf');
    };
    

    render(){
        return(
            <React.Fragment>
                {this.renderPage()}             
            </React.Fragment>
        )

    }

}