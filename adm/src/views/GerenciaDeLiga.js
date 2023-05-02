import React, { Component } from 'react';
import { LayoutParams } from '../components/LayoutParams';
import { faPlusCircle, faExternalLinkAlt, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Card, Button, Table } from 'react-bootstrap';
import { Select } from '../components/Select';
import { numberToCurrencyString, dateToString } from '../scripts/Utils';
import { CheckBox } from '../components/CheckBox';
import Liga from './Liga';
import { showError } from '../scripts/Messages';

export default class GerenciaDeLiga extends Component {
    constructor(props) {
        super(props);

        this.state = {
            participantes: [],
            filtro: {
                solicitada: true,
            },
        };

        this.adicionar = this.adicionar.bind(this);
        this.aceitar = this.aceitar.bind(this);
        this.recusar = this.recusar.bind(this);
        this.remover = this.remover.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
    }

    adicionar(item) {
        this.setState({ adicionando: true });
        this.props.api
            .post('/participante-liga/adicionar', {
                idDaLiga: this.state.filtro.liga.id,
                idDoJogador: item.id,
            })
            .then(() => {
                this.setState({ adicionando: false });
                this.pesquisar(this.state.filtro);
            })
            .catch(() => {
                this.setState({ adicionando: false });
            });
    }

    aceitar(item) {
        this.setState({ aceitando: true });
        this.props.api
            .post('/participante-liga/aceitar-participacao', {
                idDaLiga: this.state.filtro.liga.id,
                idDoJogador: item.id,
            })
            .then(() => {
                this.setState({ aceitando: false });
                this.pesquisar(this.state.filtro);
            })
            .catch(() => {
                this.setState({ adicioaceitandonando: false });
            });
    }

    recusar(item) {
        this.setState({ recusando: true });
        this.props.api
            .post('/participante-liga/recusar-participacao', {
                idDaLiga: this.state.filtro.liga.id,
                idDoJogador: item.id,
            })
            .then(() => {
                this.setState({ recusando: false });
                this.pesquisar(this.state.filtro);
            })
            .catch(() => {
                this.setState({ recusando: false });
            });
    }

    remover(item) {
        this.setState({ removendo: true });
        this.props.api
            .post('/participante-liga/remover', {
                idDaLiga: this.state.filtro.liga.id,
                idDoJogador: item.id,
            })
            .then(() => {
                this.setState({ removendo: false });
                this.pesquisar(this.state.filtro);
            })
            .catch(() => {
                this.setState({ removendo: false });
            });
    }

