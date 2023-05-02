import { Row, Col, Form, FormGroup, Container, Button } from 'react-bootstrap';
import React, { Component } from 'react';
import { urlBase } from '../scripts/Api';
import styled from 'styled-components';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CpfInput } from '../components/CpfInput';
import { Select } from '../components/Select';
import { showConfirm, showInfo } from '../scripts/Messages';
import Banco from './Banco';
import { LayoutParams } from '../components/LayoutParams';

const ImgRounded = styled.div`
    border-radius: 50%;
    height: 100px;
    width: 100px;
    background-position-x: center;
    background-size: cover;
    background-image: url(${(props) => props.url});
`;

const ImgNone = styled.div`
    object-fit: cover;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    font-size: 110px;
    line-height: 0px;

    i {
        text-decoration: none;
        color: #888;
    }
`;

export default class Conta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemSelecionado: null,
            comboBancos: [],
        };
        this.salvar = this.salvar.bind(this);
    }

    componentDidMount() {
        this.props.api.get('/conta/combos').then((result) => {
            this.setState({ itemSelecionado: result.jogador, comboBancos: result.bancos });
        });
    }

    onImageChange(event) {
        var self = this;
        var tg = event.target;
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            var fileReader = new FileReader();
            fileReader.addEventListener(
                'load',
                function () {
                    var input = {
                        tipo: file.type,
                        base64: fileReader.result,
                    };

                    self.props.api.post('/arquivo', input).then((result) => {
                        self.state.itemSelecionado.foto = {
                            id: result.id,
                            nome: result.nome,
                        };
                        self.setState({ itemSelecionado: self.state.itemSelecionado });
                        tg.value = null;
                    });
                },
                false
            );
            fileReader.readAsDataURL(file);
        }
    }

    onExcluirFotoClick(event) {
        var self = this;
        var tg = event.target;
        showConfirm('Deseja realmente excluir a foto?', () => {
            self.state.itemSelecionado.foto = {};
            self.setState({ itemSelecionado: self.state.itemSelecionado });
            tg.value = null;
        });
    }

    salvar() {
        let item = this.state.itemSelecionado;

        let input = {
            cpf: item.cpf,
            nomeCompleto: item.nomeCompleto,
            banco : item.banco ? item.banco.id : null,
            agenciaDaContaCorrente: item.agenciaDaContaCorrente,
            numeroDaContaCorrente: item.numeroDaContaCorrente,
            digitoDaContaCorrente: item.digitoDaContaCorrente,
            tipoDeConta: item.tipoDeConta ? item.tipoDeConta.id : null
        };

        this.props.api.put('/conta', input)
        .then(() => {
            showInfo("Dados atualizados com sucesso!")
            .then(() => {
                window.location = '/';
            });
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
                    color: 'white',
                    overflowY: 'auto',
                }}
            >
                {this.state.itemSelecionado && (
                    <Container
                        style={{
                            maxWidth: 500,
                            margin: 'auto',
                        }}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Nome</Form.Label>
                                            <Form.Control
                                                type='text'
                                                defaultValue={this.state.itemSelecionado.nomeCompleto}
                                                onChange={(e) => {
                                                    this.state.itemSelecionado.nomeCompleto = e.target.value;
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>

                            <Col style={{ textAlign: 'right', maxWidth: 150, marginLeft: -20 }}>
                                <Form.Label
                                    style={{ cursor: 'pointer' }}
                                    title={
                                        this.state.itemSelecionado.foto && this.state.itemSelecionado.foto.nome
                                            ? 'alterar foto'
                                            : 'carregar foto'
                                    }
                                >
                                    <Form.File
                                        accept={'image/png, image/jpeg'}
                                        onChange={(e) => this.onImageChange(e, this)}
                                        style={{ position: 'absolute', top: -1000 }}
                                        tabIndex={-1}
                                    ></Form.File>
                                    {this.state.itemSelecionado.foto && this.state.itemSelecionado.foto.nome ? (
                                        <ImgRounded
                                            alt=''
                                            url={() => urlBase + '/arquivo/' + this.state.itemSelecionado.foto.nome}
                                        ></ImgRounded>
                                    ) : (
                                        <ImgNone alt=''>
                                            <FontAwesomeIcon icon={faUserCircle} />
                                        </ImgNone>
                                    )}
                                </Form.Label>
                                {this.state.itemSelecionado.foto && this.state.itemSelecionado.foto.nome && (
                                    <div
                                        style={{
                                            color: 'initial',
                                            position: 'absolute',
                                            right: 20,
                                            top: 95,
                                            fontSize: 20,
                                            cursor: 'pointer',
                                        }}
                                        title='excluir foto'
                                        onClick={(e) => this.onExcluirFotoClick(e, this)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </div>
                                )}
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6} md={6} lg={6}>
                                <Form.Group>
                                    <Form.Label>CPF</Form.Label>
                                    <CpfInput
                                        defaultValue={this.state.itemSelecionado.cpf}
                                        onChange={(value) => {
                                            this.state.itemSelecionado.cpf = value.formattedValue;
                                        }}                                        
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6} md={6} lg={6}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control defaultValue={this.state.itemSelecionado.email} readOnly={true} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <span style={{ fontWeight: 500 }}>Dados bancários: </span>
                        <Row>
                            <Col xs={12} style={{}}>
                                <Form.Group>
                                    <Form.Label>Banco</Form.Label>
                                    <Select
                                        name='bancos'
                                        defaultValue={
                                            this.state.itemSelecionado.banco ? this.state.itemSelecionado.banco.id : 0
                                        }
                                        options={this.state.comboBancos}
                                        getDescription={(i) => i.nome}
                                        getKeyValue={(i) => i.id}
                                        onSelect={(i) => {
                                            this.state.itemSelecionado.banco = i;
                                            this.setState({ itemSelecionado: this.state.itemSelecionado });
                                        }}
                                        asws={true}
                                        formularioPadrao={(select) => <Banco api={this.props.api} select={select} />}
                                        updateOptions={(options) => this.setState({ comboBancos: options })}
                                        nullText={''}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={4} sm={2} md={2} lg={2} style={{ paddingRight: 2 }}>
                                <Form.Group>
                                    <Form.Label>Agência</Form.Label>
                                    <Form.Control
                                        type='text'
                                        defaultValue={this.state.itemSelecionado.agenciaDaContaCorrente}
                                        onChange={(e) => {
                                            this.state.itemSelecionado.agenciaDaContaCorrente = e.target.value;
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            {/* <Col xs={2} sm={1} md={1} lg={1} className='px-0' style={{ maxWidth: 40 }}>
                                <Form.Group>
                                    <Form.Label style={{ whiteSpace: 'nowrap' }}>Dígito</Form.Label>
                                    <Form.Control
                                        style={{ width: 40 }}
                                        type='text'
                                        defaultValue={this.state.itemSelecionado.digitoDaAgenciaDaContaCorrente}
                                        onChange={(e) => {
                                            this.state.itemSelecionado.digitoDaAgenciaDaContaCorrente = e.target.value;
                                        }}
                                    />
                                </Form.Group>
                            </Col> */}

                            <Col xs={5} sm={3} md={3} lg={3} style={{ paddingRight: 2 }}>
                                <Form.Group>
                                    <Form.Label>Conta</Form.Label>
                                    <Form.Control
                                        type='text'
                                        defaultValue={this.state.itemSelecionado.numeroDaContaCorrente}
                                        onChange={(e) => {
                                            this.state.itemSelecionado.numeroDaContaCorrente = e.target.value;
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={3} sm={2} md={2} lg={2} style={{ paddingLeft: 2,   minWidth: 40 }}>
                                <Form.Group>
                                    <Form.Label style={{ whiteSpace: 'nowrap' }}>Dígito</Form.Label>
                                    <Form.Control
                                        type='text'
                                        defaultValue={this.state.itemSelecionado.digitoDaContaCorrente}
                                        onChange={(e) => {
                                            this.state.itemSelecionado.digitoDaContaCorrente = e.target.value;
                                        }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={5} md={5} lg={5} style={{ minWidth: 150 }}>
                                <FormGroup>
                                    <Form.Label style={{ whiteSpace: 'nowrap' }}>Tipo de Conta</Form.Label>
                                    <Select
                                        defaultValue={
                                            this.state.itemSelecionado.tipoDeConta
                                                ? this.state.itemSelecionado.tipoDeConta.id
                                                : 0
                                        }
                                        options={[
                                            { id: 1, descricao: 'Conta Corrente' },
                                            { id: 2, descricao: 'Conta Poupança' },
                                        ]}
                                        getDescription={(i) => i.descricao}
                                        getKeyValue={(i) => i.id}
                                        onSelect={(i) => {
                                            this.state.itemSelecionado.tipoDeConta = i;
                                            this.setState({ itemSelecionado: this.state.itemSelecionado });
                                        }}
                                        nullText={''}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
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
                                    onClick={this.salvar}
                                >
                                    SALVAR
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                )}
            </div>
        );
    }
}
