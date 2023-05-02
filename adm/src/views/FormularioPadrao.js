import React, { Component } from 'react';
import { Row, Col, Button, Form, Table, ButtonGroup, InputGroup, Modal } from 'react-bootstrap';
import { showConfirm, showError, showInfo } from './../scripts/Messages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faTimesCircle, faSave } from '@fortawesome/free-regular-svg-icons';
import { faPlusCircle, faForward, faBackward, faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import SessionManager from '../scripts/SessionManager';
import { LayoutParams } from '../components/LayoutParams';
import { replaceAll, retirarAcentos } from '../scripts/Utils';

const tamanhoDaPagina = 20;

let timer = 0;
let delay = 200;
let prevent = false;

export default class FormularioPadrao extends Component {
	constructor(props) {
		super(props);

		const {
			renderizarFiltros,
			getFiltro,
			getTitulosDaTabela,
			getDadosDaTabela,
			renderizarFormulario,
			getObjetoDeDados,
			itemVazio,
			antesDeInserir,
			aposInserir,
			antesDeEditar,
			aposEditar,
			antesDeSalvar,
			antesDeExcluir,
			permissoes,
			definirValoresPadrao,
		} = props;

		let sessionManager = new SessionManager();

		this.state = {
			itemSelecionado: null,
			itens: [],
			vazio: false,
			consultou: false,
			navegando: false,
			incluindo: false,
			alterando: false,
			itemVazio: JSON.stringify(itemVazio),
			filtro: {},
			botaoSalvarHabilitado: true,
			tamanhoDaPagina: tamanhoDaPagina,
			quantidadeDeDados: 0,
			podeAvancar: false,
			podeVoltar: false,
			podeIncluir: permissoes ? sessionManager.temAcessoARotina(permissoes[0]) : false,
			podeAlterar: permissoes ? sessionManager.temAcessoARotina(permissoes[1]) : false,
			podeExcluir: permissoes ? sessionManager.temAcessoARotina(permissoes[2]) : false,
			podeConsultar: permissoes ? sessionManager.temAcessoARotina(permissoes[3]) : false,
			mostrarFormulario: true,
			ordenacao: this.props.ordenacaoPadrao,
		};

		this.salvar = this.salvar.bind(this);
		this.formEdicaoSubimit = this.formEdicaoSubimit.bind(this);
		this.formConsultaSubmit = this.formConsultaSubmit.bind(this);
		this.editarClick = this.editarClick.bind(this);
		this.inserirClick = this.inserirClick.bind(this);
		this.cancelarClick = this.cancelarClick.bind(this);
		this.excluirClick = this.excluirClick.bind(this);
		this.excluir = this.excluir.bind(this);
		this.renderizarCodigo = this.renderizarCodigo.bind(this);
		this.renderizarAcoes = this.renderizarAcoes.bind(this);
		this.getTitulo = this.getTitulo.bind(this);
		this.getFiltros = this.getFiltros.bind(this);
		this.getLista = this.getLista.bind(this);
		this.getFormulario = this.getFormulario.bind(this);
		this.filtrar = this.filtrar.bind(this);
		this.navegar = this.navegar.bind(this);
		this.getCabecalhos = this.getCabecalhos.bind(this);
		this.getNavegador = this.getNavegador.bind(this);
		this.onRowClick = this.onRowClick.bind(this);
		this.definirValoresPadrao = this.definirValoresPadrao.bind(this);
		this.atualizarFormulario = this.atualizarFormulario.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.getOrdenacao = this.getOrdenacao.bind(this);

		this.renderizarFiltros = renderizarFiltros ? renderizarFiltros : this.renderizarFiltros;
		this.getFiltro = getFiltro ? getFiltro : this.getFiltro;
		this.getTitulosDaTabela = getTitulosDaTabela ? getTitulosDaTabela : this.getTitulosDaTabela;
		this.getDadosDaTabela = getDadosDaTabela ? getDadosDaTabela : this.getDadosDaTabela;
		this.renderizarFormulario = renderizarFormulario ? renderizarFormulario : this.renderizarFormulario;
		this.getObjetoDeDados = getObjetoDeDados ? getObjetoDeDados : this.getObjetoDeDados;
		this.definirValoresPadrao = definirValoresPadrao ? definirValoresPadrao : this.definirValoresPadrao;

		this.antesDeInserir = antesDeInserir;
		this.aposInserir = aposInserir;
		this.antesDeEditar = antesDeEditar;
		this.aposEditar = aposEditar;
		this.antesDeSalvar = antesDeSalvar;
		this.antesDeExcluir = antesDeExcluir;
	}

	componentDidMount() {
		let searchText = null;
		if (this.props.select) {
			searchText = this.props.select.getSearchText();
		}
		let filtro = this.state.filtro;
		filtro.texto = searchText;
		this.setState({ filtro: filtro }, () => {
			if (this.props.apenasInserir) {
				this.inserirClick();
			} else if (this.props.apenasAlterar) {
				this.props.api
					.getAll(this.props.url + '?$filter=(Id eq ' + this.props.id.toString() + ')')
					.then((data) => {
						let item = data[0];
						if (item) {
							this.editarClick(item);
						} else {
							showError('Registro não localizado para alteração.');
						}
					});
			} else {
				this.setState({ navegando: true });
				this.filtrar();
			}
		});
	}

	getFiltro() {}

	getTitulosDaTabela() {
		return [];
	}

	getDadosDaTabela() {
		return [];
	}

	renderizarFormulario() {
		return <div />;
	}
	getObjetoDeDados() {}
	antesDeInserir() {}
	aposInserir() {}
	antesDeEditar() {}
	aposEditar() {}
	antesDeSalvar() {}
	antesDeExcluir() {}
	/* */

	atualizarFormulario() {
		this.setState(
			{
				mostrarFormulario: false,
			},
			() => {
				this.setState({ mostrarFormulario: true });
			}
		);
	}

	getOrdenacao() {
		let result = '';
		if (this.state.ordenacao) {
			result += '&$orderby=' + this.state.ordenacao;
		}
		return result;
	}

	onRowClick(item) {
		if (this.props.select) {
			this.props.select.aoSelecionar(item);
		}
	}

	doDoubleClickAction(item) {
		if (!this.state.podeAlterar || this.props.select || this.props.apenasInserir) {
			return;
		}
		this.editarClick(item);
	}

	handleClick(item) {
		let self = this;
		timer = setTimeout(function () {
			if (!prevent) {
				self.onRowClick(item);
			}
			prevent = false;
		}, delay);
	}

	handleDoubleClick(item) {
		clearTimeout(timer);
		prevent = true;
		this.doDoubleClickAction(item);
	}

	getItemVazio() {
		return JSON.parse(this.state.itemVazio);
	}

	definirValoresPadrao(item) {
		return item;
	}

	formConsultaSubmit(event) {
		event.preventDefault();
		this.filtrar();
	}

	filtrar() {
		var query = this.getFiltro(this.state.filtro);
		query += (query ? '&' : '?') + '$top=' + this.state.tamanhoDaPagina.toString();
		query += this.getOrdenacao();

		this.props.api.getAll(this.props.url + query).then((data) => {
			this.setState({
				itens: data,
				podeAvancar: data.length >= this.state.tamanhoDaPagina,
				quantidadeDeDados: data.length,
				vazio: !data || data.length === 0,
			});
		});
	}

	navegar(opcao) {
		var query = this.getFiltro(this.state.filtro);

		let skip =
			opcao === 1
				? this.state.quantidadeDeDados - this.state.tamanhoDaPagina - this.state.itens.length
				: this.state.quantidadeDeDados;

		query += '&$top=' + this.state.tamanhoDaPagina.toString() + '&$skip=' + skip.toString();

		query += this.getOrdenacao();

		this.props.api.getAll(this.props.url + query).then((data) => {
			let quantidadeDeDados =
				opcao === 1
					? this.state.quantidadeDeDados - this.state.itens.length
					: this.state.quantidadeDeDados + data.length;
			this.setState({
				itens: data,
				quantidadeDeDados: quantidadeDeDados,
				podeVoltar: skip > 0,
				podeAvancar: data.length >= this.state.tamanhoDaPagina,
			});
		});
	}

	renderizarFiltros(sender) {
		return (
			<Form.Group>
				<InputGroup>
					<InputGroup.Prepend>
						<InputGroup.Text style={{ padding: '1px 6px 1px 6px' }}>
							<div
								style={{ border: 0, outline: 'transparent', width: 25, cursor: 'pointer' }}
								tabIndex={-1}
								title='limpar'
								onClick={() => {
									let filtro = sender.state.filtro;
									filtro.texto = null;
									sender.setState({ filtro: filtro });
									if (sender.textoFiltro) {
										sender.textoFiltro.value = null;
										sender.filtrar();
									}
								}}
							>
								x
							</div>
						</InputGroup.Text>
					</InputGroup.Prepend>

					<Form.Control
						ref={(c) => {
							this.textoFiltro = c;
							if (c) {
								c.focus();
								if (this.props.select) {
									let searchText = this.props.select.getSearchText();
									if (searchText) {
										c.selectionStart = searchText.length;
										c.selectionEnd = searchText.length;
									}
								}
							}
						}}
						type='text'
						defaultValue={sender.state.filtro.texto}
						onChange={(e) => {
							let filtro = sender.state.filtro;
							filtro.texto = e.target.value;
							if (filtro.texto) {
								filtro.texto = ('' + retirarAcentos(filtro.texto)).toUpperCase();
								var charsToRemove = ['@', ',', '.', ';', "'", '\\', '/', '-', '_', '+'];
								charsToRemove.forEach((c) => {
									filtro.texto = replaceAll(filtro.texto, c, '');
								});
							}
							sender.setState({ filtro: filtro });
						}}
						style={{ outline: 'none', boxShadow: 'none', borderColor: '#ced4da' }}
					/>
					<InputGroup.Append>
						<InputGroup.Text style={{ padding: '1px 6px 1px 6px' }}>
							<button type='submit' style={{ border: 0, outline: 'transparent' }} tabIndex={-1}>
								<FontAwesomeIcon
									icon={faSearch}
									style={{ fontSize: 26, color: '#555', marginBottom: -4 }}
								/>
							</button>
						</InputGroup.Text>
					</InputGroup.Append>
				</InputGroup>
			</Form.Group>
		);
	}

	inserirClick() {
		let fnInserir = () => {
			var item = this.getItemVazio();
			if (this.definirValoresPadrao) {
				item = this.definirValoresPadrao(item);
			}
			this.setState({ itemSelecionado: item }, () => {
				this.setState({ navegando: false, alterando: false, incluindo: true }, () =>
					this.aposInserir ? this.aposInserir(this) : null
				);
			});
		};

		if (this.antesDeInserir) {
			this.antesDeInserir(this).then(() => {
				fnInserir();
			});
		} else {
			fnInserir();
		}
	}

	editarClick(item) {
		if (!this.state.podeAlterar) {
			return;
		}

		item = JSON.parse(JSON.stringify(item));
		if (this.antesDeEditar) {
			this.antesDeEditar(this, item).then(() => {
				this.setState({ itemSelecionado: item, versaoAnterior: item }, () => {
					this.setState({ navegando: false, alterando: true, incluindo: false }, () =>
						this.aposEditar ? this.aposEditar(this) : null
					);
				});
			});
		} else {
			this.setState({ itemSelecionado: item, versaoAnterior: item }, () =>
				this.setState({ navegando: false, alterando: true, incluindo: false }, () =>
					this.aposEditar ? this.aposEditar(this) : null
				)
			);
		}
	}

	cancelarClick() {
		return new Promise((resolve) => {
			this.setState(
				{
					navegando: this.props.select ? false : true,
					alterando: false,
					incluindo: false,
					itemSelecionado: this.getItemVazio(),
				},
				() => {
					if (this.props.select && this.props.select.aoCancelar) {
						this.props.select.aoCancelar();
					}
					if (this.props.modal && this.props.aoCancelar) {
						this.props.aoCancelar();
					}
					resolve();
				}
			);
		});
	}

	excluirClick(item) {
		showConfirm('Deseja realmente excluir este registro?', () => {
			this.excluir(item);
		});
	}

	excluir(item) {
		if (this.antesDeExcluir) {
			this.antesDeExcluir(this);
		}
		this.props.api.delete(this.props.url + '/' + item.id).then(() => {
			showInfo('Excluído com sucesso!');
			this.setState({
				navegando: true,
				alterando: false,
				incluindo: false,
				items: [],
				itemSelecionado: this.getItemVazio(),
			});
			this.filtrar(this);
		});
	}

	renderizarCabecaolhoAcoes() {
		return this.props.select ? null : <th className='acoes'>Ações</th>;
	}

	renderizarCodigo(codigo) {
		return <td className='codigo'>{codigo}</td>;
	}

	renderizarAcoes(item) {
		let result = [];
		if (!this.props.select) {
			result.push(
				<td key='acoes' className='acoes' style={{ textAlign: 'center' }}>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div style={{ display: 'table-cell' }}>
							<BotaoAlterarItemDeCadastro onClick={() => this.editarClick(item)} />
						</div>
						{this.state.podeExcluir && (
							<div style={{ display: 'table-cell' }}>
								<BotaoExcluirItemDeCadastro onClick={() => this.excluirClick(item)} />
							</div>
						)}
					</div>
				</td>
			);
		}
		return result;
	}

	formEdicaoSubimit(event) {
		event.preventDefault();
		this.salvar();
	}

	salvar() {
		if (this.antesDeSalvar) {
			this.antesDeSalvar(this);
		}

		let self = this;
		this.setState({ botaoSalvarHabilitado: false });
		this.getObjetoDeDados(this)
			.then((input) => {
				this.setState({ botaoSalvarHabilitado: true });
				if (self.state.incluindo) {
					self.props.api.post(self.props.url, input).then((id) => {
						if (
							(self.props.select && self.props.select.aoSelecionar) ||
							(self.props.modal && self.props.aoSelecionar)
						) {
							self.props.api.getAll(self.props.url + '?$filter=id eq ' + id.toString()).then((result) => {
								if (self.props.select && self.props.select.aoSelecionar) {
									self.props.select.aoSelecionar(result[0], true);
								}
								if (self.props.modal && self.props.aoSelecionar) {
									self.props.aoSelecionar(result[0], true);
								}
							});
						} else {
							// let filtro = self.state.filtro;
							// filtro.texto = '#' + result.toString();
							self.setState({
								navegando: true,
								alterando: false,
								incluindo: false,
								items: [],
								itemSelecionado: self.getItemVazio(),
								// filtro: filtro,
							});
							// showInfo('Salvo com sucesso!').then(() => {
							self.filtrar(self);
							//});
						}
					});
				} else if (self.state.alterando) {
					self.props.api.put(self.props.url, input).then((result) => {
						if (
							(self.props.select && self.props.select.aoSelecionar) ||
							(self.props.modal && self.props.aoSelecionar)
						) {
							self.props.api
								.getAll(self.props.url + '?$filter=id eq ' + input.id.toString())
								.then((result) => {
									if (self.props.select && self.props.select.aoSelecionar) {
										self.props.select.aoSelecionar(result[0], true);
									}
									if (self.props.modal && self.props.aoSelecionar) {
										self.props.aoSelecionar(result[0], true);
									}
								});
						} else {
							// let filtro = self.state.filtro;
							// filtro.texto = "#" + result.toString();
							self.setState({
								navegando: true,
								alterando: false,
								incluindo: false,
								items: [],
								itemSelecionado: self.getItemVazio(),
								consultou: true,
								// filtro: filtro
							});
							showInfo('Salvo com sucesso!').then(() => {
								self.filtrar(self);
							});
						}
					});
				}
			})
			.catch(() => {
				this.setState({ botaoSalvarHabilitado: true });
			});
	}

	getTitulo() {
		return (
			<div
				style={{
					backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
					color: LayoutParams.colors.corSecundaria,
					borderRadius: 0,
					marginLeft: 0,
					marginRight: 0,
				}}
			>
				<div style={{ paddingTop: 0, paddingLeft: 10, paddingRight: 10, height: 45, display: 'flex' }}>
					<div
						style={{
							display: 'table-cell',
							width: '0',
							overflowX: 'visible',
							fontSize: 30,
							fontWeight: 500,
							whiteSpace: 'nowrap',
						}}
					>
						<span>{this.props.titulo}</span>
					</div>

					{this.state.navegando && this.state.podeIncluir && (
						<div style={{ display: 'table-cell', width: '100%' }}>
							<div style={{ textAlign: 'right', paddingRight: 5, paddingTop: 8 }}>
								<FontAwesomeIcon
									onClick={this.inserirClick}
									icon={faPlusCircle}
									style={{ fontSize: 30, color: '', marginBottom: -4, cursor: 'pointer' }}
								/>
							</div>
						</div>
					)}
					{(this.state.incluindo || this.state.alterando) && (
						<div
							style={{
								display: 'table-cell',
								width: '100%',
								maxWidth: 800,
								textAlign: 'right',
								margin: 'auto',
								paddingBottom: 6,
								paddingRight: 15,
							}}
						>
							<ButtonGroup
								style={{
									marginLeft: 'auto',
									marginRight: 0,
									marginTop: 5,
									backgroundColor: 'white',
									borderRadius: 4,
								}}
							>
								<Button
									variant='secondary'
									onClick={this.cancelarClick}
									style={{ width: 130, display: 'flex', padding: 2, opacity: 0.8 }}
									title={'cancelar ' + (this.state.incluindo ? 'inclusão' : 'alterações')}
								>
									<FontAwesomeIcon
										icon={faTimesCircle}
										style={{ fontSize: 30, paddingRight: 5, margin: 'auto 5px auto auto' }}
									/>
									<span style={{ margin: 'auto auto auto 0' }}>cancelar</span>
								</Button>
								{((this.state.incluindo && this.state.podeIncluir) ||
									(this.state.alterando && this.state.podeAlterar)) && (
									<Button
										variant='dark'
										disabled={!this.state.botaoSalvarHabilitado}
										onClick={this.salvar}
										style={{ width: 130, display: 'flex', padding: 2, opacity: 0.8 }}
									>
										<FontAwesomeIcon
											icon={faSave}
											style={{ fontSize: 30, paddingRight: 5, margin: 'auto 5px auto auto' }}
										/>
										<span style={{ margin: 'auto auto auto 0' }}>salvar</span>
									</Button>
								)}
							</ButtonGroup>
						</div>
					)}
				</div>
			</div>
		);
	}

	getFiltros() {
		return (
			<form
				style={{
					paddingTop: 8,
					paddingLeft: 10,
					paddingRight: 10,
					height: 50,
				}}
				onSubmit={this.formConsultaSubmit}
				action='/'
				name='formConsulta'
				id='formConsulta'
			>
				{this.renderizarFiltros(this)}
			</form>
		);
	}

	getCabecalhos() {
		return (
			<CabecalhoTabelaPadraoStyled style={{ maxHeight: 28 }}>
				<Table striped bordered hover size='sm'>
					<thead>
						<tr>
						<th style={{width: 0}}></th>
							{this.getTitulosDaTabela().map((item, index) => {
								return (
									<th
										key={index}
										width={item.width}
										className={item.className}
										onClick={() => {
											if (item.orderby) {
												let ordenacao = item.orderby;
												if (ordenacao === this.state.ordenacao) {
													ordenacao += ' desc';
												}
												this.setState({ ordenacao: ordenacao }, () => {
													this.filtrar();
												});
											}
										}}
										style={{ cursor: item.orderby ? 'pointer' : 'default' }}
									>
										{item.titulo}
									</th>
								);
							})}
							{this.renderizarCabecaolhoAcoes()}
						</tr>
					</thead>
				</Table>
			</CabecalhoTabelaPadraoStyled>
		);
	}

	getLista() {
		const tamanhos = this.getTitulosDaTabela().map((i) => i.width);
		const classes = this.getTitulosDaTabela().map((i) => i.className);
		return this.state.vazio ? (
			<div style={{ marginTop: 50, marginBottom: 50, textAlign: 'center', width: '100%', height: '100%' }}>
				<span>nenhum registro encontrado...</span>
			</div>
		) : (
			<TabelaPadrao style={{ overflowY: 'scroll' }} modoSelecao={this.props.select ? true : false}>
				<tbody>
					{this.state.itens.map((item, rowIndex) => {
						return (
							<tr
								key={rowIndex}
								className={this.props.select ? 'noselect' : null}
								style={{ cursor: this.props.select ? 'pointer' : 'default' }}
								onDoubleClick={() => this.handleDoubleClick(item)}
								onClick={() => this.handleClick(item)}
							>
								<td style={{width: 0}}></td>
								{[
									this.getDadosDaTabela(item).map((dado, campoIndex) => {
										return (
											<td
												key={campoIndex}
												width={tamanhos[campoIndex]}
												className={classes[campoIndex]}
											>
												{dado}
											</td>
										);
									}),
									this.renderizarAcoes(item),
								]}
							</tr>
						);
					})}
				</tbody>
			</TabelaPadrao>
		);
	}

	getFormulario() {
		return (
			<Row
				className='justify-content-md-center mx-0'
				style={{ overflowY: 'auto', overflowX: 'hidden', paddingTop: 5 }}
			>
				<Col style={{ maxWidth: 800, minHeight: 400 }}>{this.renderizarFormulario(this)}</Col>
			</Row>
		);
	}

	getNavegador() {
		return (
			<div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
				{this.props.select && !this.state.incluindo && (
					<div style={{ width: '100%', textAlign: 'left' }}>
						<Button
							variant='secondary'
							onClick={this.cancelarClick}
							style={{ width: 150 }}
							title={'fechar'}
						>
							fechar
						</Button>
					</div>
				)}

				{this.state.itens ? (
					<ButtonGroup className='mr-2' aria-label='First group' style={{ width: 120 }}>
						<Button
							title={'voltar ' + this.state.tamanhoDaPagina.toString()}
							variant='secondary'
							onClick={() => this.navegar(1)}
							disabled={!this.state.podeVoltar}
							style={{ cursor: this.state.podeVoltar ? 'pointer' : 'not-allowed' }}
						>
							<FontAwesomeIcon icon={faBackward} />
						</Button>{' '}
						<Button
							title={'avançar ' + this.state.tamanhoDaPagina.toString()}
							variant='secondary'
							onClick={() => this.navegar(2)}
							disabled={!this.state.podeAvancar}
							style={{ cursor: this.state.podeAvancar ? 'pointer' : 'not-allowed' }}
						>
							<FontAwesomeIcon icon={faForward} />
						</Button>{' '}
						{/* <Button variant='secondary'>
						<FontAwesomeIcon icon={faFastForward} />
					</Button> */}
					</ButtonGroup>
				) : null}
			</div>
		);
	}

	render() {
		var fn = () => {
			return (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						maxHeight: '100%',
						overflowY: 'hidden',
						width: '100%',
						height: '100%',
					}}
				>
					{!this.props.esconderTitulo && this.getTitulo()}

					{this.state.navegando && this.getFiltros()}

					{this.state.navegando && this.getCabecalhos()}

					{this.state.navegando && this.getLista()}

					{(this.state.incluindo || this.state.alterando) &&
						this.state.mostrarFormulario &&
						this.getFormulario()}

					{this.state.navegando && this.getNavegador()}
				</div>
			);
		};
		if (this.props.modal) {
			return (
				<Modal
					show={true}
					scrollable={true}
					size={'lg'}
					onHide={() => {}}
					onKeyDown={(e) => {
						if (e.keyCode === 27) this.setState({ inserindo: false });
					}}
					dialogClassName='h-100'
				>
					<Modal.Body
						style={{
							overflow: 'hidden',
							display: 'flex',
							position: 'relative',
							fontSize: 13,
							padding: '0 0 0 0',
							maxHeight: '100%',
						}}
					>
						{fn()}
					</Modal.Body>
				</Modal>
			);
		} else {
			return fn();
		}
	}
}

