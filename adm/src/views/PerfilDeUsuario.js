import { Row, Col, Form, Button } from 'react-bootstrap';
import React, { Component } from 'react';
import FormularioPadrao from './FormularioPadrao';
import { isNumeric } from '../scripts/Utils';
import { Select } from '../components/Select';
import { SubCadastro, BotaoExcluirItemDeSubCadastro } from '../components/SubCadastro';
import { showError, showConfirm } from './../scripts/Messages';
import { pad } from '../scripts/Utils';
import { CheckBox } from '../components/CheckBox';
import RotinaDoSistema from './RotinaDoSistema'

const url = '/perfilusuario';
const titulo = 'Perfil de Usuário';

export default class PerfilDeUsuario extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comboRotinas: [],
			mostrarAcessos: true,
		};

		this.getFiltro = this.getFiltro.bind(this);
		this.getTitulosDaTabela = this.getTitulosDaTabela.bind(this);
		this.getDadosDaTabela = this.getDadosDaTabela.bind(this);
		this.renderizarFormulario = this.renderizarFormulario.bind(this);
		this.getObjetoDeDados = this.getObjetoDeDados.bind(this);
		this.carregarCombos = this.carregarCombos.bind(this);
		this.antesDeInserir = this.antesDeInserir.bind(this);
		this.antesDeEditar = this.antesDeEditar.bind(this);
		this.inserirTodas = this.inserirTodas.bind(this);
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
			{ titulo: 'Nome', width: '80%', orderby: 'nome' },
			{ titulo: 'Situação', width: '20%', orderby: null },
		];
	}

	getDadosDaTabela(item) {
		return [item.id, item.nome, item.situacao.descricao];
	}

	antesDeInserir() {
		return this.carregarCombos();
	}

	antesDeEditar() {
		return this.carregarCombos();
	}

	carregarCombos() {
		//let self = this;
		return new Promise((resolve) => {
			//  this.props.api.getAll(url + '/comborotinas').then((result) => {
			// 	self.setState({ comboRotinas: result });
		        resolve();
			//});
		});
	}

	getObjetoDeDados(sender) {
		return new Promise((resolve, reject) => {
			let item = sender.state.itemSelecionado;

			if (!item.nome) {
				showError('Informe o nome do perfil.');
				reject();
				return;
			}

			var input = {
				nome: item.nome,
				situacao: parseInt(item.situacao.id),
				cidade: item.cidade,
				latitude: item.latitude,
				longitude: item.longitude,
				acessos: item.acessos,
				perfilPadraoParaCadastroDeJogador: item.perfilPadraoParaCadastroDeJogador,
			};
			if (sender.state.alterando) {
				input.id = parseInt(item.id);
			}
			resolve(input);
		});
	}

	inserirTodas(sender) {
		showConfirm(
			'Deseja realmente inserir todas as rotinas?',
			() => {
				let naoCadastradas = this.state.comboRotinas.filter(
					(rotina) =>
						!sender.state.itemSelecionado.acessos.some(
							(rotinaCadastrada) => rotinaCadastrada.rotina.id === rotina.id
						)
				);
				naoCadastradas.forEach((rotina) => {
					sender.state.itemSelecionado.acessos.push({ rotina: rotina });
				});
				sender.setState({ itemSelecionado: sender.state.itemSelecionado }, () => {
					this.setState({ mostrarAcessos: false }, () => this.setState({ mostrarAcessos: true }));
				});
			},
			null,
			'Sim',
			'Não'
		);
	}

	renderizarFormulario(sender) {
		return (
			<React.Fragment>
				<Row>
					<Col sm={3} md={3} lg={3}>
						<Form.Group>
							<Form.Label>Código</Form.Label>
							<Form.Control type='text' readOnly defaultValue={sender.state.itemSelecionado.id} />
						</Form.Group>
					</Col>

					<Col sm={9} md={9} lg={9}>
						<Form.Group>
							<Form.Label>Situação</Form.Label>
							<Form.Control
								as='select'
								name='situacao'
								defaultValue={sender.state.itemSelecionado.situacao.id}
								onChange={(e) => {
									sender.state.itemSelecionado.situacao.id = e.target.value;
									sender.setState({ itemSelecionado: sender.state.itemSelecionado });
								}}
								readOnly={sender.state.itemSelecionado.nome === 'MASTER'}
							>
								<option value='0'>Não definido</option>
								<option value='1'>Ativo</option>
								<option value='2'>Inativo</option>
							</Form.Control>
						</Form.Group>
					</Col>
				</Row>

				<Form.Group>
					<Form.Label>Nome</Form.Label>
					<Form.Control
						type='text'
						defaultValue={sender.state.itemSelecionado.nome}
						onChange={(e) => {
							sender.state.itemSelecionado.nome = e.target.value;
						}}
						readOnly={sender.state.itemSelecionado.nome === 'MASTER'}
						onInput={(e) => (e.target.value = ('' + e.target.value).toUpperCase())}
					/>
				</Form.Group>
				{sender.state.itemSelecionado.nome !== 'MASTER' && (
					<Form.Group controlId='chkperfilPadraoParaCadastroDeJogador'>
						<CheckBox
							label='Perfil padrão para cadastro de jogador'
							defaultChecked={sender.state.itemSelecionado.perfilPadraoParaCadastroDeJogador}
							onChange={(checked) => {
								sender.state.itemSelecionado.perfilPadraoParaCadastroDeJogador = checked;
							}}
							readOnly={sender.state.itemSelecionado.nome === 'MASTER'}
						/>
					</Form.Group>
				)}

				{sender.state.itemSelecionado.nome !== 'MASTER' && this.state.mostrarAcessos && (
					<SubCadastro
						titulo='Acessos'
						itens={sender.state.itemSelecionado.acessos}
						inserir={() => {
							return new Promise((resolve, reject) => {
								if (!this.state.rotinaSelecionada) {
									showError('Selecione uma rotina.');
									reject();
									return;
								}
								let duplicado = sender.state.itemSelecionado.acessos.some(
									(i) => i.rotina.id === this.state.rotinaSelecionada.id
								);

								if (duplicado) {
									showError('Essa rotina já está cadastrada.');
									reject();
									return;
								}

								sender.state.itemSelecionado.acessos.push({
									rotina: this.state.rotinaSelecionada,
								});

								sender.setState({
									itemSelecionado: sender.state.itemSelecionado,
								});
								this.setState({rotinaSelecionada: null});
								resolve();
							});
						}}
						cancelar={() => {
							return new Promise((resolve) => {
								this.setState({
									rotinaSelecionada: null,
								});
								resolve();
							});
						}}
						getTitulosDaTabela={() => {
							return null;
						}}
						getDadosDaTabela={(item, index) => {
							return (
								<tr key={index}>
									<td>{pad(item.rotina.id, 4) + ' - ' + item.rotina.descricao}</td>
									<td style={{ width: 80, textAlign: 'center' }}>
										<BotaoExcluirItemDeSubCadastro
											onClick={() => {
												sender.state.itemSelecionado.acessos.splice(index, 1);
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
										<Col>
											<Form.Group>
												<Form.Label>Rotina</Form.Label>
												<Select
													name={'rotina'}
													defaultValue={this.state.rotinaSelecionada}
													getKeyValue={(i) => i.id}
													getDescription={(i) => i.descricao}
													onSelect={(i) => {
														this.setState({ rotinaSelecionada: i });
													}}
													formularioPadrao={(select) => (
														<RotinaDoSistema api={this.props.api} select={select} />
													)}
													updateOptions={(options) => {}}
													noDropDown={true}
												/>
											</Form.Group>
										</Col>
									</Row>
									<Row>
										<Col md={4} lg={4} xl={4}>
											<Button
												variant='dark'
												size='sm'
												block
												onClick={() => this.inserirTodas(sender)}
											>
												garantir acesso a todas as rotinas
											</Button>
										</Col>
									</Row>
								</div>
							);
						}}
					/>
				)}
				<br />
				<br />
			</React.Fragment>
		);
	}

	render() {
		return (
			<FormularioPadrao
				titulo={titulo}
				url={url}
				api={this.props.api}
				ordenacaoPadrao={'nome'}
				permissoes={[20, 21, 22, 23]}
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
					acessos: [],
				}}
			/>
		);
	}
}
