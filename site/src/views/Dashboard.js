import React, { Component } from 'react';
import { LayoutParams } from '../components/LayoutParams';
import styled from 'styled-components';
import SimpleBar from 'simplebar-react';
import { urlBase } from '../scripts/Api';

const CARREGANDO = 0;
const CARREGADO = 1;

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusDaTela: CARREGANDO,
            itens: [],
        };
        this.atualizarDashBoard = this.atualizarDashBoard.bind(this);
    }

    componentDidMount() {
        this.atualizarDashBoard();
    }

    atualizarDashBoard() {
        this.setState({ statusDaTela: CARREGANDO });
        this.props.api.getAll('/dashboard/dashboard-jogador', false).then((result) => {
            this.setState({
                itens: result,
                statusDaTela: CARREGADO,
            });
        });
    }

    atualizarCampos() {
        this.setState({ mostrarCampos: false }, () => {
            this.setState({ mostrarCampos: true });
        });
    }

    render() {
        return (
            <StyledContent id='conteudo'>
                {this.state.statusDaTela === CARREGADO ? (
                    <SimpleBar
                        style={{
                            width: '100%',
                            minWidth: 360,
                            maxWidth: 500,
                            margin: 'auto',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 8,
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {this.state.itens.map((item, index) => {
                                return (
                                    <div key={index} style={{ width: '100%', minWidth: 300, maxWidth: 500 }}>
                                        <br />
                                        <span
                                            style={{
                                                fontSize: 25,
                                                fontWeight: 500,
                                                color: LayoutParams.colors.corSecundaria,
                                            }}
                                        >
                                            {item.titulo}
                                        </span>
                                        {item.detalhes && (
                                            <div>
                                                <span style={{ fontSize: 16, fontWeight: 500 }}>{item.detalhes}</span>
                                            </div>
                                        )}
                                        <br />
                                        {item.imagem && (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                    borderRadius: 10,
                                                    marginBottom: 20,
                                                }}
                                            >
                                                <img
                                                    alt=''
                                                    src={urlBase + '/arquivo/' + item.imagem.nome}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
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
