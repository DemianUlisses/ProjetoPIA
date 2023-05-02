import { Row, Col, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import FormularioPadrao from './FormularioPadrao';
import { isNumeric } from '../scripts/Utils';
import { showError } from './../scripts/Messages';
import { Select } from '../components/Select';
import { CheckBox } from '../components/CheckBox';
import SessionManager from '../scripts/SessionManager';
import PerfilDeUsuario from './PerfilDeUsuario';

const titulo = 'Usuários';
const url = '/usuario';

export default class Usuario extends Component {
	constructor(props) {
		super(props);

		this.sessionManager = new SessionManager();

		this.state = {
			senhaAnterior: null,
			alterarSenha: null,
			novaSenha: null,
			senhaParaConferencia: null,
			comboPerfil: [],
			comboTipos: this.sessionManager.getLogin().tipoDeUsuario.id === 100
				? [
						{ id: 1, descricao: 'Operador' },
						{ id: 2, descricao: 'Jogador' },
						{ id: 100, descricao: 'Master' },
				  ]
				: [
					{ id: 1, descricao: 'Operador' },
					{ id: 2, descricao: 'Jogador' },
				  ],
		};

		this.getFiltro = this.getFiltro.bind(this);
		this.getTitulosDaTabela = this.getTitulosDaTabela.bind(this);
		this.getDadosDaTabela = this.getDadosDaTabela.bind(this);
		this.renderizarFormulario = this.renderizarFormulario.bind(this);
		this.getObjetoDeDados = this.getObjetoDeDados.bind(this);
		this.antesDeInserir = this.antesDeInserir.bind(this);
		this.antesDeEditar = this.antesDeEditar.bind(this);
	}

	carregarCombos() {
		return new Promise((resolve) => {
			this.props.api.getAll(url + '/combosparacadastro').then((result) => {
				this.setState(
					{
						comboPerfil: result.perfis,
					},
					() => resolve()
				);
			});
		});
	}

	antesDeInserir() {
		return new Promise((resolve) => {
			this.setState(
				{ alterarSenha: false, senhaParaConferencia: null, novaSenha: null, senhaAnterior: null },
				() => {
					this.carregarCombos().then(resolve);
				}
			);
		});
	}

	antesDeEditar() {
		return new Promise((resolve) => {
			this.setState(
				{ alterarSenha: false, senhaParaConferencia: null, novaSenha: null, senhaAnterior: null },
				() => {
					this.carregarCombos().then(resolve);
				}
			);
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
				query =
					"?$filter=contains(Searchable,'" + texto + "')";
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
			{ titulo: 'Tipo', width: '10%', orderby: null },
			{ titulo: 'Nome de usuário', width: '20%', orderby: 'nomeDeUsuario' },
			{ titulo: 'Nome da pessoa', width: '40%', orderby: 'nome' },
			{ titulo: 'Perfil', width: '20%', orderby: 'Perfil/Nome' },
			{ titulo: 'Situação', width: '10%', orderby: null },
		];
	}

	getDadosDaTabela(item) {
		return [
			item.id,
			item.tipoDeUsuario.descricao,
			item.nomeDeUsuario,
			item.nome,
			item.perfil.nome, 
			item.situacao.descricao,
		];
	}

	getObjetoDeDados(sender) {
		return new Promise((resolve, reject) => {
			let item = sender.state.itemSelecionado;

			if (!item.tipoDeUsuario) {
				showError('Informe o tipo do usuário.');
				reject();
				return;
			}

			if (!item.nome) {
				showError('Informe o nome da pessoa.');
				reject();
				return;
			}

			if (!item.nomeDeUsuario) {
				showError('Informe o nome de usuário.');
				reject();
				return;
			}

			if (!item.perfil) {
				showError('Informe o perfil do usuário.');
				reject();
				return;
			}

			if (sender.state.incluindo || this.state.alterarSenha) {
				if (!this.state.novaSenha) {
					showError('Informe a senha.');
					reject();
					return;
				}
				if (!this.state.senhaParaConferencia) {
					showError('Repita a senha.');
					reject();
					return;
				}
				if (this.state.novaSenha !== this.state.senhaParaConferencia) {
					showError('As senhas estão diferentes.');
					reject();
					return;
				}
				item.senha = this.state.novaSenha;
			}

			if (sender.state.alterando && !this.state.alterarSenha) {
				item.senha = this.state.senhaAnterior;
			}

			var input = {
				nome: item.nome,
				nomeDeUsuario: item.nomeDeUsuario,
				situacao: item.situacao.id,
				senha: item.senha,
				tipoDeUsuario: item.tipoDeUsuario.id,
				perfil: item.perfil,
			};

			if (sender.state.alterando) {
				input.id = item.id;
			}

			resolve(input);
		});
	}

	renderizarFormulario(sender) {
		return (
			<React.Fragment>
				<Row>
					<Col sm={2} xs={2} md={2}>
						<Form.Group>
							<Form.Label>Código</Form.Label>
							<Form.Control type='text' readOnly defaultValue={sender.state.itemSelecionado.id} />
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Tipo de usuário</Form.Label>
							<Select
								options={this.state.comboTipos}
								name='tipoDeUsuario'
								defaultValue={
									sender.state.itemSelecionado.tipoDeUsuario
										? sender.state.itemSelecionado.tipoDeUsuario.id
										: 0
								}
								getKeyValue={(i) => i.id}
								getDescription={(i) => i.descricao}
								onSelect={(i) => {
									let itemSelecionado = sender.state.itemSelecionado;
									itemSelecionado.tipoDeUsuario = i;
									sender.setState({ itemSelecionado: itemSelecionado });
								}}
							/>
						</Form.Group>
					</Col>
					<Col sm={3} xs={3} md={3}>
						<Form.Group>
							<Form.Label>Situação</Form.Label>
							<Form.Control
								as='select'
								name='situacao'
								defaultValue={sender.state.itemSelecionado.situacao.id}
								onChange={(e) => {
									let itemSelecionado = sender.state.itemSelecionado;
									itemSelecionado.situacao.id = e.target.value;
									this.setState({ itemSelecionado: itemSelecionado });
								}}
							>
								<option value='0'>Não definido</option>
								<option value='1'>Ativo</option>
								<option value='2'>Inativo</option>
							</Form.Control>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label>Nome da pessoa</Form.Label>
							<Form.Control
								type='text'
								defaultValue={sender.state.itemSelecionado.nome}
								onChange={(e) => {
									let itemSelecionado = sender.state.itemSelecionado;
									itemSelecionado.nome = e.target.value;
									this.setState({ itemSelecionado: itemSelecionado });
								}}
								onInput={(e) => e.target.value = ('' + e.target.value).toUpperCase() }
								/>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label>Nome de usuário para acesso ao sistema</Form.Label>
							<Form.Control
								type='text'
								readOnly={sender.state.alterando}
								defaultValue={sender.state.itemSelecionado.nomeDeUsuario}
								onChange={(e) => {
									let itemSelecionado = sender.state.itemSelecionado;
									itemSelecionado.nomeDeUsuario = e.target.value;
									this.setState({ itemSelecionado: itemSelecionado });
								}}
							/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Perfil</Form.Label>
							<Select
								options={this.state.comboPerfil}
								name='perfil'
								defaultValue={
									sender.state.itemSelecionado.perfil ? sender.state.itemSelecionado.perfil.id : 0
								}
								getKeyValue={(i) => i.id}
								getDescription={(i) => i.nome}
								onSelect={(i) => {
									let itemSelecionado = sender.state.itemSelecionado;
									itemSelecionado.perfil = i;
									sender.setState({ itemSelecionado: itemSelecionado });
								}}
								formularioPadrao={(select) => <PerfilDeUsuario api={this.props.api} select={select} />}
								updateOptions={(options) => this.setState({ comboPerfil: options })}
							/>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Group>
							{sender.state.alterando && (
								<CheckBox
									name='alterarSenha'
									label='alterar senha'
									onChange={(checked) => {
										this.setState({ alterarSenha: checked });
									}}
								/>
							)}
							{(sender.state.incluindo || (sender.state.alterando && this.state.alterarSenha)) && (
								<div>
									<Row>
										<Col>
											<Form.Label>Senha</Form.Label>
											<Form.Control
												type='password'
												onChange={(e) => {
													this.setState({ novaSenha: e.target.value });
												}}
											/>
										</Col>
										<Col>
											<Form.Label>Repita a senha</Form.Label>
											<Form.Control
												type='password'
												onChange={(e) => {
													this.setState({ senhaParaConferencia: e.target.value });
												}}
											/>
										</Col>
									</Row>
								</div>
							)}
						</Form.Group>
					</Col>
				</Row>				
			</React.Fragment>
		);
	}

	render() {
		return (
			<FormularioPadrao
				titulo={titulo}
				url={url}
				api={this.props.api}
				ordenacaoPadrao={'nomeDeUsuario'}
				permissoes={[1, 2, null, 4]}
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
				itemVazio={{
					situacao: { id: 1 },
				}}
			/>
		);
	}
}
