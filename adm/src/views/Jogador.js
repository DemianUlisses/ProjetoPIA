import { Row, Col, Form, FormGroup } from 'react-bootstrap';
import React, { Component } from 'react';
import { urlBase } from '../scripts/Api';
import FormularioPadrao from './FormularioPadrao';
import styled from 'styled-components';
import { faKey, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateInput } from '../components/DateInput';
import { CpfInput } from '../components/CpfInput';
import { generatePassword, getEnderecoCompleto, isNumeric, inputToUpper } from '../scripts/Utils';
import { dateToString, getTelefones } from '../scripts/Utils';
import { Select } from '../components/Select';
import { CepInput } from '../components/CepInput';
import { SubCadastro, BotaoAlterarItemDeSubCadastro, BotaoExcluirItemDeSubCadastro } from '../components/SubCadastro';
import { showConfirm, showError, showInfo } from '../scripts/Messages';
import Cidade from './Cidade';
import Banco from './Banco';

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

const titulo = 'Jogadores';
const url = '/jogador';

export default class Jogador extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dddInformado: null,
            temWhatsAppInformado: null,
            numeroDeTelefoneInformado: null,
            logradouroInformado: null,
            numeroDeEnderecoInformado: null,
            complementoInformado: null,
            bairroInformado: null,
            cepInformado: null,
            cidadeInformada: null,
            comboBancos: [],
        };

        this.renderizarFormulario = this.renderizarFormulario.bind(this);
        this.getObjetoDeDados = this.getObjetoDeDados.bind(this);

        this.antesDeInserir = this.antesDeInserir.bind(this);
        this.antesDeEditar = this.antesDeEditar.bind(this);
        this.antesDeSalvar = this.antesDeSalvar.bind(this);
        this.antesDeExcluir = this.antesDeExcluir.bind(this);
        this.aposInserir = this.aposInserir.bind(this);
        this.verificarSeJaExiste = this.verificarSeJaExiste.bind(this);

        this.onImageChange = this.onImageChange.bind(this);
        this.onExcluirFotoClick = this.onExcluirFotoClick.bind(this);
        this.gerarSenha = this.gerarSenha.bind(this);
    }

    componentDidMount() {
        try {
            this.carregarCombos();
        } catch (error) {}
    }

    carregarCombos() {
        return new Promise((resolve) => {
            this.props.api.getAll(url + '/combosparacadastro').then((result) => {
                this.setState(
                    {
                        comboBancos: result.bancos,
                    },
                    () => {
                        resolve();
                    }
                );
            });
        });
    }

    getFiltro(filtro) {
        var query = '';
        if (filtro && filtro.texto) {
            let texto = filtro.texto.toString();
            if (texto[0] === '#') {
                if (!isNumeric(texto.substring(1))) {
                    showError('Código inválido: "' + texto.substring(1) + '"');
                    return null;
                }
                query = '?$filter=id eq ' + texto.substring(1);
            } else {
                query = "?$filter=contains(Searchable,'" + texto + "')";
            }
            query += '&';
        } else {
            query = '?';
        }
        if (this.props.filtroAdicional) {
            query += this.props.filtroAdicional;
        }
        return query;
    }

    getTitulosDaTabela() {
        return [
            { titulo: 'Código', orderby: 'id', className: 'codigo' },
            { titulo: 'Nome', width: '20%', orderby: 'nomeCompleto' },
            { titulo: 'CPF', width: '10%' },
            { titulo: 'Data de nasc.', width: '15%', orderby: 'dataDeNascimento' },
            { titulo: 'Sexo', width: '15%' },
            { titulo: 'Telefone', width: '15%' },
            { titulo: 'E-mail', width: '20%' },
        ];
    }

    getDadosDaTabela(item) {
        return [
            item.id,
            item.nomeCompleto,
            item.cpf,
            dateToString(item.dataDeNascimento),
            item.sexo.descricao,
            getTelefones(item),
            item.email,
        ];
    }

    onImageChange(event, sender) {
        var self = sender;
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

    onExcluirFotoClick(event, sender) {
        var self = sender;
        var tg = event.target;
        showConfirm('Deseja realmente excluir a foto?', () => {
            self.state.itemSelecionado.foto = {};
            self.setState({ itemSelecionado: self.state.itemSelecionado });
            tg.value = null;
        });
    }

    antesDeInserir(sender) {
        return new Promise((resolve) => {
            this.setState({ cpfParaNaoConsultar: null });
            sender.setState(
                {
                    senhaDefault: null,
                    emailAnterior: null,
                },
                resolve
            );
        });
    }

    antesDeEditar(sender, item) {
        return new Promise((resolve) => {
            this.setState({ cpfParaNaoConsultar: item.cpf });
            sender.setState(
                {
                    senhaDefault: 'xxxxxxxx',
                    emailAnterior: item.email,
                },
                resolve
            );
        });
    }

    aposInserir(sender) {
        if (this.props.apenasInserir && this.props.idDoProspect) {
            this.props.api.getAll('/prospect?$filter=Id eq ' + this.props.idDoProspect.toString()).then((result) => {
                if (result && result.length > 0) {
                    this.setProspectSelecionado(result[0], sender);
                }
            });
        }
    }

    antesDeSalvar() {}

    antesDeExcluir() {}

    importarPropspect(sender) {
        this.cmbProspect.showModal();
    }

    gerarSenha(sender) {
        let senha = generatePassword();
        sender.state.itemSelecionado.senha = senha;
        sender.state.itemSelecionado.usuario = { senha: senha };
        sender.setState({ itemSelecionado: sender.state.itemSelecionado, senhaDefault: senha }, () => {
            sender.atualizarFormulario();
            showInfo('Nova senha gerada: ' + senha);
        });
    }

    verificarSeJaExiste(sender) {
        let item = sender.state.itemSelecionado;
        if (item && item.cpf && item.cpf.length === 14 && item.cpf !== this.state.cpfParaNaoConsultar) {
            this.props.api
                .getAll(url + "?$filter=cpf eq '" + item.cpf + "'" + (item.id ? ' and Jogador/Id ne ' + item.id : ''))
                .then((result) => {
                    if (result && result.length > 0) {
                        let jogador = result[0];
                        let mensagem =
                            jogador.sexo.id === 1
                                ? ' já está cadastrado, deseja visualizar o cadastro?'
                                : ' já está cadastrada, deseja visualizar o cadastro?';
                        showConfirm(
                            jogador.nomeCompleto + mensagem,
                            () => {
                                sender.setState({ incluindo: false, alterando: false }, () =>
                                    sender.editarClick(jogador)
                                );
                            },
                            () => {
                                this.setState({ cpfParaNaoConsultar: item.cpf });
                            },
                            'Sim',
                            'Não'
                        );
                    } else {
                        this.setState({ cpfParaNaoConsultar: item.cpf });
                    }
                });
        }
    }

    getObjetoDeDados(sender) {
        return new Promise((resolve, reject) => {
            let item = sender.state.itemSelecionado;

            if (!item.nomeCompleto) {
                showError('Informe o nome da pessoa.');
                reject();
                return;
            }

            // if (!item.cpf) {
            // 	showError('Informe o CPF.');
            // 	reject();
            // 	return;
            // }

            // if (!item.dataDeNascimento) {
            // 	showError('Informe a data de nascimento.');
            // 	reject();
            // 	return;
            // }

            // if (!item.sexo) {
            // 	showError('Informe o sexo.');
            // 	reject();
            // 	return;
            // }

            if (item.sexo.id !== 1 && item.sexo.id !== 2) {
                showError('Informe o sexo.');
                reject();
                return;
            }

            if (sender.state.emailAnterior && item.email) {
                if (sender.state.emailAnterior !== item.email && (item.senha === 'xxxxxxxx' || !item.senha)) {
                    showError('Por favor informe a senha.');
                    reject();
                    return;
                }
            }

            if (!item.email) {
                showError('Informe o e-mail.');
                reject();
                return;
            }

            var input = {
                nomeCompleto: item.nomeCompleto,
                email: item.email,
                usuario: {
                    senha: item.senha === 'xxxxxxxx' ? null : item.senha,
                },
                sexo: item.sexo.id,
                cpf: item.cpf,
                documentoDeIdentidade: item.documentoDeIdentidade,
                orgaoExpedidorDoDocumentoDeIdentidade: item.orgaoExpedidorDoDocumentoDeIdentidade,
                dataDeNascimento: item.dataDeNascimento,
                dataDeCadastro: item.dataDeCadastro ? item.dataDeCadastro : new Date(),
                foto: item.foto && item.foto.id ? item.foto : null,
                telefones: item.telefones,
                enderecos: item.enderecos,
                tipoDeConta: item.tipoDeConta ? item.tipoDeConta.id : null,
            };
            if (sender.state.alterando) {
                input.id = parseInt(item.id);
            }
            resolve(input);
        });
    }

    renderizarFormulario(sender) {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <Row>
                            <Col sm={2} xs={2} md={2}>
                                <Form.Group>
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control type='text' readOnly defaultValue={sender.state.itemSelecionado.id} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type='text'
                                        defaultValue={sender.state.itemSelecionado.nomeCompleto}
                                        onChange={(e) => {
                                            sender.state.itemSelecionado.nomeCompleto = e.target.value;
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={3} xs={3} md={3}>
                                <Form.Group>
                                    <Form.Label>Data de cadastro</Form.Label>
                                    <DateInput
                                        defaultValue={
                                            sender.state.itemSelecionado.dataDeCadastro
                                                ? sender.state.itemSelecionado.dataDeCadastro
                                                : new Date()
                                        }
                                        onChange={(value) => {
                                            sender.state.itemSelecionado.dataDeCadastro = value;
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
                                sender.state.itemSelecionado.foto && sender.state.itemSelecionado.foto.nome
                                    ? 'alterar foto'
                                    : 'carregar foto'
                            }
                        >
                            <Form.File
                                accept={'image/png, image/jpeg'}
                                onChange={(e) => this.onImageChange(e, sender)}
                                style={{ position: 'absolute', top: -1000 }}
                                tabIndex={-1}
                            ></Form.File>
                            {sender.state.itemSelecionado.foto && sender.state.itemSelecionado.foto.nome ? (
                                <ImgRounded
                                    alt=''
                                    url={() => urlBase + '/arquivo/' + sender.state.itemSelecionado.foto.nome}
                                ></ImgRounded>
                            ) : (
                                <ImgNone alt=''>
                                    <FontAwesomeIcon icon={faUserCircle} />
                                </ImgNone>
                            )}
                        </Form.Label>
                        {sender.state.itemSelecionado.foto && sender.state.itemSelecionado.foto.nome && (
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
                                onClick={(e) => this.onExcluirFotoClick(e, sender)}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </div>
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>CPF</Form.Label>
                            <CpfInput
                                defaultValue={sender.state.itemSelecionado.cpf}
                                onChange={(value) => {
                                    sender.state.itemSelecionado.cpf = value.formattedValue;
                                }}
                                onBlur={() => this.verificarSeJaExiste(sender)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>RG</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.documentoDeIdentidade}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.documentoDeIdentidade = e.target.value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={2} md={2} lg={2}>
                        <Form.Group>
                            <Form.Label>Órgão expedidor</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.orgaoExpedidorDoDocumentoDeIdentidade}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.orgaoExpedidorDoDocumentoDeIdentidade = e.target.value;
                                }}
                                onInput={inputToUpper}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Data de nascimento</Form.Label>
                            <DateInput
                                defaultValue={sender.state.itemSelecionado.dataDeNascimento}
                                onChange={(value) => {
                                    sender.state.itemSelecionado.dataDeNascimento = value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Form.Label>Sexo</Form.Label>
                            <Select
                                defaultValue={
                                    sender.state.itemSelecionado.sexo ? sender.state.itemSelecionado.sexo.id : 0
                                }
                                options={[
                                    { id: 1, descricao: 'Masculino' },
                                    { id: 2, descricao: 'Feminino' },
                                ]}
                                getDescription={(i) => i.descricao}
                                getKeyValue={(i) => i.id}
                                onSelect={(i) => {
                                    sender.state.itemSelecionado.sexo = i;
                                    sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.email}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.email = e.target.value;
                                    sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                }}
                                onInput={(e) => (e.target.value = ('' + e.target.value).toLowerCase())}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type='password'
                                defaultValue={
                                    sender.state.itemSelecionado && sender.state.itemSelecionado.email
                                        ? sender.state.itemSelecionado.usuario
                                            ? sender.state.senhaDefault
                                            : null
                                        : null
                                }
                                onChange={(e) => {
                                    sender.state.itemSelecionado.senha = e.target.value;
                                    sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                }}
                            />
                        </Form.Group>
                    </Col>
                    {sender.state.itemSelecionado &&
                        sender.state.itemSelecionado.email &&
                        !sender.state.itemSelecionado.senha && (
                            <Col style={{ maxWidth: 60, marginLeft: -10, paddingRight: 20 }}>
                                <div style={{ paddingTop: 25, fontSize: 25 }}>
                                    <FontAwesomeIcon
                                        icon={faKey}
                                        title='gerar senha'
                                        cursor={'pointer'}
                                        onClick={() => this.gerarSenha(sender)}
                                    />
                                </div>
                            </Col>
                        )}
                </Row>
                <span style={{ fontWeight: 500 }}>Dados bancários: </span>
                <Row>
                    <Col style={{ paddingRight: 2 }}>
                        <Form.Group>
                            <Form.Label>Banco</Form.Label>
                            <Select
                                defaultValue={
                                    sender.state.itemSelecionado.banco ? sender.state.itemSelecionado.banco.id : 0
                                }
                                options={this.state.comboBancos}
                                getDescription={(i) => i.nome}
                                getKeyValue={(i) => i.id}
                                onSelect={(i) => {
                                    sender.state.itemSelecionado.banco = i;
                                    sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                    this.verificarSeJaExiste(sender);
                                }}
                                asws={true}
                                formularioPadrao={(select) => <Banco api={this.props.api} select={select} />}
                                updateOptions={(options) => this.setState({ comboBancos: options })}
                                nullText={''}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={2} md={2} lg={2} style={{ maxWidth: 80, paddingRight: 2 }}>
                        <Form.Group>
                            <Form.Label>Agência</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.agenciaDaContaCorrente}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.agenciaDaContaCorrente = e.target.value;
                                }}
                            />
                        </Form.Group>
                    </Col>

                    <Col sm={3} md={3} lg={3} style={{ maxWidth: 120, paddingRight: 2 }}>
                        <Form.Group>
                            <Form.Label>Conta</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.numeroDaContaCorrente}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.numeroDaContaCorrente = e.target.value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={1} md={1} lg={1} style={{ maxWidth: 100, paddingRight: 2 }}>
                        <Form.Group>
                            <Form.Label style={{ whiteSpace: 'nowrap' }}>DV Conta</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.digitoDaContaCorrente}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.digitoDaContaCorrente = e.target.value;
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col style={{ maxWidth: 170 }}>
                        <FormGroup>
                            <Form.Label>Tipo</Form.Label>
                            <Select
                                defaultValue={
                                    sender.state.itemSelecionado.tipoDeConta
                                        ? sender.state.itemSelecionado.tipoDeConta.id
                                        : 0
                                }
                                options={[
                                    { id: 1, descricao: 'Conta Corrente' },
                                    { id: 2, descricao: 'Conta Poupança' },
                                ]}
                                getDescription={(i) => i.descricao}
                                getKeyValue={(i) => i.id}
                                onSelect={(i) => {
                                    sender.state.itemSelecionado.tipoDeConta = i;
                                    sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                }}
                                nullText={''}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <SubCadastro
                    titulo='Endereços'
                    itens={sender.state.itemSelecionado.enderecos}
                    inserir={() => {
                        return new Promise((resolve, reject) => {
                            if (!this.state.logradouroInformado) {
                                showError('Informe o logradouro.');
                                reject();
                                return false;
                            }

                            if (!this.state.numeroDeEnderecoInformado) {
                                showError('Informe o número ou SN caso o endereço não tenha número.');
                                reject();
                                return false;
                            }

                            if (!this.state.bairroInformado) {
                                showError('Informe o bairro.');
                                reject();
                                return false;
                            }

                            if (!this.state.cepInformado) {
                                showError('Informe o CEP.');
                                reject();
                                return false;
                            }

                            if (!this.state.cidadeInformada) {
                                showError('Informe a cidade.');
                                reject();
                                return false;
                            }

                            let endereco = {
                                logradouro: this.state.logradouroInformado,
                                numero: this.state.numeroDeEnderecoInformado,
                                complemento: this.state.complementoInformado,
                                bairro: this.state.bairroInformado,
                                cep: this.state.cepInformado,
                                cidade: this.state.cidadeInformada,
                            };

                            endereco.enderecoCompleto = getEnderecoCompleto(endereco);

                            sender.state.itemSelecionado.enderecos.push({
                                tipo: 1, // Residencial
                                endereco: endereco,
                            });

                            resolve();
                        });
                    }}
                    alterar={(indiceEmEdicao) => {
                        return new Promise((resolve, reject) => {
                            if (!this.state.logradouroInformado) {
                                showError('Informe o logradouro.');
                                reject();
                                return false;
                            }

                            if (!this.state.numeroDeEnderecoInformado) {
                                showError('Informe o número ou SN caso o endereço não tenha número.');
                                reject();
                                return false;
                            }

                            if (!this.state.bairroInformado) {
                                showError('Informe o bairro.');
                                reject();
                                return false;
                            }

                            if (!this.state.cepInformado) {
                                showError('Informe o CEP.');
                                reject();
                                return false;
                            }

                            if (!this.state.cidadeInformada) {
                                showError('Informe a cidade.');
                                reject();
                                return false;
                            }

                            let endereco = {
                                id: this.state.enderecoEmEdicao.endereco.id,
                                logradouro: this.state.logradouroInformado,
                                numero: this.state.numeroDeEnderecoInformado,
                                complemento: this.state.complementoInformado,
                                bairro: this.state.bairroInformado,
                                cep: this.state.cepInformado,
                                cidade: this.state.cidadeInformada,
                            };

                            endereco.enderecoCompleto = getEnderecoCompleto(endereco);

                            sender.state.itemSelecionado.enderecos[indiceEmEdicao] = {
                                id: this.state.enderecoEmEdicao.id,
                                tipo: 1, // Residencial
                                endereco: endereco,
                            };

                            this.setState({
                                enderecoEmEdicao: null,
                            });

                            resolve();
                        });
                    }}
                    cancelar={() => {
                        return new Promise((resolve, reject) => {
                            this.setState({
                                enderecoEmEdicao: null,
                                logradouroInformado: null,
                                numeroDeEnderecoInformado: null,
                                complementoInformado: null,
                                bairroInformado: null,
                                cepInformado: null,
                                cidadeInformada: null,
                            });
                            resolve();
                        });
                    }}
                    getDadosDaTabela={(item, index, setEmEdicao) => {
                        return (
                            <tr key={index}>
                                <td style={{ verticalAlign: 'middle' }}>{item.endereco.enderecoCompleto}</td>
                                <td style={{ width: 80, textAlign: 'center' }}>
                                    <BotaoAlterarItemDeSubCadastro
                                        onClick={() => {
                                            this.setState(
                                                {
                                                    enderecoEmEdicao: item,
                                                    logradouroInformado: item.endereco.logradouro,
                                                    numeroDeEnderecoInformado: item.endereco.numero,
                                                    complementoInformado: item.endereco.complemento,
                                                    bairroInformado: item.endereco.bairro,
                                                    cepInformado: item.endereco.cep,
                                                    cidadeInformada: item.endereco.cidade,
                                                },
                                                () => {
                                                    setEmEdicao(index);
                                                }
                                            );
                                        }}
                                    />
                                    <BotaoExcluirItemDeSubCadastro
                                        onClick={() => {
                                            sender.state.itemSelecionado.enderecos.splice(index, 1);
                                            sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                                        }}
                                    />
                                </td>
                            </tr>
                        );
                    }}
                    renderizarFormulario={() => {
                        return (
                            <div>
                                <Row>
                                    <Col xs={6} md={6} xl={6}>
                                        <FormGroup>
                                            <Form.Label>Logradouro</Form.Label>
                                            <Form.Control
                                                type='text'
                                                defaultValue={
                                                    this.state.enderecoEmEdicao
                                                        ? this.state.enderecoEmEdicao.endereco.logradouro
                                                        : null
                                                }
                                                onChange={(e) => {
                                                    this.setState({ logradouroInformado: e.target.value });
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={2} md={2} xl={2}>
                                        <FormGroup>
                                            <Form.Label>Número</Form.Label>
                                            <Form.Control
                                                defaultValue={
                                                    this.state.enderecoEmEdicao
                                                        ? this.state.enderecoEmEdicao.endereco.numero
                                                        : null
                                                }
                                                onChange={(e) => {
                                                    this.setState({ numeroDeEnderecoInformado: e.target.value });
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={4} md={4} xl={4}>
                                        <FormGroup>
                                            <Form.Label>Complemento</Form.Label>
                                            <Form.Control
                                                type='text'
                                                defaultValue={
                                                    this.state.enderecoEmEdicao
                                                        ? this.state.enderecoEmEdicao.endereco.complemento
                                                        : null
                                                }
                                                onChange={(e) => {
                                                    this.setState({ complementoInformado: e.target.value });
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Form.Label>Bairro</Form.Label>
                                            <Form.Control
                                                type='text'
                                                defaultValue={
                                                    this.state.enderecoEmEdicao
                                                        ? this.state.enderecoEmEdicao.endereco.bairro
                                                        : null
                                                }
                                                onChange={(e) => {
                                                    this.setState({ bairroInformado: e.target.value });
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={3} md={3} xl={3}>
                                        <FormGroup>
                                            <Form.Label>CEP</Form.Label>
                                            <CepInput
                                                defaultValue={
                                                    this.state.enderecoEmEdicao
                                                        ? this.state.enderecoEmEdicao.endereco.cep
                                                        : null
                                                }
                                                onChange={(value) => {
                                                    this.setState({ cepInformado: value.formattedValue });
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Cidade</Form.Label>
                                            <Select
                                                name={'cidade'}
                                                defaultValue={this.state.cidadeInformada}
                                                getKeyValue={(i) => i.id}
                                                getDescription={(i) => i.nome}
                                                onSelect={(i) => {
                                                    this.setState({ cidadeInformada: i });
                                                }}
                                                formularioPadrao={(select) => (
                                                    <Cidade api={this.props.api} select={select} />
                                                )}
                                                updateOptions={(options) => {}}
                                                noDropDown={true}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        );
                    }}
                />
            </React.Fragment>
        );
    }

    render() {
        return (
            <FormularioPadrao
                titulo={titulo}
                url={url}
                ordenacaoPadrao={'nomeCompleto'}
                permissoes={[3000, 3001, 3002, 3004]}
                getFiltro={this.getFiltro}
                getTitulosDaTabela={this.getTitulosDaTabela}
                getDadosDaTabela={this.getDadosDaTabela}
                renderizarFormulario={this.renderizarFormulario}
                getObjetoDeDados={this.getObjetoDeDados}
                antesDeInserir={this.antesDeInserir}
                antesDeEditar={this.antesDeEditar}
                antesDeSalvar={this.antesDeSalvar}
                antesDeExcluir={this.antesDeExcluir}
                aposInserir={this.aposInserir}
                {...this.props}
                itemVazio={{
                    telefones: [],
                    foto: {},
                    enderecos: [],
                }}
            />
        );
    }
}
