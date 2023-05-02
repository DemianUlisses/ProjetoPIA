import React, { Component } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { showError } from './../scripts/Messages';
import FormularioPadrao from './../views/FormularioPadrao';
import { DateInput } from '../components/DateInput';
import { isNumeric, dateToString } from '../scripts/Utils';
import { CheckBox } from '../components/CheckBox';

const titulo = 'Feriados';
const url = '/feriado';

export default class Feriado extends Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.getFiltro = this.getFiltro.bind(this);
		this.getTitulosDaTabela = this.getTitulosDaTabela.bind(this);
		this.getDadosDaTabela = this.getDadosDaTabela.bind(this);
		this.renderizarFormulario = this.renderizarFormulario.bind(this);
		this.getObjetoDeDados = this.getObjetoDeDados.bind(this);
		this.carregarCombos = this.carregarCombos.bind(this);
		this.antesDeInserir = this.antesDeInserir.bind(this);
		this.antesDeEditar = this.antesDeEditar.bind(this);
	}

	antesDeInserir() {
		return this.carregarCombos();
	}

	antesDeEditar() {
		return this.carregarCombos();
	}

	carregarCombos() {
		return new Promise((resolve) => {
			resolve();
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
			{ titulo: 'Nome', width: '80%', orderby: 'nome' },
			{ titulo: 'Data', width: '20%', orderby: 'data' },
		];
	}

	getDadosDaTabela(item) {
		return [item.id, item.descricao, dateToString(item.data)];
	}

	getObjetoDeDados(sender) {
		return new Promise((resolve, reject) => {
			let item = sender.state.itemSelecionado;
			if (!item.descricao) {
				showError('Informe o nome do feriado.');
				reject();
				return;
			}

			if (!item.data) {
				showError('Informe a data do feriado.');
				reject();
				return;
			}

			var input = {
				descricao: item.descricao,
				data: item.data,
				nacional: item.nacional,
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
					<Col sm={2} md={2} lg={2}>
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
								defaultValue={sender.state.itemSelecionado.descricao}
								onChange={(e) => {
									sender.state.itemSelecionado.descricao = e.target.value;
								}}
								onInput={(e) => (e.target.value = ('' + e.target.value).toUpperCase())}
							/>
						</Form.Group>
					</Col>
					<Col sm={3} md={3} lg={3}>
						<Form.Group>
							<Form.Label>Data do feriado</Form.Label>
							<DateInput
								defaultValue={sender.state.itemSelecionado.data}
								onChange={(value) => {
									sender.state.itemSelecionado.data = value;
								}}
							/>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Group
							controlId='chkNacional'
							style={{
								margin: 'auto',
								paddingLeft: '5px',
								fontWeight: 'normal',
								width: '100%',
							}}
						>
							<CheckBox
								name='chkNacional'
								label='Nacional'
								style={{ paddingTop: 12 }}
								defaultChecked={sender.state.itemSelecionado.nacional}
								onChange={(checked) => {
									sender.state.itemSelecionado.nacional = checked;
								}}
							/>
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
				ordenacaoPadrao={'data'}
				permissoes={[2510, 2511, 2512, 2513]}
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
