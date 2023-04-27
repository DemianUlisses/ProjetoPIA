import React, { Component } from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

export class SubCadastro extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inserindo: false,
			editando: false,
			indiceEmEdicao: null,
		};
		this.setEmEdicao = this.setEmEdicao.bind(this);
	}

	setEmEdicao(indiceEmEdicao) {
		this.setState({ editando: true, indiceEmEdicao: indiceEmEdicao });
	}

	render() {
		return (
			<Row>
				<Col>
					<StyledTable>
						<Table bordered size='sm'>
							<thead>
								<tr style={{ backgroundColor: '#dee2e6' }}>
									<th
										colSpan={10}
										style={{
											fontWeight: 'normal',
											borderBottomStyle: 'solid',
											borderBottomColor: 'lightgray',
											borderBottomWidth: 1,
										}}
									>
										{!this.state.inserindo && !this.state.editando && (
											<Row>
												<Col sm={9} xs={9} md={9} lg={9} xl={9}>
													<div style={{ fontWeight: '600', paddingTop: 5 }}>
														<span>{this.props.titulo}</span>
													</div>
												</Col>
												<Col sm={3} xs={3} md={3} lg={3} xl={3} style={{ textAlign: 'right' }}>
													{this.props.podeInserir !== false && (
														<FontAwesomeIcon
															title='novo'
															style={{ fontSize: 30, paddingTop: 2, paddingRight: 5 }}
															cursor='pointer'
															icon={faPlusCircle}
															onClick={() => {
																this.setState({
																	inserindo: true,
																	editando: false,
																	indiceEmEdicao: null,
																});
															}}
														/>
													)}
												</Col>
											</Row>
										)}

										{(this.state.inserindo || this.state.editando) && (
											<div style={{ padding: 5 }}>
												<Row>
													<Col>{this.props.renderizarFormulario()}</Col>
												</Row>
												<hr style={{ marginTop: 2 }} />
												<Row style={{ justifyContent: 'flex-end' }}>
													<Col
														sm={2}
														xs={2}
														md={2}
														lg={2}
														xl={2}
														style={{ marginRight: -20 }}
													>
														<Button
															variant='secondary'
															size='sm'
															block
															onClick={() => {
																this.props.cancelar().then(() => {
																	this.setState({
																		inserindo: false,
																		editando: false,
																		indiceEmEdicao: null,
																	});
																});
															}}
														>
															cancelar
														</Button>
													</Col>
													<Col
														sm={2}
														xs={2}
														md={2}
														lg={2}
														xl={2}
														style={{ paddingRight: 16 }}
													>
														<Button
															variant='dark'
															size='sm'
															block
															onClick={() => {
																this.state.inserindo
																	? this.props.inserir().then(() => {
																			this.setState({
																				inserindo: false,
																				editando: false,
																				indiceEmEdicao: null,
																			});
																	  })
																	: this.props
																			.alterar(this.state.indiceEmEdicao)
																			.then(() => {
																				this.setState({
																					inserindo: false,
																					editando: false,
																					indiceEmEdicao: null,
																				});
																			});
															}}
														>
															{this.state.editando ? 'OK' : 'inserir'}
														</Button>
													</Col>
												</Row>
											</div>
										)}
									</th>
								</tr>
								{!this.state.inserindo &&
									!this.state.editando &&
									this.props.itens &&
									this.props.itens.length > 0 &&
									this.props.getTitulosDaTabela &&
									this.props.getTitulosDaTabela()}
							</thead>
							{!this.state.inserindo && !this.state.editando && this.props.itens && (
								<tbody>
									{this.props.itens.map((item, index) => {
										return this.props.getDadosDaTabela(item, index, this.setEmEdicao);
									})}
								</tbody>
							)}
							{!this.state.inserindo &&
							!this.state.editando &&
							this.props.itens &&
							this.props.itens.length > 0 &&
							this.props.renderizarRodapeDaTabela ? (
								<tfoot>{this.props.renderizarRodapeDaTabela()}</tfoot>
							) : null}
						</Table>
					</StyledTable>
				</Col>
			</Row>
		);
	}
}

export const BotaoAlterarItemDeSubCadastro = ({ onClick }) => {
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

export const BotaoExcluirItemDeSubCadastro = ({ onClick }) => {
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

const StyledTable = styled.div`
	font-size: 13px;
	tbody > tr {
		vertical-align: middle;
	}
`;
