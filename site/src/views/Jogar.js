import React, { Component } from 'react';
import SessionManager from '../scripts/SessionManager';
import { LayoutParams } from '../components/LayoutParams';
import Api from '../scripts/Api';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import Acao from './Acao';
import { Select } from '../components/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceFive, faRedo, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { dateToString } from '../scripts/Utils';
import { showConfirm, showError, showInfo } from '../scripts/Messages';
import styled from 'styled-components';
import SimpleBar from 'simplebar-react';

const CARREGANDO = 0;
const CARREGADO = 1;

export default class Jogar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semanaAtiva: null,
            semanaSelecionada: null,
            palpite: null,
            idDaSemanaSelecionada: null,
            podeAlterarPalpite: false,
            statusDaTela: CARREGANDO,
            statusDaTelaDeSemanas: CARREGANDO,
            alterando: false,
        };
        this.sessionManager = new SessionManager();
        this.api = new Api();
        this.enviarPalpite = this.enviarPalpite.bind(this);
        this.consultarPalpite = this.consultarPalpite.bind(this);
        this.repetirPalpite = this.repetirPalpite.bind(this);
        this.palpiteAleatorio = this.palpiteAleatorio.bind(this);
    }

    componentDidMount() {
        this.setState({
            statusDaTela: CARREGANDO,
        });
        this.api.getAll('/palpite/combos').then((result) => {
            this.setState({
                semanaAtiva: result.semanaAtiva,
                semanaSelecionada: result.semanaAtiva,
                palpite: result.palpiteNaSemanaAtiva,
                idDaSemanaSelecionada: result.semanaAtiva.id,
                statusDaTela: CARREGADO,
                statusDaTelaDeSemanas: CARREGADO,
                podeAlterarPalpite: !result.semanaAtiva.semanaJaPassou,
                mostrarCampos: true,
            });
        });
    }

    enviarPalpite() {
        if (!this.state.palpite) {
            this.setState({ palpite: {} });
        }
        if (!this.state.palpite.acao1) {
            showError('Selecione a primeira ação.');
            return;
        }
        if (!this.state.palpite.acao2) {
            showError('Selecione a segunda ação.');
            return;
        }
        if (!this.state.palpite.acao3) {
            showError('Selecione a terceira ação.');
            return;
        }
        if (!this.state.palpite.acao4) {
            showError('Selecione a quarta ação.');
            return;
        }
        if (!this.state.palpite.acao5) {
            showError('Selecione a quinta ação.');
            return;
        }
        if (!this.state.palpite.piorAcao) {
            showError('Selecione a pior ação.');
            return;
        }

        let alteracao = this.state.palpite.id > 0 ? true : false;

        showConfirm(
            alteracao ? 'Confirma realmente a alteração do seu palpite?' : 'Confirma realmente o envio do seu palpite?',
            () => {
                let input = {
                    id: alteracao ? this.state.palpite.id : null,
                    idDaSemana: this.state.semanaSelecionada.id,
                    idDaAcao1: this.state.palpite.acao1.id,
                    idDaAcao2: this.state.palpite.acao2.id,
                    idDaAcao3: this.state.palpite.acao3.id,
                    idDaAcao4: this.state.palpite.acao4.id,
                    idDaAcao5: this.state.palpite.acao5.id,
                    idDaPiorAcao: this.state.palpite.piorAcao.id,
                };

                this.setState({
                    statusDaTelaDeSemanas: CARREGANDO,
                });

                if (alteracao) {
                    this.api.put('/palpite', input).then((result) => {
                        this.setState({
                            palpite: result,
                            statusDaTelaDeSemanas: CARREGADO,
                        });
                        showInfo(
                            'Seus palpites foram alterados com sucesso. Você pode alterá-los novamente até a abertura do mercado.'
                        ).then(() => {
                            this.setState({ alterando: false });
                        });
                    });
                } else {
                    this.api.post('/palpite', input).then((result) => {
                        this.setState({
                            palpite: result,
                            statusDaTelaDeSemanas: CARREGADO,
                        });
                        showInfo(
                            'Seus palpites foram registrados com sucesso. Você pode alterá-los até a abertura do mercado.'
                        ).then(() => {
                            this.setState({ alterando: false });
                        });
                    });
                }
            },
            null,
            'Sim',
            'Não'
        );
    }

    consultarPalpite(id) {
        this.setState({ statusDaTelaDeSemanas: CARREGANDO });
        this.api.get('/palpite/' + id).then((result) => {
            this.setState({
                palpite: result,
                statusDaTelaDeSemanas: CARREGADO,
            });
        });
    }

    repetirPalpite() {
        showConfirm(
            'Repetir o seu último palpite, OK?',
            () => {
                this.api.get('/palpite/palpite-anterior/' + this.state.semanaSelecionada.id).then((result) => {
                    let palpite = this.state.palpite;
                    if (!palpite) {
                        palpite = {};
                    }
                    console.log(result);
                    if (result) {
                        palpite.acao1 = result.acao1;
                        palpite.acao2 = result.acao2;
                        palpite.acao3 = result.acao3;
                        palpite.acao4 = result.acao4;
                        palpite.acao5 = result.acao5;
                        palpite.piorAcao = result.piorAcao;
                    }
                    this.setState(
                        {
                            palpite: palpite,
                        },
                        () => this.atualizarCampos()
                    );
                });
            },
            null,
            'OK',
            'Cancelar'
        );
    }

    palpiteAleatorio() {
        showConfirm(
            'Vamos preencher com um palpite aleatório, OK?',
            () => {
                this.api.get('/palpite/palpite-aleatorio').then((result) => {
                    let palpite = this.state.palpite;
                    if (!palpite) {
                        palpite = {};
                    }
                    console.log(result);
                    palpite.acao1 = result.acao1;
                    palpite.acao2 = result.acao2;
                    palpite.acao3 = result.acao3;
                    palpite.acao4 = result.acao4;
                    palpite.acao5 = result.acao5;
                    palpite.piorAcao = result.piorAcao;
                    this.setState(
                        {
                            palpite: palpite,
                        },
                        () => this.atualizarCampos()
                    );
                });
            },
            null,
            'OK',
            'Cancelar'
        );
    }

    atualizarCampos() {
        this.setState({ mostrarCampos: false }, () => {
            this.setState({ mostrarCampos: true });
        });
    }

    getFiltroAdicional(exceto, itemSelecionado) {
        var filtro = '';

        if (itemSelecionado.acao1 && (!exceto || (exceto && exceto.id !== itemSelecionado.acao1.id))) {
            filtro += ' and id ne ' + itemSelecionado.acao1.id;
        }

        if (itemSelecionado.acao2 && (!exceto || (exceto && exceto.id !== itemSelecionado.acao2.id))) {
            filtro += ' and id ne ' + itemSelecionado.acao2.id;
        }

        if (itemSelecionado.acao3 && (!exceto || (exceto && exceto.id !== itemSelecionado.acao3.id))) {
            filtro += ' and id ne ' + itemSelecionado.acao3.id;
        }

        if (itemSelecionado.acao4 && (!exceto || (exceto && exceto.id !== itemSelecionado.acao4.id))) {
            filtro += ' and id ne ' + itemSelecionado.acao4.id;
        }

        if (itemSelecionado.acao5 && (!exceto || (exceto && exceto.id !== itemSelecionado.acao5.id))) {
            filtro += ' and id ne ' + itemSelecionado.acao5.id;
        }

        if (itemSelecionado.piorAcao && (!exceto || (exceto && exceto.id !== itemSelecionado.piorAcao.id))) {
            filtro += ' and id ne ' + itemSelecionado.piorAcao.id;
        }

        return filtro;
    }

    render() {
        return (
            <StyledContent id='conteudo'>
                {this.state.semanaSelecionada && this.state.statusDaTelaDeSemanas === CARREGADO ? (
                    <SimpleBar
                        style={{
                            width: 360,
                            margin: 'auto',
                            overflowY: 'auto',
                            display: 'flex',
                        }}
                    >
                        {this.state.semanaSelecionada.semanaJaPassou && !this.state.palpite && (
                            <Container style={{ fontSize: 18, textAlign: 'center', marginTop: 15 }}>
                                <Form.Label style={{ maxWidth: 380 }}>Semana encerrada.</Form.Label>
                            </Container>
                        )}
                        {this.state.semanaSelecionada.semanaAindaNaoFoiAberta && !this.state.palpite && (
                            <Container style={{ fontSize: 18, textAlign: 'center', marginTop: 15 }}>
                                <Form.Label style={{ maxWidth: 380 }}>
                                    {'Você pode jogar nessa semana a partir de ' +
                                        this.state.semanaSelecionada.horaDeAberturaDosJogos +
                                        'hs do dia ' +
                                        dateToString(this.state.semanaSelecionada.dataDeAberturaDosJogos).substr(0, 5) +
                                        '.'}
                                </Form.Label>
                            </Container>
                        )}

                        {(!this.state.semanaSelecionada.semanaJaPassou ||
                            this.state.semanaAtiva.id === this.state.semanaSelecionada.id ||
                            this.state.palpite) &&
                            !this.state.semanaSelecionada.semanaAindaNaoFoiAberta &&
                            this.state.mostrarCampos && (
                                <Container style={{ fontSize: 18 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            flexDirection: 'column',
                                            // paddingLeft: 40,
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div>
                                            <span style={{ color: LayoutParams.colors.corSecundaria, fontSize: 25 }}>
                                                {this.state.semanaSelecionada.nome}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 15 }}>
                                            <span style={{}}>
                                                {dateToString(this.state.semanaSelecionada.dataIncialDaApuracao)}
                                            </span>
                                            <span>{' até '}</span>
                                            <span style={{}}>
                                                {dateToString(this.state.semanaSelecionada.dataFinalDaApuracao)}
                                            </span>
                                        </div>
                                    </div>
                                </Container>
                            )}

                        {/* Novo palpite */}
                        {(!this.state.semanaSelecionada.semanaJaPassou ||
                            this.state.semanaAtiva.id === this.state.semanaSelecionada.id ||
                            this.state.palpite) &&
                            !this.state.semanaSelecionada.semanaAindaNaoFoiAberta &&
                            this.state.mostrarCampos &&
                            (!this.state.palpite || (this.state.palpite && !this.state.palpite.id)) && (
                                <Container style={{ fontSize: 18 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            flexDirection: 'row',
                                            // paddingLeft: 40,
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                        }}
                                    >
                                        <Button
                                            style={{
                                                backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                borderBlockColor: LayoutParams.colors.corSecundaria,
                                                color: LayoutParams.colors.corSecundaria,
                                                borderColor: LayoutParams.colors.corSecundaria,
                                                fontSize: 18,
                                                width: '50%',
                                                marginRight: 2,
                                            }}
                                            onClick={this.repetirPalpite}
                                        >
                                            <div
                                                style={{
                                                    color: LayoutParams.colors.corSecundaria,
                                                    display: 'flex',
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    title='Repetir último palpite'
                                                    icon={faRedo}
                                                    cursor='pointer'
                                                    style={{ fontSize: 20, margin: 'auto auto auto 5px' }}
                                                />
                                                <span style={{ margin: 'auto auto auto 5px' }}>Repetir</span>
                                            </div>
                                        </Button>

                                        <Button
                                            style={{
                                                backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                borderBlockColor: LayoutParams.colors.corSecundaria,
                                                color: LayoutParams.colors.corSecundaria,
                                                borderColor: LayoutParams.colors.corSecundaria,
                                                fontSize: 18,
                                                width: '50%',
                                                marginLeft: 2,
                                            }}
                                            onClick={this.palpiteAleatorio}
                                        >
                                            <div
                                                style={{
                                                    color: LayoutParams.colors.corSecundaria,
                                                    display: 'flex',
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    title='Palpite aleatório'
                                                    icon={faDiceFive}
                                                    onClick={this.palpiteAleatorio}
                                                    cursor='pointer'
                                                    style={{ fontSize: 20, margin: 'auto auto auto 5px' }}
                                                />
                                                <span style={{ margin: 'auto auto auto 5px' }}>Aleatório</span>
                                            </div>
                                        </Button>
                                    </div>
                                    {(!this.state.palpite || (this.state.palpite && !this.state.palpite.id)) && (
                                        <Form.Label style={{ maxWidth: 380 }}>
                                            Escolha as ações conforme a sua performance para a semana:
                                        </Form.Label>
                                    )}
                                    {this.state.palpite && this.state.palpite.id && (
                                        <Form.Label style={{ maxWidth: 380 }}>
                                            Esses são seus palpites de melhor performance nessa semana:
                                        </Form.Label>
                                    )}
                                    <br />
                                    <Form.Group as={Row}>
                                        <Form.Label column style={{ maxWidth: 40 }}>
                                            1º
                                        </Form.Label>
                                        <Col style={{ maxWidth: 350 }}>
                                            <Select
                                                placeholder='melhor performance'
                                                defaultValue={
                                                    this.state.palpite && this.state.palpite.acao1
                                                        ? this.state.palpite.acao1
                                                        : null
                                                }
                                                readOnly={!this.state.podeAlterarPalpite}
                                                options={[]}
                                                getDescription={(i) => i.nome}
                                                getKeyValue={(i) => i.id}
                                                onSelect={(i) => {
                                                    let palpite = this.state.palpite;
                                                    if (!palpite) {
                                                        palpite = {};
                                                    }
                                                    palpite.acao1 = i;
                                                    this.setState({ palpite: palpite });
                                                }}
                                                noDropDown={true}
                                                onUpdateOptions={() => {}}
                                                formularioPadrao={(select) => (
                                                    <Acao
                                                        api={this.api}
                                                        select={select}
                                                        filtroAdicional={this.getFiltroAdicional(
                                                            this.state.podeAlterarPalpite.acao1,
                                                            this.state.palpite
                                                        )}
                                                    />
                                                )}
                                                readOnlyColor='#cc9933'
                                                getFilterUrl={(text) => {
                                                    let filtroAdicional = this.getFiltroAdicional(
                                                        this.state.podeAlterarPalpite.acao1,
                                                        this.state.palpite
                                                    );
                                                    return (
                                                        '/acao?$filter=1 eq 1' +
                                                        filtroAdicional +
                                                        " and contains(Searchable,'" +
                                                        text +
                                                        "')&$orderby=nome&$top=5"
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column style={{ maxWidth: 40 }}>
                                            2º
                                        </Form.Label>
                                        <Col style={{ maxWidth: 350 }}>
                                            <Select
                                                placeholder='segundo lugar'
                                                defaultValue={
                                                    this.state.palpite && this.state.palpite.acao2
                                                        ? this.state.palpite.acao2
                                                        : null
                                                }
                                                readOnly={!this.state.podeAlterarPalpite}
                                                options={[]}
                                                getDescription={(i) => i.nome}
                                                getKeyValue={(i) => i.id}
                                                onSelect={(i) => {
                                                    let palpite = this.state.palpite;
                                                    if (!palpite) {
                                                        palpite = {};
                                                    }
                                                    palpite.acao2 = i;
                                                    this.setState({ palpite: palpite });
                                                }}
                                                noDropDown={true}
                                                onUpdateOptions={() => {}}
                                                formularioPadrao={(select) => (
                                                    <Acao
                                                        api={this.api}
                                                        select={select}
                                                        filtroAdicional={this.getFiltroAdicional(
                                                            this.state.podeAlterarPalpite.acao2,
                                                            this.state.palpite
                                                        )}
                                                    />
                                                )}
                                                readOnlyColor='#cc9933'
                                                getFilterUrl={(text) => {
                                                    let filtroAdicional = this.getFiltroAdicional(
                                                        this.state.podeAlterarPalpite.acao2,
                                                        this.state.palpite
                                                    );
                                                    return (
                                                        '/acao?$filter=1 eq 1' +
                                                        filtroAdicional +
                                                        " and contains(Searchable,'" +
                                                        text +
                                                        "')&$orderby=nome&$top=5"
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column style={{ maxWidth: 40 }}>
                                            3º
                                        </Form.Label>
                                        <Col style={{ maxWidth: 350 }}>
                                            <Select
                                                placeholder='terceiro lugar'
                                                defaultValue={
                                                    this.state.palpite && this.state.palpite.acao3
                                                        ? this.state.palpite.acao3
                                                        : null
                                                }
                                                readOnly={!this.state.podeAlterarPalpite}
                                                options={[]}
                                                getDescription={(i) => i.nome}
                                                getKeyValue={(i) => i.id}
                                                onSelect={(i) => {
                                                    let palpite = this.state.palpite;
                                                    if (!palpite) {
                                                        palpite = {};
                                                    }
                                                    palpite.acao3 = i;
                                                    this.setState({ palpite: palpite });
                                                }}
                                                noDropDown={true}
                                                onUpdateOptions={() => {}}
                                                formularioPadrao={(select) => (
                                                    <Acao
                                                        api={this.api}
                                                        select={select}
                                                        filtroAdicional={this.getFiltroAdicional(
                                                            this.state.podeAlterarPalpite.acao3,
                                                            this.state.palpite
                                                        )}
                                                    />
                                                )}
                                                readOnlyColor='#cc9933'
                                                getFilterUrl={(text) => {
                                                    let filtroAdicional = this.getFiltroAdicional(
                                                        this.state.podeAlterarPalpite.acao3,
                                                        this.state.palpite
                                                    );
                                                    return (
                                                        '/acao?$filter=1 eq 1' +
                                                        filtroAdicional +
                                                        " and contains(Searchable,'" +
                                                        text +
                                                        "')&$orderby=nome&$top=5"
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column style={{ maxWidth: 40 }}>
                                            4º
                                        </Form.Label>
                                        <Col style={{ maxWidth: 350 }}>
                                            <Select
                                                placeholder='quarto lugar'
                                                defaultValue={
                                                    this.state.palpite && this.state.palpite.acao4
                                                        ? this.state.palpite.acao4
                                                        : null
                                                }
                                                readOnly={!this.state.podeAlterarPalpite}
                                                options={[]}
                                                getDescription={(i) => i.nome}
                                                getKeyValue={(i) => i.id}
                                                onSelect={(i) => {
                                                    let palpite = this.state.palpite;
                                                    if (!palpite) {
                                                        palpite = {};
                                                    }
                                                    palpite.acao4 = i;
                                                    this.setState({ palpite: palpite });
                                                }}
                                                noDropDown={true}
                                                onUpdateOptions={() => {}}
                                                formularioPadrao={(select) => (
                                                    <Acao
                                                        api={this.api}
                                                        select={select}
                                                        filtroAdicional={this.getFiltroAdicional(
                                                            this.state.podeAlterarPalpite.acao4,
                                                            this.state.palpite
                                                        )}
                                                    />
                                                )}
                                                readOnlyColor='#cc9933'
                                                getFilterUrl={(text) => {
                                                    let filtroAdicional = this.getFiltroAdicional(
                                                        this.state.podeAlterarPalpite.acao4,
                                                        this.state.palpite
                                                    );
                                                    return (
                                                        '/acao?$filter=1 eq 1' +
                                                        filtroAdicional +
                                                        " and contains(Searchable,'" +
                                                        text +
                                                        "')&$orderby=nome&$top=5"
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column style={{ maxWidth: 40 }}>
                                            5º
                                        </Form.Label>
                                        <Col style={{ maxWidth: 350 }}>
                                            <Select
                                                placeholder='quinto lugar'
                                                defaultValue={
                                                    this.state.palpite && this.state.palpite.acao5
                                                        ? this.state.palpite.acao5
                                                        : null
                                                }
                                                readOnly={!this.state.podeAlterarPalpite}
                                                options={[]}
                                                getDescription={(i) => i.nome}
                                                getKeyValue={(i) => i.id}
                                                onSelect={(i) => {
                                                    let palpite = this.state.palpite;
                                                    if (!palpite) {
                                                        palpite = {};
                                                    }
                                                    palpite.acao5 = i;
                                                    this.setState({ palpite: palpite });
                                                }}
                                                noDropDown={true}
                                                onUpdateOptions={() => {}}
                                                formularioPadrao={(select) => (
                                                    <Acao
                                                        api={this.api}
                                                        select={select}
                                                        filtroAdicional={this.getFiltroAdicional(
                                                            this.state.podeAlterarPalpite.acao5,
                                                            this.state.palpite
                                                        )}
                                                    />
                                                )}
                                                readOnlyColor='#cc9933'
                                                getFilterUrl={(text) => {
                                                    let filtroAdicional = this.getFiltroAdicional(
                                                        this.state.podeAlterarPalpite.acao5,
                                                        this.state.palpite
                                                    );
                                                    return (
                                                        '/acao?$filter=1 eq 1' +
                                                        filtroAdicional +
                                                        " and contains(Searchable,'" +
                                                        text +
                                                        "')&$orderby=nome&$top=5"
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                    {(!this.state.palpite || (this.state.palpite && !this.state.palpite.id)) && (
                                        <Form.Label style={{ maxWidth: 380 }}>
                                            Escolha a ação que será a lanterninha da semana:
                                        </Form.Label>
                                    )}
                                    {this.state.palpite && this.state.palpite.id && (
                                        <Form.Label style={{ maxWidth: 380 }}>
                                            Você escolheu essa ação como lanterninha da semana:
                                        </Form.Label>
                                    )}
                                    <br />
                                    <Form.Group as={Row}>
                                        <Form.Label column style={{ maxWidth: 40 }}>
                                            <FontAwesomeIcon icon={faThumbsDown} />
                                        </Form.Label>
                                        <Col style={{ maxWidth: 350 }}>
                                            <Select
                                                placeholder='pior performance'
                                                defaultValue={
                                                    this.state.palpite && this.state.palpite.piorAcao
                                                        ? this.state.palpite.piorAcao
                                                        : null
                                                }
                                                readOnly={!this.state.podeAlterarPalpite}
                                                options={[]}
                                                getDescription={(i) => i.nome}
                                                getKeyValue={(i) => i.id}
                                                onSelect={(i) => {
                                                    let palpite = this.state.palpite;
                                                    if (!palpite) {
                                                        palpite = {};
                                                    }
                                                    palpite.piorAcao = i;
                                                    this.setState({ palpite: palpite });
                                                }}
                                                noDropDown={true}
                                                onUpdateOptions={() => {}}
                                                formularioPadrao={(select) => (
                                                    <Acao
                                                        api={this.api}
                                                        select={select}
                                                        filtroAdicional={this.getFiltroAdicional(
                                                            this.state.podeAlterarPalpite.piorAcao,
                                                            this.state.palpite
                                                        )}
                                                    />
                                                )}
                                                readOnlyColor='#cc9933'
                                                getFilterUrl={(text) => {
                                                    let filtroAdicional = this.getFiltroAdicional(
                                                        this.state.podeAlterarPalpite.piorAcao,
                                                        this.state.palpite
                                                    );
                                                    return (
                                                        '/acao?$filter=1 eq 1' +
                                                        filtroAdicional +
                                                        " and contains(Searchable,'" +
                                                        text +
                                                        "')&$orderby=nome&$top=5"
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                    {(this.state.podeAlterarPalpite ||
                                        !this.state.semanaSelecionada.semanaJaPassou) && (
                                        <Form.Group as={Row}>
                                            <Form.Label column style={{ maxWidth: 42 }}></Form.Label>

                                            <Col className=' '>
                                                <Button
                                                    style={{
                                                        backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                        borderBlockColor: LayoutParams.colors.corSecundaria,
                                                        color: LayoutParams.colors.corSecundaria,
                                                        borderColor: LayoutParams.colors.corSecundaria,
                                                        fontSize: 16,
                                                    }}
                                                    onClick={this.enviarPalpite}
                                                    block
                                                >
                                                    {this.state.palpite &&
                                                    this.state.palpite.id &&
                                                    this.state.podeAlterarPalpite
                                                        ? 'Alterar palpite'
                                                        : 'Enviar palpite'}
                                                </Button>
                                            </Col>
                                        </Form.Group>
                                    )}
                                </Container>
                            )}

                        {/* Visualizando palpite */}
                        {(!this.state.semanaSelecionada.semanaJaPassou ||
                            this.state.semanaAtiva.id === this.state.semanaSelecionada.id ||
                            this.state.palpite) &&
                            !this.state.semanaSelecionada.semanaAindaNaoFoiAberta &&
                            this.state.mostrarCampos &&
                            this.state.palpite && this.state.palpite.id && (
                                <Container style={{ fontSize: 18 }}>
                                    {this.state.alterando && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                width: '100%',
                                                flexDirection: 'row',
                                                paddingTop: 15,
                                                paddingBottom: 15,
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                    borderBlockColor: LayoutParams.colors.corSecundaria,
                                                    color: LayoutParams.colors.corSecundaria,
                                                    borderColor: LayoutParams.colors.corSecundaria,
                                                    fontSize: 18,
                                                    width: '50%',
                                                    marginRight: 2,
                                                }}
                                                onClick={this.repetirPalpite}
                                            >
                                                <div
                                                    style={{
                                                        color: LayoutParams.colors.corSecundaria,
                                                        display: 'flex',
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        title='Repetir último palpite'
                                                        icon={faRedo}
                                                        cursor='pointer'
                                                        style={{ fontSize: 20, margin: 'auto auto auto 5px' }}
                                                    />
                                                    <span style={{ margin: 'auto auto auto 5px' }}>Repetir</span>
                                                </div>
                                            </Button>

                                            <Button
                                                style={{
                                                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                    borderBlockColor: LayoutParams.colors.corSecundaria,
                                                    color: LayoutParams.colors.corSecundaria,
                                                    borderColor: LayoutParams.colors.corSecundaria,
                                                    fontSize: 18,
                                                    width: '50%',
                                                    marginLeft: 2,
                                                }}
                                                onClick={this.palpiteAleatorio}
                                            >
                                                <div
                                                    style={{
                                                        color: LayoutParams.colors.corSecundaria,
                                                        display: 'flex',
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        title='Palpite aleatório'
                                                        icon={faDiceFive}
                                                        onClick={this.palpiteAleatorio}
                                                        cursor='pointer'
                                                        style={{ fontSize: 20, margin: 'auto auto auto 5px' }}
                                                    />
                                                    <span style={{ margin: 'auto auto auto 5px' }}>Aleatório</span>
                                                </div>
                                            </Button>
                                        </div>
                                    )}

                                    {this.state.alterando && (
                                        <Form.Label style={{ maxWidth: 380 }}>
                                            Escolha as ações conforme a sua performance para a semana:
                                        </Form.Label>
                                    )}
                                    {!this.state.alterando && (
                                        <Form.Label style={{ maxWidth: 380, color: LayoutParams.colors.corSecundaria }}>
                                            Esses são seus palpites de melhor performance nessa semana:
                                        </Form.Label>
                                    )}
                                    <br />

                                    {this.state.alterando && (
                                        <div>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    1º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Select
                                                        placeholder='melhor performance'
                                                        defaultValue={
                                                            this.state.palpite && this.state.palpite.acao1
                                                                ? this.state.palpite.acao1
                                                                : null
                                                        }
                                                        readOnly={!this.state.podeAlterarPalpite}
                                                        options={[]}
                                                        getDescription={(i) => i.nome}
                                                        getKeyValue={(i) => i.id}
                                                        onSelect={(i) => {
                                                            let palpite = this.state.palpite;
                                                            if (!palpite) {
                                                                palpite = {};
                                                            }
                                                            palpite.acao1 = i;
                                                            this.setState({ palpite: palpite });
                                                        }}
                                                        noDropDown={true}
                                                        onUpdateOptions={() => {}}
                                                        formularioPadrao={(select) => (
                                                            <Acao
                                                                api={this.api}
                                                                select={select}
                                                                filtroAdicional={this.getFiltroAdicional(
                                                                    this.state.podeAlterarPalpite.acao1,
                                                                    this.state.palpite
                                                                )}
                                                            />
                                                        )}
                                                        readOnlyColor='#cc9933'
                                                        getFilterUrl={(text) => {
                                                            let filtroAdicional = this.getFiltroAdicional(
                                                                this.state.podeAlterarPalpite.acao1,
                                                                this.state.palpite
                                                            );
                                                            return (
                                                                '/acao?$filter=1 eq 1' +
                                                                filtroAdicional +
                                                                " and contains(Searchable,'" +
                                                                text +
                                                                "')&$orderby=nome&$top=5"
                                                            );
                                                        }}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    2º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Select
                                                        placeholder='melhor performance'
                                                        defaultValue={
                                                            this.state.palpite && this.state.palpite.acao2
                                                                ? this.state.palpite.acao2
                                                                : null
                                                        }
                                                        readOnly={!this.state.podeAlterarPalpite}
                                                        options={[]}
                                                        getDescription={(i) => i.nome}
                                                        getKeyValue={(i) => i.id}
                                                        onSelect={(i) => {
                                                            let palpite = this.state.palpite;
                                                            if (!palpite) {
                                                                palpite = {};
                                                            }
                                                            palpite.acao2 = i;
                                                            this.setState({ palpite: palpite });
                                                        }}
                                                        noDropDown={true}
                                                        onUpdateOptions={() => {}}
                                                        formularioPadrao={(select) => (
                                                            <Acao
                                                                api={this.api}
                                                                select={select}
                                                                filtroAdicional={this.getFiltroAdicional(
                                                                    this.state.podeAlterarPalpite.acao2,
                                                                    this.state.palpite
                                                                )}
                                                            />
                                                        )}
                                                        readOnlyColor='#cc9933'
                                                        getFilterUrl={(text) => {
                                                            let filtroAdicional = this.getFiltroAdicional(
                                                                this.state.podeAlterarPalpite.acao1,
                                                                this.state.palpite
                                                            );
                                                            return (
                                                                '/acao?$filter=1 eq 1' +
                                                                filtroAdicional +
                                                                " and contains(Searchable,'" +
                                                                text +
                                                                "')&$orderby=nome&$top=5"
                                                            );
                                                        }}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    3º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Select
                                                        placeholder='melhor performance'
                                                        defaultValue={
                                                            this.state.palpite && this.state.palpite.acao3
                                                                ? this.state.palpite.acao3
                                                                : null
                                                        }
                                                        readOnly={!this.state.podeAlterarPalpite}
                                                        options={[]}
                                                        getDescription={(i) => i.nome}
                                                        getKeyValue={(i) => i.id}
                                                        onSelect={(i) => {
                                                            let palpite = this.state.palpite;
                                                            if (!palpite) {
                                                                palpite = {};
                                                            }
                                                            palpite.acao3 = i;
                                                            this.setState({ palpite: palpite });
                                                        }}
                                                        noDropDown={true}
                                                        onUpdateOptions={() => {}}
                                                        formularioPadrao={(select) => (
                                                            <Acao
                                                                api={this.api}
                                                                select={select}
                                                                filtroAdicional={this.getFiltroAdicional(
                                                                    this.state.podeAlterarPalpite.acao3,
                                                                    this.state.palpite
                                                                )}
                                                            />
                                                        )}
                                                        readOnlyColor='#cc9933'
                                                        getFilterUrl={(text) => {
                                                            let filtroAdicional = this.getFiltroAdicional(
                                                                this.state.podeAlterarPalpite.acao3,
                                                                this.state.palpite
                                                            );
                                                            return (
                                                                '/acao?$filter=1 eq 1' +
                                                                filtroAdicional +
                                                                " and contains(Searchable,'" +
                                                                text +
                                                                "')&$orderby=nome&$top=5"
                                                            );
                                                        }}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    4º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Select
                                                        placeholder='melhor performance'
                                                        defaultValue={
                                                            this.state.palpite && this.state.palpite.acao4
                                                                ? this.state.palpite.acao4
                                                                : null
                                                        }
                                                        readOnly={!this.state.podeAlterarPalpite}
                                                        options={[]}
                                                        getDescription={(i) => i.nome}
                                                        getKeyValue={(i) => i.id}
                                                        onSelect={(i) => {
                                                            let palpite = this.state.palpite;
                                                            if (!palpite) {
                                                                palpite = {};
                                                            }
                                                            palpite.acao4 = i;
                                                            this.setState({ palpite: palpite });
                                                        }}
                                                        noDropDown={true}
                                                        onUpdateOptions={() => {}}
                                                        formularioPadrao={(select) => (
                                                            <Acao
                                                                api={this.api}
                                                                select={select}
                                                                filtroAdicional={this.getFiltroAdicional(
                                                                    this.state.podeAlterarPalpite.acao4,
                                                                    this.state.palpite
                                                                )}
                                                            />
                                                        )}
                                                        readOnlyColor='#cc9933'
                                                        getFilterUrl={(text) => {
                                                            let filtroAdicional = this.getFiltroAdicional(
                                                                this.state.podeAlterarPalpite.acao4,
                                                                this.state.palpite
                                                            );
                                                            return (
                                                                '/acao?$filter=1 eq 1' +
                                                                filtroAdicional +
                                                                " and contains(Searchable,'" +
                                                                text +
                                                                "')&$orderby=nome&$top=5"
                                                            );
                                                        }}
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    5º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Select
                                                        placeholder='melhor performance'
                                                        defaultValue={
                                                            this.state.palpite && this.state.palpite.acao5
                                                                ? this.state.palpite.acao5
                                                                : null
                                                        }
                                                        readOnly={!this.state.podeAlterarPalpite}
                                                        options={[]}
                                                        getDescription={(i) => i.nome}
                                                        getKeyValue={(i) => i.id}
                                                        onSelect={(i) => {
                                                            let palpite = this.state.palpite;
                                                            if (!palpite) {
                                                                palpite = {};
                                                            }
                                                            palpite.acao5 = i;
                                                            this.setState({ palpite: palpite });
                                                        }}
                                                        noDropDown={true}
                                                        onUpdateOptions={() => {}}
                                                        formularioPadrao={(select) => (
                                                            <Acao
                                                                api={this.api}
                                                                select={select}
                                                                filtroAdicional={this.getFiltroAdicional(
                                                                    this.state.podeAlterarPalpite.acao5,
                                                                    this.state.palpite
                                                                )}
                                                            />
                                                        )}
                                                        readOnlyColor='#cc9933'
                                                        getFilterUrl={(text) => {
                                                            let filtroAdicional = this.getFiltroAdicional(
                                                                this.state.podeAlterarPalpite.acao5,
                                                                this.state.palpite
                                                            );
                                                            return (
                                                                '/acao?$filter=1 eq 1' +
                                                                filtroAdicional +
                                                                " and contains(Searchable,'" +
                                                                text +
                                                                "')&$orderby=nome&$top=5"
                                                            );
                                                        }}
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Label style={{ maxWidth: 380 }}>
                                                Escolha a ação que será a lanterninha da semana:
                                            </Form.Label>

                                            <br />

                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    <FontAwesomeIcon icon={faThumbsDown} />
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Select
                                                        placeholder='pior performance'
                                                        defaultValue={
                                                            this.state.palpite && this.state.palpite.piorAcao
                                                                ? this.state.palpite.piorAcao
                                                                : null
                                                        }
                                                        readOnly={!this.state.podeAlterarPalpite}
                                                        options={[]}
                                                        getDescription={(i) => i.nome}
                                                        getKeyValue={(i) => i.id}
                                                        onSelect={(i) => {
                                                            let palpite = this.state.palpite;
                                                            if (!palpite) {
                                                                palpite = {};
                                                            }
                                                            palpite.piorAcao = i;
                                                            this.setState({ palpite: palpite });
                                                        }}
                                                        noDropDown={true}
                                                        onUpdateOptions={() => {}}
                                                        formularioPadrao={(select) => (
                                                            <Acao
                                                                api={this.api}
                                                                select={select}
                                                                filtroAdicional={this.getFiltroAdicional(
                                                                    this.state.podeAlterarPalpite.piorAcao,
                                                                    this.state.palpite
                                                                )}
                                                            />
                                                        )}
                                                        readOnlyColor='#cc9933'
                                                        getFilterUrl={(text) => {
                                                            let filtroAdicional = this.getFiltroAdicional(
                                                                this.state.podeAlterarPalpite.piorAcao,
                                                                this.state.palpite
                                                            );
                                                            return (
                                                                '/acao?$filter=1 eq 1' +
                                                                filtroAdicional +
                                                                " and contains(Searchable,'" +
                                                                text +
                                                                "')&$orderby=nome&$top=5"
                                                            );
                                                        }}
                                                    />
                                                </Col>
                                            </Form.Group>
                                        </div>
                                    )}

                                    {!this.state.alterando && (
                                        <div>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    1º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Form.Label>{this.state.palpite.acao1.nome}</Form.Label>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    2º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Form.Label>{this.state.palpite.acao2.nome}</Form.Label>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    3º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Form.Label>{this.state.palpite.acao3.nome}</Form.Label>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    4º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Form.Label>{this.state.palpite.acao4.nome}</Form.Label>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    5º
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Form.Label>{this.state.palpite.acao5.nome}</Form.Label>
                                                </Col>
                                            </Form.Group>

                                            {this.state.alterando && (
                                                <Form.Label style={{ maxWidth: 380 }}>
                                                    Escolha a ação que será a lanterninha da semana:
                                                </Form.Label>
                                            )}
                                            {!this.state.alterando && (
                                                <Form.Label
                                                    style={{ maxWidth: 380, color: LayoutParams.colors.corSecundaria }}
                                                >
                                                    Você escolheu essa ação como lanterninha da semana:
                                                </Form.Label>
                                            )}
                                            <br />
                                            <Form.Group as={Row}>
                                                <Form.Label column style={{ maxWidth: 40 }}>
                                                    <FontAwesomeIcon icon={faThumbsDown} />
                                                </Form.Label>
                                                <Col style={{ maxWidth: 350 }}>
                                                    <Form.Label>{this.state.palpite.piorAcao.nome}</Form.Label>
                                                </Col>
                                            </Form.Group>
                                        </div>
                                    )}

                                    {(this.state.podeAlterarPalpite ||
                                        !this.state.semanaSelecionada.semanaJaPassou) && (
                                        <Form.Group as={Row}>
                                            {this.state.palpite && this.state.palpite.id && this.state.alterando ? <Form.Label column style={{ maxWidth: 42 }}></Form.Label> : null}

                                            <Col className=' '>
                                                <Button
                                                    style={{
                                                        backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                        borderBlockColor: LayoutParams.colors.corSecundaria,
                                                        color: LayoutParams.colors.corSecundaria,
                                                        borderColor: LayoutParams.colors.corSecundaria,
                                                        fontSize: 16,
                                                    }}
                                                    onClick={() => {
                                                        if (this.state.alterando) {
                                                            this.enviarPalpite();
                                                        } else {
                                                            this.setState({ alterando: true, palpiteAnterior: JSON.stringify(this.state.palpite) });
                                                        }
                                                    }}
                                                    block
                                                >
                                                    {this.state.palpite && this.state.palpite.id && this.state.alterando
                                                        ? 'Enviar palpite'
                                                        : 'Alterar palpite'}
                                                </Button>
                                                {this.state.alterando && (
                                                    <Button
                                                        style={{
                                                            backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                            borderBlockColor: LayoutParams.colors.corSecundaria,
                                                            color: LayoutParams.colors.corSecundaria,
                                                            borderColor: LayoutParams.colors.corSecundaria,
                                                            fontSize: 16,
                                                        }}
                                                        onClick={() => {
                                                            this.setState({ alterando: false, palpite: JSON.parse(this.state.palpiteAnterior) });
                                                        }}
                                                        block
                                                    >
                                                        Cancelar
                                                    </Button>
                                                )}
                                            </Col>
                                        </Form.Group>
                                    )}
                                </Container>
                            )}
                    </SimpleBar>
                ) : (
                    <div />
                )}
            </StyledContent>
        );
    }
}

const StyledContent = styled.div`
    overflow: hidden;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
`;
