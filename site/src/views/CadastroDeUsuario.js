import React, { Component } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Api from '../scripts/Api';
import LogoLogin from './../img/logo-login.png';
import { showError } from '../scripts/Messages';
import { LayoutParams } from '../components/LayoutParams';
import { TelefoneCelularInput } from '../components/TelefoneCelularInput';

export default class CadastroDeUsuario extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.api = new Api();
        this.criar = this.criar.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    criar() {
        let input = {
            nome: this.state.nome,
            email: this.state.email,
            celular: this.state.celular,
            senha: this.state.senha,
            confirmacaoDaSenha: this.state.confirmacaoDaSenha,
        };

        if (!input.nome) {
            showError('Informe o seu nome.');
            return;
        }

        if (!input.email) {
            showError('Informe o seu e-mail.');
            return;
        }

        if (!input.celular) {
            showError('Informe o seu celular.');
            return;
        }

        if (!input.senha) {
            showError('Informe a senha.');
            return;
        }

        if (!input.confirmacaoDaSenha) {
            showError('Repita a senha.');
            return;
        }

        if (input.senha !== input.confirmacaoDaSenha) {
            showError('As senhas não conferem.');
            return;
        }

        this.api.post('/jogador/cadastroweb', input).then(() => {
            window.location = '/';
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.criar();
    }

    render() {
        return (
            <div
                style={{
                    backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
                    height: '100%',
                    width: '100%',
                    fontFamily: 'Arial Rounded MT Bold',
                    color: 'white',
                    overflowY: 'auto' 
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
                    <Row style={{ justifyContent: 'center', height: '100%' }}>
                        <Col className='' style={{ maxWidth: 350 }}>
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
                                        fontSize: 40,
                                        textAlign: 'center',
                                    }}
                                >
                                    <span>Crie seu perfil</span>
                                </div>
                            </div>
                        </Col>

                        <Col
                            className='hide-on-mobile'
                            style={{ maxWidth: 80, justifyContent: 'center', paddingRight: '0', paddingLeft: '0' }}
                        >
                            <div
                                style={{
                                    width: 10,
                                    height: '100%',
                                    backgroundColor: LayoutParams.colors.corSecundaria,
                                    borderRadius: 5,
                                    margin: 'auto',
                                }}
                            ></div>
                        </Col>

                        <Col>
                            <div>
                                <Form onSubmit={this.handleSubmit} action='#' id='formLogin'>
                                    <br />
                                    <Form.Group as={Row}>
                                        <Form.Label column sm='2'>
                                            Nome
                                        </Form.Label>
                                        <Col sm='10'>
                                            <Form.Control
                                                style={{ minWidth: 300, maxWidth: 350 }}
                                                onChange={(e) => this.setState({ nome: e.target.value })}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm='2'>
                                            E-mail
                                        </Form.Label>
                                        <Col sm='10'>
                                            <Form.Control
                                                style={{ maxWidth: 350 }}
                                                onChange={(e) => this.setState({ email: e.target.value })}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm='2'>
                                            Celular
                                        </Form.Label>
                                        <Col sm='10'>
                                            <TelefoneCelularInput
                                                style={{ maxWidth: 200 }}
                                                onChange={(value) => this.setState({ celular: value })}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm='2'>
                                            Senha
                                        </Form.Label>
                                        <Col sm='10'>
                                            <Form.Control
                                                type='password'
                                                style={{ maxWidth: 200 }}
                                                onChange={(e) => this.setState({ senha: e.target.value })}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm='2'>
                                            Repita a senha
                                        </Form.Label>
                                        <Col sm='10'>
                                            <Form.Control
                                                type='password'
                                                style={{ maxWidth: 200 }}
                                                onChange={(e) => this.setState({ confirmacaoDaSenha: e.target.value })}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm='2'></Form.Label>
                                        <Col sm='10'>
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
                                                CRIAR
                                            </Button>
                                        </Col>
                                    </Form.Group>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            // <div
            //     style={{
            //         backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
            //         height: '100%',
            //         width: '100%',
            //         position: 'fixed',
            //         fontFamily: 'Arial Rounded MT Bold',
            //     }}
            // >
            //     <div style={{ width: '100%', textAlign: 'center' }}>
            //         <br />
            //         <img alt='' src={LogoLogin} style={{ height: 200, margin: '0 auto 10px auto' }} />
            //         <br />
            //     </div>
            //     <div
            //         style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', verticalAlign: 'middle' }}
            //     >
            //         <div
            //             style={{
            //                 display: 'table-cell',
            //                 margin: 'auto',
            //                 flexGrow: 1,
            //             }}
            //         >
            //             <div
            //                 style={{
            //                     display: 'flex',
            //                     flexDirection: 'row',
            //                     justifyContent: 'center',
            //                     verticalAlign: 'middle',
            //                     paddingLeft: 10,
            //                     maxWidth: 400,
            //                 }}
            //             >
            //                 <div
            //                     style={{
            //                         display: 'table-cell',
            //                         margin: 'auto',
            //                         flexGrow: 1,
            //                         color: LayoutParams.colors.corSecundaria,
            //                         fontSize: 40,
            //                         fontWeight: 500,
            //                         textAlign: 'center',
            //                     }}
            //                 >
            //                     <span>Crie seu perfil</span>
            //                 </div>
            //             </div>
            //         </div>

            //         <div
            //             style={{
            //                 display: 'table-cell',
            //                 minWidth: 10,
            //                 minHeight: 400,
            //                 backgroundColor: LayoutParams.colors.corSecundaria,
            //                 borderRadius: 5,
            //             }}
            //         />

            //         <div style={{ display: 'table-cell', flexGrow: 2, margin: 'auto' }}>
            //             <Container
            //                 style={{
            //                     fontSize: 15,
            //                     height: '100%',
            //                     backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
            //                 }}
            //             >
            //                 <Row>
            //                     <Col
            //                         style={{
            //                             color: 'white',
            //                         }}
            //                     >
            //                         <div className='justify-content-md-center'>
            //                             <div>
            //                                 <Form.Group as={Row}>
            //                                     <Form.Label column sm='2'>
            //                                         Nome
            //                                     </Form.Label>
            //                                     <Col sm='10'>
            //                                         <Form.Control
            //                                             style={{ width: 350 }}
            //                                             onChange={(e) => this.setState({ nome: e.target.value })}
            //                                         />
            //                                     </Col>
            //                                 </Form.Group>

            //                                 <Form.Group as={Row}>
            //                                     <Form.Label column sm='2'>
            //                                         E-mail
            //                                     </Form.Label>
            //                                     <Col sm='10'>
            //                                         <Form.Control
            //                                             style={{ width: 350 }}
            //                                             onChange={(e) => this.setState({ email: e.target.value })}
            //                                         />
            //                                     </Col>
            //                                 </Form.Group>

            //                                 <Form.Group as={Row}>
            //                                     <Form.Label column sm='2'>
            //                                         Celular
            //                                     </Form.Label>
            //                                     <Col sm='10'>
            //                                         <TelefoneCelularInput
            //                                             style={{ width: 200 }}
            //                                             onChange={(value) => this.setState({ celular: value })}
            //                                         />
            //                                     </Col>
            //                                 </Form.Group>

            //                                 <Form.Group as={Row}>
            //                                     <Form.Label column sm='2'>
            //                                         Senha
            //                                     </Form.Label>
            //                                     <Col sm='10'>
            //                                         <Form.Control
            //                                             type='password'
            //                                             style={{ width: 200 }}
            //                                             onChange={(e) => this.setState({ senha: e.target.value })}
            //                                         />
            //                                     </Col>
            //                                 </Form.Group>

            //                                 <Form.Group as={Row}>
            //                                     <Form.Label column sm='2'>
            //                                         Repita a senha
            //                                     </Form.Label>
            //                                     <Col sm='10'>
            //                                         <Form.Control
            //                                             type='password'
            //                                             style={{ width: 200 }}
            //                                             onChange={(e) =>
            //                                                 this.setState({ confirmacaoDaSenha: e.target.value })
            //                                             }
            //                                         />
            //                                     </Col>
            //                                 </Form.Group>

            //                                 <Form.Group as={Row}>
            //                                     <Form.Label column sm='2'></Form.Label>
            //                                     <Col sm='10'>
            //                                         <Button
            //                                             style={{
            //                                                 backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
            //                                                 borderBlockColor: LayoutParams.colors.corSecundaria,
            //                                                 color: LayoutParams.colors.corSecundaria,
            //                                                 borderColor: LayoutParams.colors.corSecundaria,
            //                                                 fontSize: 16,
            //                                                 width: 130,
            //                                                 boxShadow: 'none',
            //                                             }}
            //                                             block
            //                                             onClick={this.criar}
            //                                         >
            //                                             criar
            //                                         </Button>
            //                                     </Col>
            //                                 </Form.Group>
            //                             </div>
            //                         </div>
            //                     </Col>
            //                 </Row>
            //             </Container>
            //         </div>
            //     </div>
            // </div>
        );
    }
}
