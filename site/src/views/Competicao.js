import React, { Component } from 'react';
import SessionManager from '../scripts/SessionManager';
import { LayoutParams } from '../components/LayoutParams';
import { urlBase } from '../scripts/Api';
import styled from 'styled-components';
import { showConfirm, showError, showInfo } from '../scripts/Messages';
import { Button, Container, Modal } from 'react-bootstrap';
import { faCheck, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleBar from 'simplebar-react';

const ImgRounded = styled.div`
    border-radius: 50%;
    height: 100px;
    width: 100px;
    background-position-x: center;
    background-size: cover;
    background-image: url(${(props) => props.url});
`;

export default class Competicao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ligas: [],
            liga: null,
            mostrandoLiga: false,
            solicitando: false,
            saindo: false,
        };
        this.mostrarLiga = this.mostrarLiga.bind(this);
        this.solicitar = this.solicitar.bind(this);
        this.sair = this.sair.bind(this);
    }

    componentDidMount() {
        try {
            this.props.api.getAll('/participante-liga/ligas-para-participacao').then((result) => {
                this.setState({ ligas: result });
            });
        } catch (error) {
            showError(error);
        }
    }

    mostrarLiga(item) {
        this.setState({ liga: item, mostrandoLiga: true });
    }

    solicitar(item) {
        this.setState({ solicitando: true });
        this.props.api
            .post('/participante-liga/participar', {
                idDaLiga: item.id,
            })
            .then(() => {
                showInfo(
                    'Sua solicitação de participação foi recebida, agora é só aguardar. Quando você for aceito te mandaremos um e-mail.'
                ).then(() => {
                    this.setState({ mostrandoLiga: false });
                });
                this.setState({ solicitando: false });
                this.props.api.getAll('/participante-liga/ligas-para-participacao').then((result) => {
                    this.setState({ ligas: result });
                });
            })
            .catch(() => {
                this.setState({ solicitando: false });
            });
    }

    sair(item) {
        showConfirm(
            'Deseja realmente sair dessa liga?',
            () => {
                this.setState({ saindo: true });
                this.props.api
                    .post('/participante-liga/sair', {
                        idDaLiga: item.id,
                    })
                    .then(() => {
                        showInfo('Você saiu da liga.').then(() => {
                            this.setState({ mostrandoLiga: false });
                        });
                        this.setState({ saindo: false });
                        this.props.api.getAll('/participante-liga/ligas-para-participacao').then((result) => {
                            this.setState({ ligas: result });
                        });
                    })
                    .catch(() => {
                        this.setState({ saindo: false });
                    });
            },
            null,
            'Sim',
            'Não'
        );
    }

    render() {
        return (
            <SimpleBar
                style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    margin: 'auto',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    display: 'flex',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        maxWidth: '90%',
                        justifyContent: 'center',
                        paddingTop: 10,
                        margin: 'auto',
                    }}
                >
                    {this.state.ligas.map((item, index) => {
                        return (
                            <div
                                title={item.descricao}
                                key={index}
                                style={{
                                    margin: 5,
                                    color: LayoutParams.colors.corDoTextoPadrao,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() => this.mostrarLiga(item)}
                            >
                                <ImgRounded alt={item.descricao} url={() => urlBase + '/arquivo/' + item.foto} />
                                <span>{item.nome}</span>
                            </div>
                        );
                    })}

                    {this.state.mostrandoLiga && (
                        <Modal
                            show={this.state.mostrandoLiga}
                            scrollable={true}
                            centered={true}
                            size={'lg'}
                            onHide={() => this.setState({ mostrandoLiga: false })}
                            style={{
                                content: {
                                    maxHeight: 'fit-content',
                                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                },
                            }}
                            dialogClassName='modal-50w'
                        >
                            <Modal.Body
                                style={{
                                    overflow: 'hidden',
                                    display: 'flex',
                                    position: 'relative',
                                    fontSize: 13,
                                    padding: '0 0 0 0',
                                    maxHeight: '100%',
                                    height: 'fit-content',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexWrap: 'wrap',
                                        height: 'fit-content',
                                        width: '100%',
                                        backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                        padding: 8,
                                    }}
                                >
                                    <img
                                        alt={this.state.liga.descricao}
                                        src={urlBase + '/arquivo/' + this.state.liga.foto}
                                        style={{ width: '100%', maxHeight: 400 }}
                                    />
                                    <div>
                                        <span style={{ fontSize: 20, color: LayoutParams.colors.corSecundaria }}>
                                            {this.state.liga.descricao}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: 20, color: LayoutParams.colors.corDoTextoPadrao }}>
                                            {this.state.liga.nome}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            flexDirection: 'row',
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                        }}
                                    >
                                        {this.state.liga.situacao && this.state.liga.situacao.id === 1 && (
                                            <span style={{ fontSize: 20, color: LayoutParams.colors.corDoTextoPadrao }}>
                                                Participação solicitada
                                            </span>
                                        )}

                                        {this.state.liga.situacao && this.state.liga.situacao.id === 5 && (
                                            <span style={{ fontSize: 20, color: LayoutParams.colors.corDoTextoPadrao }}>
                                                Você foi removido.
                                            </span>
                                        )}

                                        {(!this.state.liga.situacao ||
                                            (this.state.liga.situacao &&
                                                (this.state.liga.situacao.id === 0 ||
                                                    this.state.liga.situacao.id === 4 ||
                                                    this.state.liga.situacao.id === 5))) && (
                                            <Button
                                                style={{
                                                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                    borderBlockColor: LayoutParams.colors.corSecundaria,
                                                    color: LayoutParams.colors.corSecundaria,
                                                    borderColor: LayoutParams.colors.corSecundaria,
                                                    fontSize: 18,
                                                    width: '50%',
                                                    margin: 'auto 2px auto auto',
                                                    width: 220,
                                                }}
                                                onClick={this.repetirPalpite}
                                            >
                                                <div
                                                    style={{
                                                        color: LayoutParams.colors.corSecundaria,
                                                        display: 'flex',
                                                    }}
                                                    onClick={() => this.solicitar(this.state.liga)}
                                                    disabled={!this.state.solicitando}
                                                >
                                                    <FontAwesomeIcon
                                                        title='Participar dessa liga'
                                                        icon={faCheckCircle}
                                                        cursor='pointer'
                                                        style={{ fontSize: 20, margin: 'auto auto auto 5px' }}
                                                    />
                                                    <span style={{ margin: 'auto auto auto 5px' }}>
                                                        Participar dessa liga
                                                    </span>
                                                </div>
                                            </Button>
                                        )}

                                        {this.state.liga.situacao && this.state.liga.situacao.id === 2 && (
                                            <Button
                                                style={{
                                                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                    borderBlockColor: LayoutParams.colors.corSecundaria,
                                                    color: LayoutParams.colors.corSecundaria,
                                                    borderColor: LayoutParams.colors.corSecundaria,
                                                    fontSize: 18,
                                                    width: '50%',
                                                    margin: 'auto 2px auto auto',
                                                    width: 200,
                                                }}
                                                onClick={this.palpiteAleatorio}
                                            >
                                                <div
                                                    style={{
                                                        color: LayoutParams.colors.corSecundaria,
                                                        display: 'flex',
                                                    }}
                                                    disabled={!this.state.solicitando}
                                                    onClick={() => this.sair(this.state.liga)}
                                                >
                                                    <FontAwesomeIcon
                                                        title='Sair da liga'
                                                        icon={faTimesCircle}
                                                        onClick={this.palpiteAleatorio}
                                                        cursor='pointer'
                                                        style={{ fontSize: 20, margin: 'auto auto auto 5px' }}
                                                    />
                                                    <span style={{ margin: 'auto auto auto 5px' }}>Sair da liga</span>
                                                </div>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    )}
                </div>
            </SimpleBar>
        );
    }
}
