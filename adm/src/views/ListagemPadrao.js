import React, { Component } from 'react';
import { Button, Form, Table, ButtonGroup, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faBackward, faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { LayoutParams } from '../components/LayoutParams';
import { replaceAll, retirarAcentos } from '../scripts/Utils';

const tamanhoDaPagina = 20;

export default class ListagemPadrao extends Component {
	constructor(props) {
		super(props);

		const { renderizarFiltros, getFiltro, getTitulosDaTabela, getDadosDaTabela } = props;

		this.state = {
			itemSelecionado: null,
			itens: [],
			vazio: false,
			consultou: false,
			filtro: {},
			tamanhoDaPagina: tamanhoDaPagina,
			quantidadeDeDados: 0,
			podeAvancar: false,
			podeVoltar: false,
			ordenacao: this.props.ordenacaoPadrao,
		};

		this.renderizarCodigo = this.renderizarCodigo.bind(this);
		this.getTitulo = this.getTitulo.bind(this);
		this.getFiltros = this.getFiltros.bind(this);
		this.getLista = this.getLista.bind(this);
		this.filtrar = this.filtrar.bind(this);
		this.navegar = this.navegar.bind(this);
		this.getCabecalhos = this.getCabecalhos.bind(this);
		this.getNavegador = this.getNavegador.bind(this);
		this.onRowClick = this.onRowClick.bind(this);
		this.formConsultaSubmit = this.formConsultaSubmit.bind(this);

		this.renderizarFiltros = renderizarFiltros ? renderizarFiltros : this.renderizarFiltros;
		this.getFiltro = getFiltro ? getFiltro : this.getFiltro;
		this.getTitulosDaTabela = getTitulosDaTabela ? getTitulosDaTabela : this.getTitulosDaTabela;
		this.getDadosDaTabela = getDadosDaTabela ? getDadosDaTabela : this.getDadosDaTabela;
		this.getOrdenacao = this.getOrdenacao.bind(this);
	}

	componentDidMount() {
		let searchText = null;
		if (this.props.select) {
			searchText = this.props.select.getSearchText();
		}
		let filtro = this.state.filtro;
		filtro.texto = searchText;
		this.setState({ filtro: filtro }, () => this.filtrar());
	}

	getFiltro() {}

	getTitulosDaTabela() {
		return [];
	}

	getDadosDaTabela() {
		return [];
	}

	/* */

	doClickAction() {
		this.props.onClick();
	}

	onRowClick(item) {
		if (this.props.aoSelecionar) {
			this.props.aoSelecionar(item);
		}
	}

	formConsultaSubmit(event) {
		event.preventDefault();
		this.filtrar();
	}

	getOrdenacao() {
		let result = '';
		if (this.state.ordenacao) {
			result += '&$orderby=' + this.state.ordenacao;
		}
		return result;
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

	renderizarCodigo(codigo) {
		return <td className='codigo'>{codigo}</td>;
	}

	getTitulo() {
		return (
			<div
				style={{
					backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
					color: LayoutParams.colors.corSecundaria,
				}}
			>
				<div style={{ height: 45, display: 'flex' }}>
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
				</div>
			</div>
		);
	}

	getFiltros() {
		return (
			<form
				style={{ height: 50 }}
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
								onClick={() => this.onRowClick(item)}
							>
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
								]}
							</tr>
						);
					})}
				</tbody>
			</TabelaPadrao>
		);
	}

	getNavegador() {
		return (
			<div style={{ width: '100%', display: 'flex', marginBottom: 5 }}>
				<div style={{ width: '100%', display: 'flex' }}>
					{this.props.getAcoes ? this.props.getAcoes() : null}
				</div>

				{this.state.itens ? (
					<div style={{ display: 'flex' }}>
						<ButtonGroup aria-label='First group' style={{ width: 120, justifyContent: 'flex-end' }}>
							<Button
								title={'voltar ' + this.state.tamanhoDaPagina.toString()}
								variant='secondary'
								onClick={() => this.navegar(1)}
								disabled={!this.state.podeVoltar}
								style={{ cursor: this.state.podeVoltar ? 'pointer' : 'not-allowed', maxWidth: '50%' }}
							>
								<FontAwesomeIcon icon={faBackward} />
							</Button>{' '}
							<Button
								title={'avançar ' + this.state.tamanhoDaPagina.toString()}
								variant='secondary'
								onClick={() => this.navegar(2)}
								disabled={!this.state.podeAvancar}
								style={{ cursor: this.state.podeAvancar ? 'pointer' : 'not-allowed', maxWidth: '50%' }}
							>
								<FontAwesomeIcon icon={faForward} />
							</Button>
						</ButtonGroup>
					</div>
				) : null}
			</div>
		);
	}

	render() {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					maxHeight: '100%',
					overflowY: 'hidden',
					width: '100%',
					height: '100%',
					textAlign: 'left',
				}}
			>
				{!this.props.esconderTitulo && this.getTitulo()}

				{this.getFiltros()}

				{this.getCabecalhos()}

				{this.getLista()}

				{this.getNavegador()}
			</div>
		);
	}
}

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
	position: relative;

	table {
		min-height: 30px;
		max-height: 30px;
		position: relative;
		margin: 0;
		overflow: hidden;
	}

	table > thead {
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
`;

const TabelaPadraoStyled = styled.div`
	margin-top: -1px;
	max-height: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
	position: relative;
	height: 100%;

	table {
		position: relative;
	}

	table > tbody {
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
`;
