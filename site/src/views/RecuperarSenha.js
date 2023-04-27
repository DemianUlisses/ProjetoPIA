import React, { Component } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Api from '../scripts/Api';
import LogoLogin from './../img/logo-login.png';
import { showError } from '../scripts/Messages';
import { LayoutParams } from '../components/LayoutParams';
import { Link } from 'react-router-dom';

export default class RecuperarSenha extends Component {
    constructor(props) {
        super(props);
        this.api = new Api();
        this.state = {
            senhaRecuperada: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        var form = event.target;

        let nomeDeUsuario = form.elements.nomeDeUsuario.value;

        if (!nomeDeUsuario) {
            showError('Informe o e-mail.');
            return;
        }

        var input = {
            nomeDeUsuario: nomeDeUsuario,
        };

        this.api.post('/login/recover', input).then((result) => {
            this.setState({ senhaRecuperada: true });
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

                    {!this.state.senhaRecuperada && (
                        <Row style={{ justifyContent: 'center' }}>
                            <Col style={{ maxWidth: 400, margin: 'auto 10px auto 0px' }}>
                                <div style={{ color: 'white', fontSize: 35, textAlign: 'center', paddingBottom: 20 }}>
                                    <span>Recuperar senha</span>
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
                                        <Row>
                                            <Col style={{ paddingLeft: 115 }}>
                                                <Button
                                                    style={{
                                                        backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                                                        borderBlockColor: LayoutParams.colors.corSecundaria,
                                                        color: LayoutParams.colors.corSecundaria,
                                                        borderColor: LayoutParams.colors.corSecundaria,
                                                        fontSize: 20,
                                                        boxShadow: 'none',
                                                        width: 130,
                                                    }}
                                                    block
                                                    type='submit'
                                                >
                                                    Recuperar
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {this.state.senhaRecuperada && (
                        <Row style={{ justifyContent: 'center' }}>
                            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                <Col style={{ minWidth: 300, maxWidth: 300, paddingBottom: 5 }}>
                                    <div style={{ color: 'white', fontSize: 16, paddingTop: 5 }}>
                                        Uma nova senha foi enviada para o seu e-mail.
                                    </div>
                                </Col>
                                <Col style={{ maxWidth: 'fit-content' }}>
                                    <Link
                                        to='/'
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
                                                fontSize: 20,
                                                boxShadow: 'none',
                                                width: 130,
                                            }}
                                            block
                                        >
                                            Entrar
                                        </Button>
                                    </Link>
                                </Col>
                            </div>
                        </Row>
                    )}
                </Container>
            </div>
        );
    }
}
