import React, { Component } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { urlBase } from '../scripts/Api';
import FormularioPadrao from './FormularioPadrao';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Select } from '../components/Select';
import Semana from './Semana';

import { isNumeric } from '../scripts/Utils';
import { showError, showConfirm } from '../scripts/Messages';
import { DateInput } from '../components/DateInput';
import { TimeInput } from '../components/TimeInput';

const ImgRounded = styled.div`
    border-radius: 5px;
    width: 100%;
    display: flex;

    img {
        border-radius: 5px;
        object-fit: cover;
        background-size: cover;
        height: auto;
        max-height: 800px;
        max-width: 800px;
        margin: auto;
    }
`;

const ImgNone = styled.div`
    object-fit: cover;
    border-radius: 5px;
    height: 100px;
    width: 100px;
    font-size: 110px;
    line-height: 0px;
    margin: auto;

    i {
        text-decoration: none;
        color: #888;
    }
`;

const titulo = 'Dashboard';
const url = '/dashboard';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comboSemanas: [],
        };

        this.getFiltro = this.getFiltro.bind(this);
        this.getTitulosDaTabela = this.getTitulosDaTabela.bind(this);
        this.getDadosDaTabela = this.getDadosDaTabela.bind(this);
        this.renderizarFormulario = this.renderizarFormulario.bind(this);
        this.getObjetoDeDados = this.getObjetoDeDados.bind(this);
        this.carregarCombos = this.carregarCombos.bind(this);
        this.antesDeInserir = this.antesDeInserir.bind(this);
        this.antesDeEditar = this.antesDeEditar.bind(this);
        this.antesDeSalvar = this.antesDeSalvar.bind(this);
        this.antesDeExcluir = this.antesDeExcluir.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.onExcluirImagemClick = this.onExcluirImagemClick.bind(this);
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
            { titulo: 'Título', width: '50%', orderby: 'titulo' },
            { titulo: 'Semana', width: '50%', orderby: 'semana' },
        ];
    }

    getDadosDaTabela(item) {
        return [item.id, item.titulo, item.semana.nome];
    }

    onImageChange(event, sender) {
        var self = sender;
        var tg = event.target;
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            var fileReader = new FileReader();
            fileReader.addEventListener(
                'load',
                function () {
                    var input = {
                        tipo: file.type,
                        base64: fileReader.result,
                    };

                    self.props.api.post('/arquivo', input).then((result) => {
                        self.state.itemSelecionado.imagem = {
                            id: result.id,
                            nome: result.nome,
                        };
                        self.setState({ itemSelecionado: self.state.itemSelecionado });
                        tg.value = null;
                    });
                },
                false
            );
            fileReader.readAsDataURL(file);
        }
    }

    onExcluirImagemClick(event, sender) {
        var self = sender;
        var tg = event.target;
        showConfirm('Deseja realmente excluir a imagem?', () => {
            self.state.itemSelecionado.imagem = {};
            self.setState({ itemSelecionado: self.state.itemSelecionado });
            tg.value = null;
        });
    }

    antesDeInserir() {
        return this.carregarCombos();
    }

    antesDeEditar() {
        return this.carregarCombos();
    }

    antesDeSalvar() {}

    antesDeExcluir() {}

    carregarCombos() {
        return new Promise((resolve) => {
            this.props.api.getAll(url + '/combos-para-cadastro')
            .then((result) => {                
                this.setState({ comboSemanas: result.semanas }, () => resolve());
            });
        });
    }

    getObjetoDeDados(sender) {
        return new Promise(function (resolve, reject) {
            let item = sender.state.itemSelecionado;

            if (!item.semana) {
                showError('Selecione a semana.');
                reject();
                return;
            }

            if (!item.titulo) {
                showError('Informe o título.');
                reject();
                return;
            }

            if (!(item.imagem && item.imagem.id)) {
                showError('Escolha uma imagem.');
                reject();
                return;
            }

            var input = {
                titulo: item.titulo,
                detalhes: item.detalhes,
                imagem: item.imagem && item.imagem.id ? item.imagem : null,
                semana: item.semana,
                situacao: item.situacao && item.situacao.id ? parseInt(item.situacao.id) : null,
                dataParaPublicacao: item.dataParaPublicacao,
                horaParaPublicacao: item.horaParaPublicacao,
                dataParaArquivamento: item.dataParaArquivamento,
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
                            <Form.Label>Semana</Form.Label>
                            {this.state.comboSemanas && this.state.comboSemanas.length > 0 && (
                                <Select
                                    defaultValue={
                                        sender.state.itemSelecionado.semana ? sender.state.itemSelecionado.semana.id : 0
                                    }
                                    options={this.state.comboSemanas}
                                    getDescription={(i) => i.nome}
                                    getKeyValue={(i) => i.id}
                                    onSelect={(i) => {
                                        sender.state.itemSelecionado.semana = i;
                                        sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                    }}
                                    asws={true}
                                    formularioPadrao={(select) => <Semana api={this.props.api} select={select} />}
                                    updateOptions={(options) => this.setState({ comboSemanas: options })}
                                />
                            )}
                        </Form.Group>
                    </Col>

                    <Col sm={3} md={3} lg={3}>
                        <Form.Group>
                            <Form.Label>Situação</Form.Label>
                            <Form.Control
                                as='select'
                                name='situacao'
                                defaultValue={sender.state.itemSelecionado.situacao.id}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.situacao.id = e.target.value;
                                    sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                }}
                            >
                                <option value='0'>Não definido</option>
                                <option value='1'>Ativa</option>
                                <option value='2'>Inativa</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group>
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                        type='text'
                        defaultValue={sender.state.itemSelecionado.titulo}
                        onChange={(e) => {
                            sender.state.itemSelecionado.titulo = e.target.value;
                        }}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Detalhes</Form.Label>
                    <Form.Control
                        type='text'
                        as='textarea'
                        rows='3'
                        defaultValue={sender.state.itemSelecionado.detalhes}
                        onChange={(e) => {
                            sender.state.itemSelecionado.detalhes = e.target.value;
                        }}
                    />
                </Form.Group>

                <Row>
                    <Col sm={3} md={3} lg={3}>
                        <Form.Group>
                            <Form.Label>Data de publicação</Form.Label>
                            <DateInput
                                defaultValue={sender.state.itemSelecionado.dataParaPublicacao}
                                onChange={(value) => {
                                    sender.state.itemSelecionado.dataParaPublicacao = value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3} md={3} lg={3}>
                        <Form.Group>
                            <Form.Label>Hora de publicação</Form.Label>
                            <TimeInput
                                defaultValue={sender.state.itemSelecionado.horaParaPublicacao}
                                onChange={(value) => {
                                    sender.state.itemSelecionado.horaParaPublicacao = value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3} md={3} lg={3}>
                        <Form.Group>
                            <Form.Label>Data de arquivamento</Form.Label>
                            <DateInput
                                defaultValue={sender.state.itemSelecionado.dataParaArquivamento}
                                onChange={(value) => {
                                    sender.state.itemSelecionado.dataParaArquivamento = value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Label
                            style={{ cursor: 'pointer', display: 'block' }}
                            title={
                                sender.state.itemSelecionado.imagem && sender.state.itemSelecionado.imagem.nome
                                    ? 'alterar imagem'
                                    : 'carregar imagem'
                            }
                        >
                            <Form.File
                                accept={'image/png, image/jpeg'}
                                onChange={(e) => this.onImageChange(e, sender)}
                                style={{ position: 'absolute', top: -1000 }}
                            ></Form.File>
                            {sender.state.itemSelecionado.imagem && sender.state.itemSelecionado.imagem.nome ? (
                                <ImgRounded>
                                    <img
                                        alt=''
                                        src={urlBase + '/arquivo/' + sender.state.itemSelecionado.imagem.nome}
                                    />
                                </ImgRounded>
                            ) : (
                                <ImgNone>
                                    <FontAwesomeIcon icon={faImage} />
                                </ImgNone>
                            )}
                        </Form.Label>
                        {sender.state.itemSelecionado.imagem && sender.state.itemSelecionado.imagem.nome && (
                            <div
                                onClick={(e) => this.onExcluirImagemClick(e, sender)}
                                style={{
                                    textDecoration: 'none',
                                    color: 'initial',
                                    position: 'absolute',
                                    right: '20px',
                                    top: '8px',
                                    fontSize: 30,
                                    cursor: 'pointer',
                                }}
                                title='excluir imagem'
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </div>
                        )}
                    </Col>
                </Row>
                <br></br>
            </React.Fragment>
        );
    }

    render() {
        return (
            <FormularioPadrao
                titulo={titulo}
                url={url}
                api={this.props.api}
                ordenacaoPadrao={'titulo'}
                permissoes={[4000, 4001, 4002, true]}
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
                itemVazio={{ situacao: { id: '1' } }}
            />
        );
    }
}
