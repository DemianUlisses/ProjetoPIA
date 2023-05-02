import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import SessionManager from '../scripts/SessionManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import LogoHome from './../img/logo-home.png';
import {
    faUser,
    faUserCog,
    faUsers,
    faHome,
    faSignOutAlt,
    faCogs,
    faListAlt,
    faCalendarDay,
    faUserCircle,
    faChartLine,
    faBars,
    faDollarSign,
    faDiceFive,
    faUniversity,
} from '@fortawesome/free-solid-svg-icons';
import { LayoutParams } from './LayoutParams';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

let corDoTemaPrincipal = LayoutParams.colors.corDoTemaPrincipal;
let corDaBarraSuperior = '#ffff';
let botaoPrimary = {
    normal: { color: '', backgroundColor: '', borderColor: '' },
    hover: { color: '', backgroundColor: '', borderColor: '' },
    focus: { color: '', backgroundColor: '', borderColor: '' },
};
let botaoSecondary = {
    normal: { color: '', backgroundColor: '', borderColor: '' },
    hover: { color: '', backgroundColor: '', borderColor: '' },
    focus: { color: '', backgroundColor: '', borderColor: '' },
};

const SideMenuItemStyle = {
    display: 'inherit',
    minHeight: 30,
    fontSize: 13,
};

const SideMenuItemStyleHovered = {
    display: 'inherit',
    minHeight: 30,
    fontSize: 13,
};

const SideMenuGroupStyle = {
    padding: 0,
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    minHeight: 30,
    cursor: 'pointer',
    fontSize: 'inherit',
    width: '100%',
    textAlign: 'left',
    outline: 'transparent',
    boxShadow: 'none',
};

const SideMenuLinkStyle = {
    paddingTop: 4,
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    minHeight: 30,
    cursor: 'pointer',
    fontSize: 'inherit',
};

const SideMenuIconStyle = {
    textAlign: 'center',
    width: 40,
    fontSize: 15,
};

const SideMenuItemContent = {};

const NavigationBarStyle = {
    backgroundColor: corDaBarraSuperior,
    color: corDoTemaPrincipal,
    margin: 'auto',
    width: '100%',
    overflow: 'hiden',
    display: 'flex',
    flexDirection: 'row',
};

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        let sessionManager = new SessionManager();
        this.state = {
            usuario: sessionManager.getLogin(),
        };
    }

    render() {
        return (
            <div className='hide-on-print' style={NavigationBarStyle}>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        borderBottom: '1px solid ' + LayoutParams.colors.corSecundaria,
                        backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                    }}
                >
                    <div
                        style={{
                            color: 'white',
                            fontSize: 30,
                            lineHeight: 1,
                            textAlign: 'center',
                            cursor: 'pointer',
                            zIndex: 0,
                            width: 70,
                        }}
                    >
                        <div style={{ height: '100%', paddingTop: 10 }}>
                            <FontAwesomeIcon icon={faBars} onClick={this.props.toggleMenu} />
                        </div>
                    </div>
                    <img src={LogoHome} alt='logo' />
                </div>
                <div
                    style={{
                        position: 'fixed',
                        top: 6,
                        right: 6,
                        color: LayoutParams.colors.corSecundaria,
                        fontSize: 12,
                        lineHeight: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <OverlayTrigger
                        style={{ position: 'relative' }}
                        trigger='click'
                        placement='bottom'
                        rootClose={true}
                        overlay={
                            <Popover id='popover-basic'>
                                <Popover.Content>
                                    <Link
                                        to={'/sair'}
                                        style={{
                                            color: LayoutParams.colors.corDoTemaPrincipal,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <div style={{ display: 'inline-flex' }}>
                                            <div style={{ paddingRight: 10 }}>
                                                <FontAwesomeIcon icon={faSignOutAlt} />
                                            </div>
                                            <div style={{}}>
                                                <span style={{ fontWeight: this.props.fontWeight }}>{'Sair'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </Popover.Content>
                            </Popover>
                        }
                    >
                        <div className='noselect'>
                            <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: 25 }} />
                            <div>
                                {this.state.usuario.primeiroNome
                                    ? this.state.usuario.primeiroNome
                                    : this.state.usuario.nomeDeUsuario}
                            </div>
                        </div>
                    </OverlayTrigger>
                </div>
            </div>
        );
    }
}

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSideMenuItemStyleHovered: false,
        };
    }

    render() {
        return (
            <SideMenuStyled className='hide-on-print' showMenu={this.props.showMenu} id='sideMenuStyled'>
                <div
                    style={{
                        width: '100%',
                        overflowX: 'hidden',
                        overflowY: 'hidden',
                        backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                    }}
                >
                    <SimpleBar style={{ maxHeight: '100%' }}>
                        {this.props.itensDoMenu.map((item, index) => {
                            if (!item.estaHabilitado) {
                                return null;
                            } else if (item.subMenu) {
                                return (
                                    <React.Fragment key={index}>
                                        <SideMenuItem
                                            icone={item.icone}
                                            descricao={item.descricao}
                                            rota={null}
                                            isGrupo={true}
                                            subMenu={item.subMenu}
                                            fontWeight={item.fontWeight}
                                        />
                                    </React.Fragment>
                                );
                            } else {
                                return (
                                    <SideMenuItem
                                        key={index}
                                        icone={item.icone}
                                        descricao={item.descricao}
                                        rota={item.rota}
                                        isGrupo={false}
                                        fontWeight={item.fontWeight}
                                    />
                                );
                            }
                        })}
                    </SimpleBar>
                </div>
            </SideMenuStyled>
        );
    }
}

class SideMenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSideMenuItemStyleHovered: false,
            isColapsed: true,
        };
    }

    render() {
        return (
            <div
                style={this.state.isSideMenuItemStyleHovered ? SideMenuItemStyleHovered : SideMenuItemStyle}
                onMouseEnter={() => this.setState({ isSideMenuItemStyleHovered: true })}
                onMouseLeave={() => this.setState({ isSideMenuItemStyleHovered: false })}
                className='side-menu-item'
            >
                {this.props.isGrupo ? (
                    <div>
                        <Button
                            variant='link'
                            style={SideMenuGroupStyle}
                            onClick={() => this.setState({ isColapsed: !this.state.isColapsed })}
                        >
                            <div style={{ display: 'inline-flex' }}>
                                <div style={SideMenuIconStyle}>
                                    <FontAwesomeIcon icon={this.props.icone} />
                                </div>
                                <div style={SideMenuItemContent}>
                                    <span style={{ fontWeight: this.props.fontWeight }}>{this.props.descricao}</span>
                                </div>
                            </div>
                        </Button>
                        {!this.state.isColapsed &&
                            this.props.subMenu &&
                            this.props.subMenu.map((submenu) => {
                                return submenu.estaHabilitado ? (
                                    <SideMenuItem
                                        key={submenu.key}
                                        icone={submenu.icone}
                                        descricao={submenu.descricao}
                                        rota={submenu.rota}
                                        isSubItem={true}
                                    />
                                ) : null;
                            })}
                    </div>
                ) : (
                    <Link to={this.props.rota} style={SideMenuLinkStyle}>
                        <div style={{ display: 'inline-flex', paddingLeft: this.props.isSubItem ? 12 : 0 }}>
                            <div style={SideMenuIconStyle}>
                                <FontAwesomeIcon icon={this.props.icone} />
                            </div>
                            <div style={SideMenuItemContent}>
                                <span style={{ fontWeight: this.props.fontWeight }}>{this.props.descricao}</span>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        );
    }
}

export default class MainLayout extends Component {
    constructor(props) {
        super(props);
        let sessionManager = new SessionManager();
        this.state = {
            showMenu: true,
        };
        this.itensDoMenu = [
            { key: 10, descricao: 'INÍCIO', icone: faHome, fontWeight: 500, rota: '/', estaHabilitado: true },
            {
                key: 20,
                descricao: 'CADASTRO',
                icone: faListAlt,
                fontWeight: 500,
                rota: null,
                estaHabilitado: true,
                subMenu: [
                    {
                        key: 2013,
                        descricao: 'Ações',
                        icone: faChartLine,
                        rota: '/acao',
                        estaHabilitado: sessionManager.temAcessoARotina(2013),
                    },
                    {
                        key: 3003,
                        descricao: 'Jogadores',
                        icone: faUsers,
                        rota: '/jogadores',
                        estaHabilitado: sessionManager.temAcessoARotina(3003),
                    },

                    {
                        key: 2913,
                        descricao: 'Ligas',
                        icone: faUsers,
                        rota: '/ligas',
                        estaHabilitado: sessionManager.temAcessoARotina(2913),
                    },
                    
                    {
                        key: 23,
                        descricao: 'Perfil de Usuário',
                        icone: faUserCog,
                        rota: '/perfilusuario',
                        estaHabilitado: sessionManager.temAcessoARotina(23),
                    },

                    {
                        key: 4,
                        descricao: 'Usuários',
                        icone: faUser,
                        rota: '/usuarios',
                        estaHabilitado: sessionManager.temAcessoARotina(4),
                    },
                ],
            },
            {
                key: 50,
                descricao: 'JOGO',
                icone: faDiceFive,
                fontWeight: 500,
                rota: null,
                estaHabilitado: true,
                subMenu: [
					{
                        key: 2113,
                        descricao: 'Semanas',
                        icone: faCalendarAlt,
                        rota: '/semanas',
                        estaHabilitado: sessionManager.temAcessoARotina(2113),
					},
					{
                        key: 2613,
                        descricao: 'Ganhadores',
                        icone: faDollarSign,
                        rota: '/ganhadores',
                        estaHabilitado: sessionManager.temAcessoARotina(2613),
                    },
                    {
                        key: 2413,
                        descricao: 'Dashboard',
                        icone: faChartLine,
                        rota: '/dashboard',
                        estaHabilitado: sessionManager.temAcessoARotina(2413),
                    },

                    {
                        key: 3105,
                        descricao: 'Gerenciar ligas',
                        icone: faUsers,
                        rota: '/gerenciarligas',
                        estaHabilitado: sessionManager.temAcessoARotina(3105),
                    },
                ],
            },

            {
                key: 50,
                descricao: 'CONFIGURAÇÕES',
                icone: faCogs,
                fontWeight: 500,
                rota: null,
                estaHabilitado: true,
                subMenu: [
                    {
                        key: 7000,
                        descricao: 'Parâmetros Gerais',
                        icone: faCogs,
                        rota: '/parametros',
                        estaHabilitado: sessionManager.temAcessoARotina(7000),
                    },
                    {
                        key: 2513,
                        descricao: 'Feriados',
                        icone: faCalendarDay,
                        rota: '/feriado',
                        estaHabilitado: sessionManager.temAcessoARotina(2513),
                    },
                    {
                        key: 2713,
                        descricao: 'Bancos',
                        icone: faUniversity,
                        rota: '/banco',
                        estaHabilitado: sessionManager.temAcessoARotina(2713),
                    },
                ],
            },
        ];

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        this.setState({ showMenu: !this.state.showMenu });
    }

    render() {
        return (
            <PageStyle style={{ position: 'fixed', height: '100%', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <NavigationBar toggleMenu={this.toggleMenu} />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexBasis: '100%',
                            overflow: 'hidden',
                            maxHeight: '100%',
                            padding: '0px 0px 0px 0px',
                        }}
                    >
                        <SideMenu itensDoMenu={this.itensDoMenu} showMenu={this.state.showMenu} />
                        <ContentStyled>
                            <div style={{ overflow: 'auto', width: '100%' }}>{this.props.children}</div>
                        </ContentStyled>
                    </div>
                </div>
            </PageStyle>
        );
    }
}

const PageStyle = styled.div``;

const ContentStyled = styled.div`
    height: 100%;
    width: 100%;
    overflow-y: auto;
    display: flex;

    font-size: 13px;

    .btn-primary {
        color: ${botaoPrimary.normal.color} !important;
        background-color: ${botaoPrimary.normal.backgroundColor} !important;
        border-color: ${botaoPrimary.normal.borderColor} !important;
    }

    .btn-secondary {
        color: ${botaoSecondary.normal.color} !important;
        background-color: ${botaoSecondary.normal.backgroundColor} !important;
        border-color: ${botaoSecondary.normal.borderColor} !important;
    }
`;

const SideMenuStyled = styled.div`
    color: ${LayoutParams.colors.corSecundaria};
    display: ${(props) => (props.showMenu ? 'flex' : 'none')};
    flex-direction: column;
    min-width: 200px;
    background-color: ${LayoutParams.colors.corDoTemaPrincipal};
    overflow-y: hidden;
    overflow-x: hidden;
    padding-right: 10px;
    max-height: '100%';
    margin-bottom: 10px;
`;
