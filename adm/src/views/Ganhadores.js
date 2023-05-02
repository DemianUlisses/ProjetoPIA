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
import Jogador from './Jogador';

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

const titulo = 'Ganhadores';
const url = '/ganhadores';

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
            { titulo: 'Semana', width: '100%', orderby: 'Semana/Nome' },
        ];
    }

    getDadosDaTabela(item) {
        return [item.id, item.semana.nome];
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
            this.props.api.getAll(url + '/combos-para-cadastro').then((result) => {
                this.setState({ comboSemanas: result.semanas }, () => resolve());
            });
        });
    }

    getObjetoDeDados(sender) {
        return new Promise(function (resolve, reject) {
            let item = sender.state.itemSelecionado;

            if (!item.ganhador1) {
                showError('Selecione o primeiro lugar.');
                reject();
                return;
            }

            if (!item.ganhador2) {
                showError('Selecione o segundo lugar.');
                reject();
                return;
            }

            if (!item.ganhador3) {
                showError('Selecione o terceiro lugar.');
                reject();
                return;
            }

            // if (!item.ganhador4) {
            //     showError('Selecione o quarto lugar.');
            //     reject();
            //     return;
            // }

            // if (!item.ganhador5) {
            //     showError('Selecione o quinto lugar.');
            //     reject();
            //     return;
            // }

            if (!item.ultimo) {
                showError('Selecione o ultimo lugar.');
                reject();
                return;
            }

            if (!item.semana) {
                showError('Selecione a semana.');
                reject();
                return;
            }

            if (!(item.imagem && item.imagem.id)) {
                showError('Escolha uma imagem.');
                reject();
                return;
            }

            var input = {
                imagem: item.imagem,
                semana: item.semana,
                ganhador1: item.ganhador1,
                ganhador2: item.ganhador2,
                ganhador3: item.ganhador3,
                // ganhador4: item.ganhador4,
                // ganhador5: item.ganhador5,
                ultimo: item.ultimo,
                titulo: item.titulo,
                detalhes: item.detalhes,
            };

            showConfirm("Confirma a inclusão dos ganhadores? \n\n" + 
                '1º - ' + item.ganhador1.nomeCompleto + '\n' +
                '2º - ' + item.ganhador2.nomeCompleto + '\n' +
                '3º - ' + item.ganhador3.nomeCompleto + '\n' +
                // '4º - ' + item.ganhador4.nomeCompleto + '\n' +
                // '5º - ' + item.ganhador5.nomeCompleto + '\n' +
                'Último - ' + item.ultimo.nomeCompleto + '\n\n' +
                "ATENÇÃO: Um e-mail de notificação será enviado. Deseja salvar a solicitação?", 
                () => {
                    if (sender.state.alterando) {
                        input.id = parseInt(item.id);
                    }
                    resolve(input);
                }, () => {
                    reject();
                    return;
                }, 
                "ENVIAR", "CANCELAR");
        });
    }

    getFiltroAdicional(exceto, itemSelecionado) {
        var filtro = '$filter=1 eq 1';

        if (itemSelecionado.ganhador1 && (!exceto || (exceto && exceto.id !== itemSelecionado.ganhador1.id))) {
            filtro += ' and id ne ' + itemSelecionado.ganhador1.id;
        }

        if (itemSelecionado.ganhador2 && (!exceto || (exceto && exceto.id !== itemSelecionado.ganhador2.id))) {
            filtro += ' and id ne ' + itemSelecionado.ganhador2.id;
        }

        if (itemSelecionado.ganhador3 && (!exceto || (exceto && exceto.id !== itemSelecionado.ganhador3.id))) {
            filtro += ' and id ne ' + itemSelecionado.ganhador3.id;
        }

        // if (itemSelecionado.ganhador4 && (!exceto || (exceto && exceto.id !== itemSelecionado.ganhador4.id))) {
        //     filtro += ' and id ne ' + itemSelecionado.ganhador4.id;
        // }

        // if (itemSelecionado.ganhador5 && (!exceto || (exceto && exceto.id !== itemSelecionado.ganhador5.id))) {
        //     filtro += ' and id ne ' + itemSelecionado.ganhador5.id;
        // }

        if (itemSelecionado.ultimo && (!exceto || (exceto && exceto.id !== itemSelecionado.ultimo.id))) {
            filtro += ' and id ne ' + itemSelecionado.ultimo.id;
        }

        return filtro;
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
                                    disabled={
                                        sender.state.itemSelecionado.ganhador1 ||
                                        sender.state.itemSelecionado.ganhador2 ||
                                        sender.state.itemSelecionado.ganhador3 ||
                                        // sender.state.itemSelecionado.ganhador4 ||
                                        // sender.state.itemSelecionado.ganhador5 ||
                                        sender.state.itemSelecionado.ultimo
                                    }
                                    readOnly={
                                        sender.state.itemSelecionado.ganhador1 ||
                                        sender.state.itemSelecionado.ganhador2 ||
                                        sender.state.itemSelecionado.ganhador3 ||
                                        // sender.state.itemSelecionado.ganhador4 ||
                                        // sender.state.itemSelecionado.ganhador5 ||
                                        sender.state.itemSelecionado.ultimo
                                    }
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {sender.state.itemSelecionado.semana && (
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>1º Lugar</Form.Label>
                                <Select
                                    placeholder=''
                                    name='ganhador1'
                                    defaultValue={
                                        sender.state.itemSelecionado.ganhador1
                                            ? sender.state.itemSelecionado.ganhador1
                                            : null
                                    }
                                    getDescription={(i) => i.nomeCompleto}
                                    getKeyValue={(i) => i.id}
                                    onSelect={(i) => {
                                        sender.state.itemSelecionado.ganhador1 = i;
                                        sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                    }}
                                    noDropDown={true}
                                    onUpdateOptions={() => {}}
                                    formularioPadrao={(select) => (
                                        <Jogador
                                            api={this.props.api}
                                            select={select}
                                            filtroAdicional={this.getFiltroAdicional(
                                                sender.state.itemSelecionado.ganhador1,
                                                sender.state.itemSelecionado
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}
                {sender.state.itemSelecionado.semana && (
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>2º Lugar</Form.Label>
                                <Select
                                    placeholder=''
                                    name='ganhador2'
                                    defaultValue={
                                        sender.state.itemSelecionado.ganhador2
                                            ? sender.state.itemSelecionado.ganhador2
                                            : null
                                    }
                                    getDescription={(i) => i.nomeCompleto}
                                    getKeyValue={(i) => i.id}
                                    onSelect={(i) => {
                                        sender.state.itemSelecionado.ganhador2 = i;
                                        sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                    }}
                                    noDropDown={true}
                                    onUpdateOptions={() => {}}
                                    formularioPadrao={(select) => (
                                        <Jogador
                                            api={this.props.api}
                                            select={select}
                                            filtroAdicional={this.getFiltroAdicional(
                                                sender.state.itemSelecionado.ganhador2,
                                                sender.state.itemSelecionado
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}
                {sender.state.itemSelecionado.semana && (
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>3º Lugar</Form.Label>
                                <Select
                                    placeholder=''
                                    name='ganhador3'
                                    defaultValue={
                                        sender.state.itemSelecionado.ganhador3
                                            ? sender.state.itemSelecionado.ganhador3
                                            : null
                                    }
                                    getDescription={(i) => i.nomeCompleto}
                                    getKeyValue={(i) => i.id}
                                    onSelect={(i) => {
                                        sender.state.itemSelecionado.ganhador3 = i;
                                        sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                    }}
                                    noDropDown={true}
                                    onUpdateOptions={() => {}}
                                    formularioPadrao={(select) => (
                                        <Jogador
                                            api={this.props.api}
                                            select={select}
                                            filtroAdicional={this.getFiltroAdicional(
                                                sender.state.itemSelecionado.ganhador3,
                                                sender.state.itemSelecionado
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}
                {/* {sender.state.itemSelecionado.semana && (
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>4º Lugar</Form.Label>
                                <Select
                                    placeholder=''
                                    name='ganhador4'
                                    defaultValue={
                                        sender.state.itemSelecionado.ganhador4
                                            ? sender.state.itemSelecionado.ganhador4
                                            : null
                                    }
                                    getDescription={(i) => i.nomeCompleto}
                                    getKeyValue={(i) => i.id}
                                    onSelect={(i) => {
                                        sender.state.itemSelecionado.ganhador4 = i;
                                        sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                    }}
                                    noDropDown={true}
                                    onUpdateOptions={() => {}}
                                    formularioPadrao={(select) => (
                                        <Jogador
                                            api={this.props.api}
                                            select={select}
                                            filtroAdicional={this.getFiltroAdicional(
                                                sender.state.itemSelecionado.ganhador4,
                                                sender.state.itemSelecionado
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}
                {sender.state.itemSelecionado.semana && (
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>5º Lugar</Form.Label>
                                <Select
                                    placeholder=''
                                    name='ganhador5'
                                    defaultValue={
                                        sender.state.itemSelecionado.ganhador5
                                            ? sender.state.itemSelecionado.ganhador5
                                            : null
                                    }
                                    getDescription={(i) => i.nomeCompleto}
                                    getKeyValue={(i) => i.id}
                                    onSelect={(i) => {
                                        sender.state.itemSelecionado.ganhador5 = i;
                                        sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                    }}
                                    noDropDown={true}
                                    onUpdateOptions={() => {}}
                                    formularioPadrao={(select) => (
                                        <Jogador
                                            api={this.props.api}
                                            select={select}
                                            filtroAdicional={this.getFiltroAdicional(
                                                sender.state.itemSelecionado.ganhador5,
                                                sender.state.itemSelecionado
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )} */}
                {sender.state.itemSelecionado.semana && (
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Último Lugar</Form.Label>
                                <Select
                                    placeholder=''
                                    name='ultimo'
                                    defaultValue={
                                        sender.state.itemSelecionado.ultimo ? sender.state.itemSelecionado.ultimo : null
                                    }
                                    getDescription={(i) => i.nomeCompleto}
                                    getKeyValue={(i) => i.id}
                                    onSelect={(i) => {
                                        sender.state.itemSelecionado.ultimo = i;
                                        sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                    }}
                                    noDropDown={true}
                                    onUpdateOptions={() => {}}
                                    formularioPadrao={(select) => (
                                        <Jogador
                                            api={this.props.api}
                                            select={select}
                                            filtroAdicional={this.getFiltroAdicional(
                                                sender.state.itemSelecionado.ultimo,
                                                sender.state.itemSelecionado
                                            )}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}

                {sender.state.itemSelecionado.semana && (
                    <Row>
                        <Col>
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
                        </Col>
                    </Row>
                )}

                {sender.state.itemSelecionado.semana && (
                    <Row>
                        <Col>
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
                        </Col>
                    </Row>
                )}

                {sender.state.itemSelecionado.semana && (
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
                )}
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
                ordenacaoPadrao={'Semana/Nome desc'}
                permissoes={[2610, 2611, 2612, 2613]}
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
