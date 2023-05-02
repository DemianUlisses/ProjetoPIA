import { Row, Col, Form, FormGroup } from 'react-bootstrap';
import React, { Component } from 'react';
import { urlBase } from '../scripts/Api';
import FormularioPadrao from './FormularioPadrao';
import styled from 'styled-components';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateInput } from '../components/DateInput';
import { isNumeric } from '../scripts/Utils';
import { Select } from '../components/Select';
import { showConfirm, showError, showInfo } from '../scripts/Messages';

const ImgRounded = styled.div`
    border-radius: 50%;
    height: 100px;
    width: 100px;
    background-position-x: center;
    background-size: cover;
    background-image: url(${(props) => props.url});
`;

const ImgNone = styled.div`
    object-fit: cover;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    font-size: 110px;
    line-height: 0px;

    i {
        text-decoration: none;
        color: #888;
    }
`;

const titulo = 'Ligas';
const url = '/liga';

export default class Liga extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nomeParaNaoConsultar: null,
        };

        this.renderizarFormulario = this.renderizarFormulario.bind(this);
        this.getObjetoDeDados = this.getObjetoDeDados.bind(this);

        this.antesDeInserir = this.antesDeInserir.bind(this);
        this.antesDeEditar = this.antesDeEditar.bind(this);
        this.aposInserir = this.aposInserir.bind(this);
        this.verificarSeJaExiste = this.verificarSeJaExiste.bind(this);

        this.onImageChange = this.onImageChange.bind(this);
        this.onExcluirFotoClick = this.onExcluirFotoClick.bind(this);
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
        if (this.props.filtroAdicional) {
            query += this.props.filtroAdicional;
        }
        return query;
    }

    getTitulosDaTabela() {
        return [
            { titulo: 'Código', orderby: 'id', className: 'codigo' },
            { titulo: 'Nome', width: '30%', orderby: 'nome' },
            { titulo: 'Descrição', width: '70%', orderby: 'descricao' },
        ];
    }

    getDadosDaTabela(item) {
        return [item.id, item.nome, item.descricao];
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
                        self.state.itemSelecionado.foto = {
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

    onExcluirFotoClick(event, sender) {
        var self = sender;
        var tg = event.target;
        showConfirm('Deseja realmente excluir a foto?', () => {
            self.state.itemSelecionado.foto = {};
            self.setState({ itemSelecionado: self.state.itemSelecionado });
            tg.value = null;
        });
    }

    aposInserir(sender) {
        sender.state.itemSelecionado.dataDeCadastro = new Date();
        sender.state.itemSelecionado.situacao = { id: 1 };
        sender.state.itemSelecionado.tipoDeLiga = { id: 1 };
        sender.setState({ itemSelecionado: sender.state.itemSelecionado });
    }

    antesDeInserir() {
        return new Promise((resolve) => {
            this.setState({ nomeParaNaoConsultar: null }, resolve);
        });
    }

    antesDeEditar(item) {
        return new Promise((resolve) => {
            this.setState({ nomeParaNaoConsultar: item.nome }, resolve);
        });
    }

    verificarSeJaExiste(sender) {
        return new Promise((resolve, reject) => {
            let item = sender.state.itemSelecionado;
            if (item && item.nome && item.nome !== this.state.nomeParaNaoConsultar) {
                this.props.api
                    .getAll(url + "?$filter=Nome eq '" + item.nome + "'" + (item.id ? ' and Id ne ' + item.id : ''))
                    .then((result) => {
                        if (result && result.length > 0) {
                            let mensagem = 'Já existe uma liga cadastrada com esse nome.';
                            showInfo(mensagem).then(() => reject());
                        } else {
                            this.setState({ nomeParaNaoConsultar: item.nome }, () => resolve());
                        }
                    });
            } else {
                resolve();
            }
        });
    }

    getObjetoDeDados(sender) {
        return new Promise((resolve, reject) => {
            let item = sender.state.itemSelecionado;

            if (!item.nome) {
                showError('Informe o nome da liga.');
                reject();
                return;
            }

            var reg = new RegExp('^([0-9]|[a-z]|[.])+$');
            if (!reg.test(item.nome)) {
                showError('O nome da liga deve ter apenas letras minúsculas, números ou pontos.');
                reject();
                return;
            }

            reg = new RegExp('^([a-z])');
            if (!reg.test(item.nome)) {
                showError('O nome da liga deve começar com uma letra.');
                reject();
                return;
            }


            if (!item.descricao) {
                showError('Informe a descrição da liga.');
                reject();
                return;
            }

            if (!item.foto || (item.foto && !item.foto.id)) {
                showError('Selecione uma imagem para a liga.');
                reject();
                return;
            }

            var input = {
                nome: item.nome,
                descricao: item.descricao,
                tipoDeLiga: item.tipoDeLiga ? item.tipoDeLiga.id : null,
                situacao: item.situacao ? item.situacao.id : null,
                foto: item.foto,
                dataDeCadastro: item.dataDeCadastro,
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
                    <Col>
                        <Row>
                            <Col sm={2} xs={2} md={2}>
                                <Form.Group>
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control type='text' readOnly defaultValue={sender.state.itemSelecionado.id} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Form.Label>Situação</Form.Label>
                                    <Select
                                        defaultValue={
                                            sender.state.itemSelecionado.situacao
                                                ? sender.state.itemSelecionado.situacao.id
                                                : 0
                                        }
                                        options={[
                                            { id: 1, descricao: 'Ativa' },
                                            { id: 2, descricao: 'Inativa' },
                                        ]}
                                        getDescription={(i) => i.descricao}
                                        getKeyValue={(i) => i.id}
                                        onSelect={(i) => {
                                            sender.state.itemSelecionado.situacao = i;
                                            sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                        }}
                                        nullText={''}
                                    />
                                </FormGroup>
                            </Col>

                            <Col sm={3} xs={3} md={3}>
                                <Form.Group>
                                    <Form.Label>Data de cadastro</Form.Label>
                                    <DateInput
                                        defaultValue={
                                            sender.state.itemSelecionado.dataDeCadastro
                                                ? sender.state.itemSelecionado.dataDeCadastro
                                                : new Date()
                                        }
                                        onChange={(value) => {
                                            sender.state.itemSelecionado.dataDeCadastro = value;
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>

                    <Col style={{ textAlign: 'right', maxWidth: 150, marginLeft: -20 }}>
                        <Form.Label
                            style={{ cursor: 'pointer' }}
                            title={
                                sender.state.itemSelecionado.foto && sender.state.itemSelecionado.foto.nome
                                    ? 'alterar foto'
                                    : 'carregar foto'
                            }
                        >
                            <Form.File
                                accept={'image/png, image/jpeg'}
                                onChange={(e) => this.onImageChange(e, sender)}
                                style={{ position: 'absolute', top: -1000 }}
                                tabIndex={-1}
                            ></Form.File>
                            {sender.state.itemSelecionado.foto && sender.state.itemSelecionado.foto.nome ? (
                                <ImgRounded
                                    alt=''
                                    url={() => urlBase + '/arquivo/' + sender.state.itemSelecionado.foto.nome}
                                ></ImgRounded>
                            ) : (
                                <ImgNone alt=''>
                                    <FontAwesomeIcon icon={faUserCircle} />
                                </ImgNone>
                            )}
                        </Form.Label>
                        {sender.state.itemSelecionado.foto && sender.state.itemSelecionado.foto.nome && (
                            <div
                                style={{
                                    color: 'initial',
                                    position: 'absolute',
                                    right: 20,
                                    top: 95,
                                    fontSize: 20,
                                    cursor: 'pointer',
                                }}
                                title='excluir foto'
                                onClick={(e) => this.onExcluirFotoClick(e, sender)}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </div>
                        )}
                    </Col>
                </Row>

                <Row>
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
                    <Col md={3} lg={3} xl={3}>
                        <Form.Group>
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={
                                    sender.state.itemSelecionado.tipoDeLiga
                                        ? sender.state.itemSelecionado.tipoDeLiga.descricao
                                        : null
                                }
                                readOnly={true}
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
            </React.Fragment>
        );
    }

    render() {
        return (
            <FormularioPadrao
                titulo={titulo}
                url={url}
                ordenacaoPadrao={'nome'}
                permissoes={[2910, 2911, 2912, 2913]}
                getFiltro={this.getFiltro}
                getTitulosDaTabela={this.getTitulosDaTabela}
                getDadosDaTabela={this.getDadosDaTabela}
                renderizarFormulario={this.renderizarFormulario}
                getObjetoDeDados={this.getObjetoDeDados}
                antesDeInserir={this.antesDeInserir}
                antesDeEditar={this.antesDeEditar}
                antesDeSalvar={this.antesDeSalvar}
                antesDeExcluir={this.antesDeExcluir}
                aposInserir={this.aposInserir}
                {...this.props}
                itemVazio={{
                    foto: {},
                }}
            />
        );
    }
}
