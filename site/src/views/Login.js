import React, { Component } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Api from './../scripts/Api';
import SessionManager from './../scripts/SessionManager';
import LogoLogin from './../img/logo-login.png';
import { showError } from './../scripts/Messages';
import { LayoutParams } from '../components/LayoutParams';
import { Link } from 'react-router-dom';
import { CheckBox } from '../components/CheckBox';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.api = new Api();
        this.state = {
            lembrar: localStorage.getItem('lembrar-login') ? true : false,
            nomeDeUsuario: localStorage.getItem('lembrar-login'),
        };
        this.sessionManager = new SessionManager();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        var form = event.target;

        let nomeDeUsuario = form.elements.nomeDeUsuario.value;
        let senha = form.elements.senha.value;

        if (!nomeDeUsuario) {
            showError('Informe o e-mail.');
            return;
        }

        if (!senha) {
            showError('Informe a senha.');
            return;
        }

        var input = {
            nomeDeUsuario: nomeDeUsuario,
            senha: senha,
        };

        this.api.post('/login/token', input).then((result) => {
            this.sessionManager.setLogin(result);
            localStorage.setItem('lembrar-login', nomeDeUsuario);
            window.location = '/';
        });
    }

    render() {
        return (
            <div
                style={{
                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                    height: '100%',
                    width: '100%',
                    fontFamily: 'Arial Rounded MT Bold',
                    overflowY: 'auto',
                }}
            >
                <Container fluid>
                    <Row>
                        <Col>
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <br />
                                <img alt='' src={LogoLogin} style={{ height: 130, margin: '0 auto 40px auto' }} />
                                <br />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: 'center' }}>
                        <Col style={{ maxWidth: 400, margin: 'auto 10px auto 0px' }}>
                            <div style={{ color: 'white', fontSize: 35, textAlign: 'center', paddingBottom: 20 }}>
                                <span>Login</span>
                            </div>
                            <div>
                                <Form onSubmit={this.handleSubmit} action='#' id='formLogin'>
                                    <Form.Group as={Row}>
                                        <Form.Label column style={{ color: 'white', fontSize: 20, maxWidth: 100 }}>
                                            E-mail
                                        </Form.Label>
                                        <Col>
                                            <Form.Control
                                                type='text'
                                                name='nomeDeUsuario'
                                                defaultValue={this.state.nomeDeUsuario}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column style={{ color: 'white', fontSize: 20, maxWidth: 100 }}>
                                            Senha
                                        </Form.Label>
                                        <Col>
                                            <Form.Control type='password' name='senha' />
                                        </Col>
                                    </Form.Group>
                                    <Row>
                                        <Col>
                                            <Form.Group as={Row}>
                                                <Form.Label
                                                    column
                                                    style={{ color: 'white', fontSize: 20, maxWidth: 100 }}
                                                >
                                                    Lembrar
                                                </Form.Label>

                                                <CheckBox
                                                    title='Lembrar'
                                                    style={{
                                                        transform: 'scale(2)',
                                                        color: 'white',
                                                        fontSize: 20,
                                                        maxWidth: 120,
                                                        margin: '16px 0px 0px 22px',
                                                    }}
                                                    defaultChecked={this.state.lembrar}
                                                    onChange={(checked) => {
                                                        this.setState({ lembrar: checked });
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col style={{ maxWidth: 'fit-content' }}>
                                            <Button
                                                style={{
                                                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                    borderBlockColor: LayoutParams.colors.corSecundaria,
                                                    color: LayoutParams.colors.corSecundaria,
                                                    borderColor: LayoutParams.colors.corSecundaria,
                                                    fontSize: 20,
                                                    boxShadow: 'none',
                                                    width: 120,
                                                }}
                                                block
                                                type='submit'
                                            >
                                                Entrar
                                            </Button>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col style={{maxWidth: 98}}>
                                            <Form.Group as={Row}>
                                                <Form.Label
                                                    column
                                                    style={{ color: 'white', fontSize: 20, maxWidth: 100 }}
                                                ></Form.Label>
                                            </Form.Group>
                                        </Col>
                                        <Col style={{  }}>
                                            <Link
                                                to={'/recuperarsenha'}
                                                style={{
                                                    color: LayoutParams.colors.corDoTemaPrincipal,
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <span style={{ color: LayoutParams.colors.corSecundaria }}>
                                                    Esqueci a senha
                                                </span>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>

                        <Col
                            className='hide-on-mobile'
                            style={{ maxWidth: 50, justifyContent: 'center', paddingRight: '0' }}
                        >
                            <div
                                style={{
                                    width: 10,
                                    height: 350,
                                    backgroundColor: LayoutParams.colors.corSecundaria,
                                    borderRadius: 5,
                                    margin: 'auto 0px auto auto',
                                }}
                            ></div>
                        </Col>
                        <Col className='' style={{ maxWidth: 400 }}>
                            <hr
                                className='show-on-mobile-only'
                                style={{
                                    backgroundColor: LayoutParams.colors.corSecundaria,
                                    borderRadius: 5,
                                    margin: '10px 0px 10px 0px',
                                    height: 10,
                                }}
                            />

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    verticalAlign: 'middle',
                                    height: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'table-cell',
                                        margin: 'auto',
                                        flexGrow: 1,
                                        color: LayoutParams.colors.corSecundaria,
                                        fontSize: 50,
                                        textAlign: 'center',
                                    }}
                                >
                                    <span>ou</span>
                                </div>
                                <div
                                    style={{
                                        display: 'table-cell',
                                        margin: 'auto',
                                        flexGrow: 1,
                                    }}
                                >
                                    <Link
                                        to={'/cadastro'}
                                        style={{
                                            color: LayoutParams.colors.corDoTemaPrincipal,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Button
                                            style={{
                                                backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                borderBlockColor: LayoutParams.colors.corSecundaria,
                                                color: LayoutParams.colors.corSecundaria,
                                                borderColor: LayoutParams.colors.corSecundaria,
                                                fontSize: 35,
                                                boxShadow: 'none',
                                            }}
                                            block
                                            type='submit'
                                        >
                                            Cadastre-se
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
