import React, { Component } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import Api from '../scripts/Api';
import { showError } from '../scripts/Messages';

export class CidadeInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nomeDaCidade: this.getNomeDaCidadeDefault(),
			uf: this.getUFDefault(),
		};

		this.api = new Api();
		this.getCidade = this.getCidade.bind(this);
		this.getNome = this.getNome.bind(this);
		this.getUF = this.getUF.bind(this);
	}

	getCidade(aceitaVazio) {
		return new Promise((resolve, reject) => {
			if (aceitaVazio && !this.state.nomeDaCidade) {
				resolve(null);
				return;
			}

			if (this.state.nomeDaCidade && !this.state.uf) {
				showError('Informe o estado da cidade.');
				reject();
				return;
			}

			let url = '/cidade/buscar?uf=' + this.state.uf + '&cidade=' + encodeURI(this.state.nomeDaCidade);
			this.api
				.getAll(url)
				.then((result) => {
					if (result.length > 1) {
						showError('Existe mais de uma cidade com esse nome.');
						reject();
					} else if (result.length === 0) {
						if (aceitaVazio) {
							resolve(null);
						} else {
							showError('Cidade não localizada.');
							reject();
						}
					} else {
						resolve(result[0]);
					}
				})
				.catch(reject);
		});
	}

	getUFDefault() {
		let result = null;
		if (this.props.defaultValue && this.props.defaultValue.estado) {
			result = this.props.defaultValue.estado.uf;
		}
		return result;
	}

	getNomeDaCidadeDefault() {
		let result = null;
		if (this.props.defaultValue && this.props.defaultValue.nome) {
			result = this.props.defaultValue.nome;
		}
		return result;
	}

	getUF() {
		return this.state.uf;
	}

	getNome() {
		return this.state.nomeDaCidade;
	}

	render() {
		return (
			<div style={{ display: 'flex' }}>
				<div style={{ display: 'table-cell', width: '100%' }}>
					<FormGroup>
						<Form.Label>Cidade</Form.Label>
						<Form.Control
							type='text'
							defaultValue={this.getNomeDaCidadeDefault()}
							onChange={(e) => {
								this.setState({
									nomeDaCidade: e.target.value,
								});
							}}
						/>
					</FormGroup>
				</div>
				<div style={{ display: 'table-cell', width: 80, paddingLeft: 10 }}>
					<FormGroup>
						<Form.Label>UF</Form.Label>
						<Form.Control
							type='text'
							defaultValue={this.getUFDefault()}
							onChange={(e) => {
								this.setState({
									uf: e.target.value,
								});
							}}
						/>
					</FormGroup>
				</div>
			</div>
		);
	}
}
