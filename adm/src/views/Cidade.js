import { Form } from 'react-bootstrap';
import React, { Component } from 'react';
import FormularioPadrao from './FormularioPadrao';
import { isNumeric } from '../scripts/Utils';
import { showError } from '../scripts/Messages';

const titulo = 'Cidade';
const url = '/cidade';

export default class Cidade extends Component {
	constructor(props) {
		super(props);

		this.state = {
			comboCbos: [],
		};

		this.getFiltro = this.getFiltro.bind(this);
		this.getTitulosDaTabela = this.getTitulosDaTabela.bind(this);
		this.getDadosDaTabela = this.getDadosDaTabela.bind(this);
		this.renderizarFormulario = this.renderizarFormulario.bind(this);
		this.getObjetoDeDados = this.getObjetoDeDados.bind(this);
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
			{ titulo: 'UF', width: '20%', orderby: 'Estado/UF' },
		];
	}

	getDadosDaTabela(item) {
		return [item.id, item.nome, item.estado.uf];
	}

	getObjetoDeDados() {
		return new Promise((resolve) => {
			resolve();
		});
	}

	renderizarFormulario(sender) {
		return (
			<React.Fragment>
				<Form.Group>
					<Form.Label>Código</Form.Label>
					<Form.Control type='text' readOnly defaultValue={sender.state.itemSelecionado.id} />
				</Form.Group>
				<Form.Group>
					<Form.Label>Cidade</Form.Label>
					<Form.Control type='text' defaultValue={sender.state.itemSelecionado.nome} readOnly={true} />
				</Form.Group>
				<Form.Group>
					<Form.Label>UF</Form.Label>
					<Form.Control type='text' defaultValue={sender.state.itemSelecionado.estado.uf} readOnly={true} />
				</Form.Group>
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
				permissoes={[10, null, null, null]}
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
