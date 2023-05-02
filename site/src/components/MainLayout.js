import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import SessionManager from '../scripts/SessionManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import LogoTouro from './../img/touro.svg';
import IconeJogar from './../img/jogar.png';
import IconeDashboard from './../img/dashboard.svg';
import IconeGanhadores from './../img/ganhadores.png';
import IconeCompeticao from './../img/competicao.png';
import { faSignOutAlt, faUserCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { LayoutParams } from './LayoutParams';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { faUser } from '@fortawesome/free-regular-svg-icons';

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
    minHeight: 60,
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
    paddingBottom: 12,
};

const SideMenuIconStyle = {
    textAlign: 'center',
    fontSize: 15,
};

const SideMenuItemContent = {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Arial Rounded MT Bold',
};

const NavigationBarStyle = {
    backgroundColor: corDaBarraSuperior,
    color: corDoTemaPrincipal,
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
            <div className={this.props.className} style={NavigationBarStyle} name={this.props.name}>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                        justifyContent: 'center',
                    }}
                >
                    {/* <div
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
                    </div> */}
                    <Link to={'/'}>
                        <img src={LogoTouro} alt='logo' style={{ height: 130 }} />
                    </Link>
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
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: 35, marginRight: 5 }}>
                            <Link
                                to='/ajuda'
                                title='Ajuda'
                                style={{
                                    color: LayoutParams.colors.corSecundaria,
                                    textDecoration: 'none',
                                }}
                            >
                                <FontAwesomeIcon icon={faQuestionCircle} />
                            </Link>
                        </div>
                        <div>
                            <OverlayTrigger
                                style={{ position: 'relative' }}
                                trigger='click'
                                placement='bottom'
                                rootClose={true}
                                overlay={
                                    <Popover id='popover-basic'>
                                        <Popover.Title>
                                            <div className='noselect'>
                                                {this.state.usuario.primeiroNome
                                                    ? this.state.usuario.primeiroNome
                                                    : this.state.usuario.nomeDeUsuario}
                                            </div>
                                        </Popover.Title>
                                        <Popover.Content
                                            style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
                                        >
                                            <Link
                                                to={'/conta'}
                                                style={{
                                                    color: LayoutParams.colors.corDoTemaPrincipal,
                                                    textDecoration: 'none',
                                                    padding: '5px 5px 5px 8px',
                                                }}
                                            >
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div style={{ paddingRight: 10, fontSize: 25 }}>
                                                        <FontAwesomeIcon icon={faUser} />
                                                    </div>
                                                    <div style={{ display: 'flex' }}>
                                                        <span
                                                            style={{
                                                                fontWeight: this.props.fontWeight,
                                                                margin: 'auto',
                                                            }}
                                                        >
                                                            {'Minha conta'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link
                                                to={'/sair'}
                                                style={{
                                                    color: LayoutParams.colors.corDoTemaPrincipal,
                                                    textDecoration: 'none',
                                                    padding: '5px 5px 5px 8px',
                                                }}
                                            >
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div style={{ paddingRight: 10, fontSize: 25 }}>
                                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                                    </div>
                                                    <div style={{ display: 'flex' }}>
                                                        <span
                                                            style={{
                                                                fontWeight: this.props.fontWeight,
                                                                margin: 'auto',
                                                            }}
                                                        >
                                                            Sair
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Popover.Content>
                                    </Popover>
                                }
                            >
                                <div className='noselect'>
                                    <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: 35 }} />
                                </div>
                            </OverlayTrigger>
                        </div>
                    </div>
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
                <div className='hide-on-mobile' style={{ height: 40 }}></div>
                <div
                    style={{
                        width: '100%',
                        overflowX: 'hidden',
                        overflowY: 'hidden',
                        backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                        margin: 'auto',
                        height: '100%',
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
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={SideMenuIconStyle}>{}</div>
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
                        <div
                            style={{
                                display: 'flex',
                                paddingLeft: this.props.isSubItem ? 12 : 0,
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={SideMenuIconStyle}>{this.props.icone()}</div>
                            <div style={SideMenuItemContent}>
                                <span className='menu-item-description' style={{ fontWeight: this.props.fontWeight }}>
                                    {this.props.descricao}
                                </span>
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
        this.state = {
            showMenu: true,
        };
        this.itensDoMenu = [
            {
                key: 1,
                descricao: 'Jogar',
                icone: () => <img className='menu-item-image' alt='jogar' src={IconeJogar} style={{}} />,
                rota: '/jogar',
                estaHabilitado: true,
            },
            {
                key: 2,
                descricao: 'Dashboard',
                icone: () => <img className='menu-item-image' alt='dashboard' src={IconeDashboard} style={{}} />,
                rota: '/dashboard',
                estaHabilitado: true,
            },
            {
                key: 3,
                descricao: 'Ganhadores',
                icone: () => <img className='menu-item-image' alt='ganhadores' src={IconeGanhadores} style={{}} />,
                rota: '/ganhadores',
                estaHabilitado: true,
            },
            {
                key: 4,
                descricao: 'Competição',
                icone: () => <img className='menu-item-image' alt='competicao' src={IconeCompeticao} style={{}} />,
                rota: '/competicao',
                estaHabilitado: true,
            },
        ];

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        this.setState({ showMenu: !this.state.showMenu });
    }

    render() {
        return (
            <PageStyle
                style={{
                    position: 'fixed',
                    height: '100%',
                    width: '100%',
                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                    color: LayoutParams.colors.corDoTextoPadrao,
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexBasis: '100%',
                            overflow: 'hidden',
                            maxHeight: '100%',
                            padding: '0px 0px 0px 0px',
                        }}
                        className='conteudo-geral'
                    >
                        <NavigationBar
                            name='mobile-nav-bar'
                            className='show-on-mobile-only'
                            toggleMenu={this.toggleMenu}
                        />

                        <SideMenu itensDoMenu={this.itensDoMenu} showMenu={this.state.showMenu} />
                        <ContentStyled>
                            <NavigationBar
                                name='desktop-nav-bar'
                                className='hide-on-mobile'
                                toggleMenu={this.toggleMenu}
                            />

                            <div style={{ overflow: 'auto', width: '100%' }}>{this.props.children}</div>
                        </ContentStyled>
                        <div className='desktop-right-filler'></div>
                    </div>
                </div>
            </PageStyle>
        );
    }
}

const PageStyle = styled.div`
    .conteudo-geral {
        flex-direction: row;
    }

    .menu-item-image {
        width: 90px;
    }

    .desktop-right-filler {
        width: 10%;
    }

    @media screen and (max-width: 600px) {
        .conteudo-geral {
            flex-direction: column;
        }

        .simplebar-content {
            display: flex;
            flex-direction: row;
            justify-content: center;
        }

        .menu-item-image {
            width: 55px;
            margin: 0 10px 0 10px;
        }

        .menu-item-description {
            display: none;
        }
    }
`;

const ContentStyled = styled.div`
    height: 100%;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background-color: ${LayoutParams.colors.corDoTemaPrincipal};
    color: ${LayoutParams.colors.corDoTextoPadrao};
    font-family: 'Arial Rounded MT Bold';

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

    @media screen and (max-width: 600px) {
        padding-top: 10px;
        padding-right: 0px;
        height: 120px;
    }
`;
