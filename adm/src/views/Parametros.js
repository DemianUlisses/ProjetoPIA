import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { showError } from './../scripts/Messages';
import FormularioPadrao from './../views/FormularioPadrao';
import { isNumeric } from '../scripts/Utils';
import { Select } from '../components/Select';

const titulo = 'Parâmetros do sistema';
const url = '/parametro';
const CARREGANDO = 1;
const CARREGADO = 2;

export default class Parametros extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusDaTela: CARREGANDO,
            comboProcedimentos: [],
            comboParametros: [
                // Envio e e-mail
                { nome: 'ServidorSmtp', descricao: 'Servidor SMTP', grupo: 1, protegido: false, ordem: 1 },
                { nome: 'PortaSmtp', descricao: 'Porta SMTP', grupo: 1, ordem: 2 },
                {
                    nome: 'UsuarioDoServidorSmtp',
                    descricao: 'Usuário de acesso ao servidor SMTP',
                    grupo: 1,
                    ordem: 3,
                },
                { nome: 'EmailRemetente', descricao: 'E-mail remetente', grupo: 1, ordem: 4 },
                { nome: 'SenhaDoServidorSmtp', descricao: 'Senha remetente', grupo: 1, ordem: 5 , protegido: true},
                { nome: 'NomeDoRemetente', descricao: 'Nome do remetente', grupo: 1, ordem: 6 },
				{ nome: 'UsarSslNoServidorSmtp', descricao: 'Usar SSL', grupo: 1, ordem: 7 },
				// Acesso
				{
					nome: 'Autenticacao.TempoDeSessaoEmMinutosSemAtividade',
					descricao: 'Autenticação >> Tempo máximo de sessão em inatividade em minutos',
					grupo: 2,
					ordem: 1,
				},
                // Contato
                {
                    nome: 'Contato.EmailParaContatoComATI',
                    descricao: 'Contato >> E-mail para contato com a TI',
                    grupo: 5,
                    ordem: 1,
                },
            ],
            tipoDeControle: 'text',
        };

        this.getFiltro = this.getFiltro.bind(this);
        this.getTitulosDaTabela = this.getTitulosDaTabela.bind(this);
        this.getDadosDaTabela = this.getDadosDaTabela.bind(this);
        this.renderizarFormulario = this.renderizarFormulario.bind(this);
        this.getObjetoDeDados = this.getObjetoDeDados.bind(this);
        this.antesDeEditar = this.antesDeEditar.bind(this);
        this.carregarCombos = this.carregarCombos.bind(this);
        this.antesDeInserir = this.antesDeInserir.bind(this);
    }

    antesDeInserir(sender) {
        return this.carregarCombos();
    }

    antesDeEditar(sender, item) {
        this.carregarCombos();
        return new Promise((resolve) => {
            this.setState({ tipoDeControle: item.protegido ? 'password' : 'text' }, resolve);
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
        return query;
    }

    getTitulosDaTabela() {
        return [
            { titulo: 'Código', orderby: 'id', className: 'codigo' },
            { titulo: 'Descrição', width: '50%', orderby: 'descricao' },
            { titulo: 'Valor', width: '50%', orderby: 'valor' },
        ];
    }

    getDadosDaTabela(item) {
        return [
            item.id,
            item.descricao,
            item.protegido ? '*************' : item.valor,
            // <td style={{ width: 90, textAlign: 'center' }}>
            // 	<Button
            // 		variant='secondary'
            // 		size='sm'
            // 		onClick={() => {
            // 			item.parametro = {
            // 				nome: item.nome,
            // 				descricao: item.descricao,
            // 				grupo: item.grupo,
            // 				protegido: item.protegido,
            // 			};
            // 			this.setState({ tipoDeControle: item.protegido ? 'password' : 'text' });
            // 			sender.editarClick(item);
            // 		}}
            // 	>
            // 		alterar
            // 	</Button>
            // </td>,
        ];
    }

    getObjetoDeDados(sender) {
        return new Promise(function (resolve, reject) {
            let item = sender.state.itemSelecionado;

            if (!item.nome) {
                showError('Selecione o parâmetro.');
                reject();
                return;
            }

            var input = {
                grupo: item.grupo,
                ordem: item.ordem ? item.ordem : 0,
                nome: item.nome,
                descricao: item.descricao,
                valor: item.valor,
                protegido: item.protegido,
            };
            if (sender.state.alterando) {
                input.id = parseInt(item.id);
            }
            resolve(input);
        });
    }

    carregarCombos() {
        return new Promise((resolve) => {
            this.setState({ statusDaTela: CARREGADO }, resolve());
        });
    }

    renderizarFormulario(sender) {
        let parametro =
            sender.state.itemSelecionado && sender.state.itemSelecionado.nome
                ? this.state.comboParametros.filter((i) => i.nome === sender.state.itemSelecionado.nome)[0]
                : null;
        return (
            this.state.statusDaTela === CARREGADO && (
                <React.Fragment>
                    <Form.Group>
                        <Form.Label>Código</Form.Label>
                        <Form.Control type='text' readOnly defaultValue={sender.state.itemSelecionado.id} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Parâmetro</Form.Label>
                        <Select
                            options={this.state.comboParametros}
                            name='parametro'
                            defaultValue={sender.state.itemSelecionado ? sender.state.itemSelecionado.nome : ''}
                            onSelect={(i) => {
                                if (i) {
                                    sender.state.itemSelecionado.nome = i.nome;
                                    sender.state.itemSelecionado.descricao = i.descricao;
                                    sender.state.itemSelecionado.protegido = i.protegido;
                                    sender.state.itemSelecionado.grupo = i.grupo;
                                    sender.state.itemSelecionado.ordem = i.ordem;
                                    sender.state.itemSelecionado.componente = i.componente;
                                } else {
                                    sender.state.itemSelecionado.nome = null;
                                    sender.state.itemSelecionado.descricao = null;
                                    sender.state.itemSelecionado.protegido = null;
                                    sender.state.itemSelecionado.grupo = null;
                                    sender.state.itemSelecionado.ordem = null;
                                    sender.state.itemSelecionado.componente = null;
                                }
                                this.setState({
                                    tipoDeControle: i && i.protegido ? 'password' : 'text',
                                });
                                sender.setState({ itemSelecionado: sender.state.itemSelecionado });
                            }}
                            getKeyValue={(i) => i.nome}
                            getDescription={(i) => i.descricao}
                        />
                    </Form.Group>

                    {parametro && !parametro.componente && this.state.tipoDeControle !== 'password' && (
                        <Form.Group>
                            <Form.Label>{parametro.descricao}</Form.Label>
                            <Form.Control
                                type='text'
                                defaultValue={sender.state.itemSelecionado.valor}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.valor = e.target.value;
                                }}
                            />
                        </Form.Group>
                    )}

                    {parametro && !parametro.componente && this.state.tipoDeControle === 'password' && (
                        <Form.Group>
                            <Form.Label>{parametro.descricao}</Form.Label>
                            <Form.Control
                                type='password'
                                defaultValue={sender.state.itemSelecionado.valor}
                                onChange={(e) => {
                                    sender.state.itemSelecionado.valor = e.target.value;
                                }}
                            />
                        </Form.Group>
                    )}

                    {parametro && parametro.componente && (
                        <div>
                            {parametro.componente(
                                sender.state.itemSelecionado.valor
                                    ? parseInt(sender.state.itemSelecionado.valor)
                                    : null,
                                (valor) => {
                                    sender.state.itemSelecionado.valor = valor;
                                }
                            )}
                        </div>
                    )}
                </React.Fragment>
            )
        );
    }

    render() {
        return (
            <FormularioPadrao
                titulo={titulo}
                url={url}
                api={this.props.api}
                ordenacaoPadrao={'grupo, ordem'}
                permissoes={[7000, 7001, 7002, 7003]}
                getFiltro={this.getFiltro}
                getTitulosDaTabela={this.getTitulosDaTabela}
                getDadosDaTabela={this.getDadosDaTabela}
                renderizarFormulario={this.renderizarFormulario}
                getObjetoDeDados={this.getObjetoDeDados}
                antesDeInserir={this.antesDeInserir}
                antesDeEditar={this.antesDeEditar}
                antesDeSalvar={this.antesDeSalvar}
                antesDeExcluir={this.antesDeExcluir}
                select={this.props.select}
                itemVazio={{}}
            />
        );
    }
}