    pesquisar(filtro) {
        if (!(filtro && filtro.liga)) {
            showError('Informe a liga.');
            return;
        }

        this.props.api.getAll('/participante-liga/jogadores-para-liga/' + filtro.liga.id).then((result) => {
            this.setState({ participantes: result });
        });
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 5 }}>
                <Titulo />

                <Filtro
                    api={this.props.api}
                    pesquisar={this.pesquisar}
                    getFiltro={() => this.state.filtro}
                    setFiltro={(filtro) => this.setState({ filtro: filtro })}
                />

                <div
                    style={{
                        flexBasis: '100%',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        display: 'flex,',
                    }}
                >
                    {!this.state.comanda && !this.state.cadastrandoComanda && (
                        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
                            {!this.state.vazio && (
                                <Table striped bordered hover size='sm'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '70%' }}>Jogador</th>
                                            <th style={{ width: '30%' }}>Situação</th>
                                            <th style={{ textAlign: 'center', width: 100 }}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.participantes.map((item, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    style={{
                                                        backgroundColor: item.idDaComanda
                                                            ? this.getCorDaSituacao(item)
                                                            : null,
                                                    }}
                                                >
                                                    <td>{item.nome}</td>
                                                    <td>
                                                        {item.situacao && item.situacao.id > 0
                                                            ? item.situacao.descricao
                                                            : ''}
                                                    </td>

                                                    <td
                                                        style={{
                                                            textAlign: 'center',

                                                            padding: 0,
                                                            display: 'flex',
                                                            verticalAlign: 'middle',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'table-cell',
                                                                fontSize: 22,
                                                                margin: 'auto',
                                                            }}
                                                        >
                                                            <div>
                                                                {(!item.situacao ||
                                                                    item.situacao.id === 0 ||
                                                                    item.situacao.id === 5) && (
                                                                    <FontAwesomeIcon
                                                                        title='adicionar'
                                                                        icon={faPlusCircle}
                                                                        cursor='pointer'
                                                                        onClick={() => this.adicionar(item, index)}
                                                                        style={{ marginLeft: 8, marginRight: 8 }}
                                                                        disabled={this.state.adicionando}
                                                                    />
                                                                )}

                                                                {item.situacao && item.situacao.id === 1 && (
                                                                    <FontAwesomeIcon
                                                                        title='aceitar'
                                                                        icon={faCheck}
                                                                        cursor='pointer'
                                                                        onClick={() => this.aceitar(item)}
                                                                        style={{ marginLeft: 8, marginRight: 8 }}
                                                                        disabled={this.state.aceitando}
                                                                    />
                                                                )}

                                                                {item.situacao && item.situacao.id === 1 && (
                                                                    <FontAwesomeIcon
                                                                        title='recusar'
                                                                        icon={faCheck}
                                                                        cursor='pointer'
                                                                        onClick={() => this.recusar(item)}
                                                                        style={{ marginLeft: 8, marginRight: 8 }}
                                                                        disabled={this.state.recusando}
                                                                    />
                                                                )}

                                                                {item.situacao && item.situacao.id === 2 && (
                                                                    <FontAwesomeIcon
                                                                        title='remover'
                                                                        icon={faTrashAlt}
                                                                        cursor='pointer'
                                                                        onClick={() => this.remover(item)}
                                                                        style={{ marginLeft: 8, marginRight: 8 }}
                                                                        disabled={this.state.removendo}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            )}
                            {this.state.vazio && <div style={{ paddingLeft: 5 }}>nenhuma liga encontrada...</div>}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const Titulo = () => {
    return (
        <div
            style={{
                display: 'flex',
                color: LayoutParams.colors.corSecundaria,
                backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
            }}
        >
            <div style={{ display: 'table-cell', width: '100%', paddingLeft: 5 }}>
                <span style={{ fontSize: 30, fontWeight: 500, paddingLeft: 6 }}>
                    Gerência de participação nas ligas
                </span>
            </div>
        </div>
    );
};

class Filtro extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: LayoutParams.colors.fundoCinza }}>
                <div style={{ margin: 5, width: 400 }}>
                    <span>Liga</span>
                    <Select
                        getDescription={(i) => i.nome}
                        defaultValue={this.props.getFiltro().liga}
                        getKeyValue={(i) => i.id}
                        onSelect={(i) => {
                            let filtro = this.props.getFiltro();
                            filtro.liga = i;
                            this.props.setFiltro(filtro);
                        }}
                        formularioPadrao={(select) => <Liga api={this.props.api} select={select} />}
                        noDropDown={true}
                        readOnlyColor='#ffff'
                    />
                </div>

                <div style={{ margin: 5 }}>
                    <Card
                        style={{
                            backgroundColor: LayoutParams.colors.fundoCinza,
                            marginTop: 5,
                            paddingLeft: 3,
                            paddingRight: 3,
                        }}
                    >
                        <div
                            style={{
                                marginTop: -10,
                                backgroundColor: LayoutParams.colors.fundoCinza,
                                width: 'fit-content',
                                marginLeft: 2,
                                marginRight: 2,
                            }}
                        >
                            <span>Participação</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div>
                                <CheckBox
                                    defaultChecked={this.props.getFiltro().solicitada}
                                    label='Solicitada'
                                    onChange={(checked) => {
                                        let filtro = this.props.getFiltro();
                                        filtro.solicitada = checked;
                                        this.props.setFiltro(filtro);
                                    }}
                                />
                                <CheckBox
                                    defaultChecked={this.props.getFiltro().participando}
                                    label='Participando'
                                    onChange={(checked) => {
                                        let filtro = this.props.getFiltro();
                                        filtro.participando = checked;
                                        this.props.setFiltro(filtro);
                                    }}
                                />
                            </div>
                            <div style={{ paddingLeft: 2 }}>
                                <CheckBox
                                    defaultChecked={this.props.getFiltro().solicitacaoNegada}
                                    label='Negada'
                                    onChange={(checked) => {
                                        let filtro = this.props.getFiltro();
                                        filtro.solicitacaoNegada = checked;
                                        this.props.setFiltro(filtro);
                                    }}
                                />
                                <CheckBox
                                    defaultChecked={this.props.getFiltro().saiu}
                                    label='Saiu'
                                    onChange={(checked) => {
                                        let filtro = this.props.getFiltro();
                                        filtro.saiu = checked;
                                        this.props.setFiltro(filtro);
                                    }}
                                />
                            </div>
                            <div style={{ paddingLeft: 2 }}>
                                <CheckBox
                                    defaultChecked={this.props.getFiltro().removido}
                                    label='Removido'
                                    onChange={(checked) => {
                                        let filtro = this.props.getFiltro();
                                        filtro.removido = checked;
                                        this.props.setFiltro(filtro);
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div style={{ display: 'table-cell', paddingLeft: 10, paddingRight: 10, paddingTop: 24 }}>
                    <Button variant='secondary' onClick={() => this.props.pesquisar(this.props.getFiltro())}>
                        pesquisar
                    </Button>
                </div>
            </div>
        );
    }
}
