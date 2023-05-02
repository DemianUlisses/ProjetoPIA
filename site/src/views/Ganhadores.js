import React, { Component } from 'react';
import SessionManager from '../scripts/SessionManager';
import { LayoutParams } from '../components/LayoutParams';
import Api from '../scripts/Api';
import { dateToString } from '../scripts/Utils';
import { showConfirm, showError, showInfo } from '../scripts/Messages';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import styled from 'styled-components';
import SimpleBar from 'simplebar-react';
import { urlBase } from '../scripts/Api';

const CARREGANDO = 0;
const CARREGADO = 1;

export default class Ganhadores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semanaSelecionada: null,
            semanas: [],
            ganhadores: null,
            statusDaTela: CARREGANDO,
        };
        this.consultarGanhadores = this.consultarGanhadores.bind(this);
    }

    componentDidMount() {
        this.props.api.getAll('/ganhadores/combos-para-consulta-de-ganhadores').then((result) => {
            this.setState({
                semanas: result.semanas,
                semanaSelecionada: result.ultimaSemana,
                ganhadores: result.ganhadoresDaUltimaSemana,
                statusDaTela: CARREGADO,
            });
        });
    }

    consultarGanhadores(id) {
        this.setState({ statusDaTela: CARREGANDO });
        this.props.api.get('/ganhadores/ganhadores-jogador/' + id).then((result) => {
            this.setState({
                ganhadores: result,
                statusDaTela: CARREGADO,
            });
        });
    }
 
    render() {
        let idDaSemanaSelecionada =
            this.state.statusDaTela === CARREGADO && this.state.semanaSelecionada
                ? this.state.semanaSelecionada.id.toString()
                : null;
        let menuItens = Menu(this.state.semanas, idDaSemanaSelecionada);
        let item = this.state.ganhadores;
        return (
            <StyledContent id='conteudo'>
                {this.state.statusDaTela === CARREGADO && (
                    <ScrollMenu
                        data={menuItens}
                        arrowLeft={ArrowLeft}
                        arrowRight={ArrowRight}
                        selected={idDaSemanaSelecionada}
                        onSelect={(id) => {
                            id = parseInt(id);
                            let semana = this.state.semanas.filter((i) => i.id === id)[0];
                            this.setState({
                                idDaSemanaSelecionada: semana.id,
                                semanaSelecionada: semana,
                                podeAlterarPalpite: !semana.semanaJaPassou,
                            });
                            this.consultarGanhadores(id);
                            console.log(semana);
                        }}
                        menuStyle={{
                            width: 300,
                            margin: 'auto',
                        }}
                        scrollToSelected={true}
                        wheel={false}
                        arrowDisabledClass='scroll-menu-arrow--disabled'
                        disableTabindex={true}
                        clickWhenDrag={false}
                        dragging={false}
                        hideSingleArrow={true}
                        onUpdate={(a, b) => {
                            console.log(a, b);
                            //this.setState({ semanaSelecionada: null, palpiteNaSemanaAtiva: null });
                        }}
                        alignOnResize={false}
                        scrollBy={1}
                    />
                )}

                {this.state.statusDaTela === CARREGADO && item ? (
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
                            <div style={{ width: '100%', minWidth: 300, maxWidth: 500 }}>
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
                        </div>
                    </SimpleBar>
                ) : (
                    <div />
                )}
            </StyledContent>
        );
    }
}

const MenuItem = ({ text, selected }) => {
    return <div className={`menu-item ${selected ? '' : ''}`}>{text}</div>;
};

const Menu = (list, selected) =>
    list.map((item) => {
        return (
            <MenuItem
                text={
                    <div
                        style={{
                            fontSize: 30,
                            color: LayoutParams.colors.corSecundaria,
                            width: 208,
                            textAlign: 'center',
                        }}
                    >
                        <span>{item.nome}</span>
                        <div style={{ fontSize: 15, margin: '-5px auto auto -5px' }}>
                            <span>&nbsp;{dateToString(item.dataIncialDaApuracao)}</span>
                            <span>&nbsp;até</span>
                            <span>&nbsp;{dateToString(item.dataFinalDaApuracao)}</span>
                        </div>
                    </div>
                }
                key={item.id}
                selected={selected}
            />
        );
    });

const Arrow = ({ text, className }) => {
    return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: <span>{'<'}</span>, className: 'arrow-prev' });
const ArrowRight = Arrow({ text: <span>{'>'}</span>, className: 'arrow-next' });

const StyledContent = styled.div`
    overflow: hidden;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;

    .arrow-prev,
    .arrow-next {
        color: ${LayoutParams.colors.corSecundaria};
        font-size: 22px;
        padding: 15px;
        cursor: pointer;
    }

    .scroll-menu-arrow--disabled span {
        color: gray !important;
    }
`;
