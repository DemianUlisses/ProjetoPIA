import { Form } from 'react-bootstrap';
import React, { Component } from 'react';
import FormularioPadrao from './FormularioPadrao';
import { isNumeric } from '../scripts/Utils';
import { showError } from '../scripts/Messages';

const titulo = 'Rotinas do sistema';
const url = '/perfilusuario/comborotinas';

export default class RotinaDoSistema extends Component {
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
			{ titulo: 'Descrição', width: '100%', orderby: 'descricao' },
		];
	}

	getDadosDaTabela(item) {
		return [item.id, item.descricao];
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
					<Form.Label>Descrição</Form.Label>
					<Form.Control type='text' defaultValue={sender.state.itemSelecionado.descricao} readOnly={true} />
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
				ordenacaoPadrao={'descricao'}
				permissoes={[23, null, null, null]}
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
