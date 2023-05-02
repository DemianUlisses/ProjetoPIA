import React, { Component } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { showError } from '../scripts/Messages';
import FormularioPadrao from './FormularioPadrao';
import { DateInput } from '../components/DateInput';
import { TimeInput } from '../components/TimeInput';
import { IntegerInput } from '../components/IntegerInput';
import { isNumeric, dateToString } from '../scripts/Utils';

const titulo = 'Semanas';
const url = '/semana';

export default class Semana extends Component {
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
            { titulo: 'Número', width: '10%', orderby: 'Numero' },
            { titulo: 'Nome', width: '50%', orderby: 'Nome' },
            { titulo: 'Data inicial', width: '20%', orderby: 'DataIncialDaApuracao' },
            { titulo: 'Data final', width: '20%', orderby: 'DataFinalDaApuracao' },
        ];
    }

    getDadosDaTabela(item) {
        return [
            item.id,
            item.numero,
            item.nome,
            dateToString(item.dataIncialDaApuracao),
            dateToString(item.dataFinalDaApuracao),
        ];
    }

    getObjetoDeDados(sender) {
        return new Promise((resolve, reject) => {
            let item = sender.state.itemSelecionado;

            var input = {
                numero: item.numero,
                nome: item.nome,
                ano: item.ano ? parseInt(item.ano) : null,
                descricao: item.descricao,
                dataIncialDaApuracao: item.dataIncialDaApuracao,
                dataFinalDaApuracao: item.dataFinalDaApuracao,
                dataDeAberturaDosJogos: item.dataDeAberturaDosJogos,
                horaDeAberturaDosJogos: item.horaDeAberturaDosJogos,
                dataDeFechamentoDosJogos: item.dataDeFechamentoDosJogos,
                horaDeFechamentoDosJogos: item.horaDeFechamentoDosJogos,
            };

            if (sender.state.alterando) {
                input.id = parseInt(item.id);
            }
            resolve(input);
        });
    }

    renderizarFormulario(sender) {
        return (
            <div style={{minHeight: 600}}>
                <Row>
                    <Col sm={2} md={2} lg={2}>
                        <Form.Group>
                            <Form.Label>Código</Form.Label>
                            <Form.Control type='text' readOnly defaultValue={sender.state.itemSelecionado.id} />
                        </Form.Group>
                    </Col>
                    <Col md={2} lg={2} xl={2}>
                        <Form.Group>
                            <Form.Label>Ano</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.ano}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.ano = e.target.value;
                                }}
                                thousandSeparator={''}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2} lg={2} xl={2}>
                        <Form.Group>
                            <Form.Label>Número</Form.Label>
                            <IntegerInput
                                type='text'
                                defaultValue={sender.state.itemSelecionado.numero}
                                onChange={(value) => {
                                    sender.state.itemSelecionado.numero = value.floatValue;
                                }}
                            />
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
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.descricao}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.descricao = e.target.value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} md={6} lg={6}>
                        <Form.Group>
                            <Form.Label>Data de início da apuração</Form.Label>
                            <DateInput
                                defaultValue={sender.state.itemSelecionado.dataIncialDaApuracao}
                                onChange={(value) => {
                                    sender.state.itemSelecionado.dataIncialDaApuracao = value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6} md={6} lg={6}>
                        <Form.Group>
                            <Form.Label>Data de final da apuração</Form.Label>
                            <DateInput
                                defaultValue={sender.state.itemSelecionado.dataFinalDaApuracao}
                                onChange={(value) => {
                                    sender.state.itemSelecionado.dataFinalDaApuracao = value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} md={6} lg={6}>
                        <Form.Group>
                            <Form.Label>Data de abertura dos jogos</Form.Label>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <DateInput
                                    defaultValue={sender.state.itemSelecionado.dataDeAberturaDosJogos}
                                    onChange={(value) => {
                                        sender.state.itemSelecionado.dataDeAberturaDosJogos = value;
                                    }}
                                />
                                <TimeInput
                                    defaultValue={sender.state.itemSelecionado.horaDeAberturaDosJogos}
                                    onChange={(value) => {
                                        sender.state.itemSelecionado.horaDeAberturaDosJogos = value;
                                    }}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col sm={6} md={6} lg={6}>
                        <Form.Group>
                            <Form.Label>Data de fechamento dos jogos</Form.Label>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <DateInput
                                    defaultValue={sender.state.itemSelecionado.dataDeFechamentoDosJogos}
                                    onChange={(value) => {
                                        sender.state.itemSelecionado.dataDeFechamentoDosJogos = value;
                                    }}
                                />
                                <TimeInput
                                    defaultValue={sender.state.itemSelecionado.horaDeFechamentoDosJogos}
                                    onChange={(value) => {
                                        sender.state.itemSelecionado.horaDeFechamentoDosJogos = value;
                                    }}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            </div>
        );
    }

    render() {
        return (
            <FormularioPadrao
                titulo={titulo}
                url={url}
                api={this.props.api}
                ordenacaoPadrao={'numero'}
                permissoes={[2113, 2113, 2113, 2113]}
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
                itemVazio={{
                    ano: (new Date()).getFullYear()
                }}
            />
        );
    }
}