export const BotaoAlterarItemDeCadastro = ({ onClick }) => {
	return (
		<FontAwesomeIcon
			title='alterar'
			style={{ fontSize: 23, paddingTop: 0, marginLeft: 5, marginRight: 5 }}
			cursor='pointer'
			icon={faEdit}
			onClick={onClick}
		/>
	);
};

export const BotaoExcluirItemDeCadastro = ({ onClick }) => {
	return (
		<FontAwesomeIcon
			title='excluir'
			style={{ fontSize: 23, paddingTop: 0, marginLeft: 5, marginRight: 5 }}
			cursor='pointer'
			icon={faTrashAlt}
			onClick={onClick}
		/>
	);
};

const TabelaPadrao = ({ children, modoSelecao }) => {
	return (
		<TabelaPadraoStyled>
			<Table striped={!modoSelecao} bordered hover size='sm'>
				{children}
			</Table>
		</TabelaPadraoStyled>
	);
};

const CabecalhoTabelaPadraoStyled = styled.div`
	min-height: 31px;
	max-height: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
	padding-left: 10px;
	position: relative;
	margin-right: 10px;

	table {
		min-height: 30px;
		max-height: 30px;
		position: relative;
		display: block;
		margin: 0;
		overflow: hidden;
	}

	table > thead {
		display: block;
	}

	table > thead > tr > th {
		vertical-align: top;
		word-break: break-word;
	}

	table .codigo {
		min-width: 60px;
		max-width: 60px;
	}

	table .acoes {
		min-width: 80px;
		max-width: 80px;
		text-align: center;
	}

	table .right {
		text-align: right;
	}

	.nowrap {
		white-space: nowrap;
	}
`;

const TabelaPadraoStyled = styled.div`
	margin-top: -1px;
	max-height: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
	padding-left: 10px;
	position: relative;
	margin-right: 10px;
	height: 100%;

	table {
		position: relative;
	}

	table > tbody {
		display: block;
	}

	table > tbody > tr > td {
		vertical-align: middle;
		word-break: break-word;
	}

	table .codigo {
		min-width: 60px;
		max-width: 60px;
	}

	table .acoes {
		min-width: 80px;
		max-width: 80px;
		text-align: center;
	}

	table .right {
		text-align: right;
	}

	.nowrap {
		white-space: nowrap;
	}
`;
