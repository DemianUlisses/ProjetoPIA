import React, { Component } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { showError } from '../scripts/Messages';
import FormularioPadrao from './FormularioPadrao';
import { isNumeric } from '../scripts/Utils';

const titulo = 'Bancos';
const url = '/banco';

export default class Banco extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.getFiltro = this.getFiltro.bind(this);
        this.getTitulosDaTabela = this.getTitulosDaTabela.bind(this);
        this.getDadosDaTabela = this.getDadosDaTabela.bind(this);
        this.renderizarFormulario = this.renderizarFormulario.bind(this);
        this.getObjetoDeDados = this.getObjetoDeDados.bind(this);
        this.carregarCombos = this.carregarCombos.bind(this);
        this.antesDeInserir = this.antesDeInserir.bind(this);
        this.antesDeEditar = this.antesDeEditar.bind(this);
    }

    antesDeInserir() {
        return this.carregarCombos();
    }

    antesDeEditar() {
        return this.carregarCombos();
    }

    carregarCombos() {
        return new Promise((resolve) => {
            resolve();
        });
    }

    getFiltro(filtro) {
        var query = '';
        if (filtro && filtro.texto) {
            let texto = filtro.texto.toString();
            if (texto[0] === '#') {
                if (!isNumeric(texto.substring(1))) {
                    showError('Código inválido: "' + texto.substring(1) + '"');
                    return null;
                }
                query = '?$filter=id eq ' + texto.substring(1);
            } else {
                query = "?$filter=contains(Searchable,'" + texto + "')";
            }
            query += '&';
        } else {
            query = '?';
        }
        return query;
    }

    getTitulosDaTabela() {
        return [
            { titulo: 'Código', orderby: 'id', className: 'codigo' },
            { titulo: 'Nome', width: '80%', orderby: 'nome' },
            { titulo: 'Número', width: '20%', orderby: 'numero' },
        ];
    }

    getDadosDaTabela(item) {
        return [item.id, item.nome, item.numero];
    }

    getObjetoDeDados(sender) {
        return new Promise((resolve, reject) => {
            let item = sender.state.itemSelecionado;
            if (!item.nome) {
                showError('Informe o nome do banco.');
                reject();
                return;
            }

            if (!item.numero) {
                showError('Informe o numero do banco.');
                reject();
                return;
            }

            var input = {
                nome: item.nome,
                numero: item.numero,
            };

            if (sender.state.alterando) {
                input.id = parseInt(item.id);
            }
            resolve(input);
        });
    }

    renderizarFormulario(sender) {
        return (
            <React.Fragment>
                <Row>
                    <Col sm={2} md={2} lg={2}>
                        <Form.Group>
                            <Form.Label>Código</Form.Label>
                            <Form.Control type='text' readOnly defaultValue={sender.state.itemSelecionado.id} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.nome}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.nome = e.target.value;
                                }}
                                onInput={(e) => (e.target.value = ('' + e.target.value).toUpperCase())}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={2} md={2} lg={2}>
                        <Form.Group>
                            <Form.Label>Número</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.numero}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.numero = e.target.value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    render() {
        return (
            <FormularioPadrao
                titulo={titulo}
                url={url}
                api={this.props.api}
                ordenacaoPadrao={'nome'}
                permissoes={[2710, 2711, 2712, 2713]}
                getFiltro={this.getFiltro}
                getTitulosDaTabela={this.getTitulosDaTabela}
                getDadosDaTabela={this.getDadosDaTabela}
                renderizarFormulario={this.renderizarFormulario}
                getObjetoDeDados={this.getObjetoDeDados}
                antesDeInserir={this.antesDeInserir}
                antesDeEditar={this.antesDeEditar}
                antesDeSalvar={this.antesDeSalvar}
                antesDeExcluir={this.antesDeExcluir}
                select={this.props.select}
                itemVazio={{}}
            />
        );
    }
}
