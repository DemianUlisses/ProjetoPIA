import React, { Component } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Api from './../scripts/Api';
import SessionManager from './../scripts/SessionManager';
import LogoLogin from './../img/logo-login.png';
import { showError } from './../scripts/Messages';
import { LayoutParams } from '../components/LayoutParams';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.api = new Api();
		this.sessionManager = new SessionManager();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();

		var form = event.target;

		let nomeDeUsuario = form.elements.nomeDeUsuario.value;
		let senha = form.elements.senha.value;

		if (!nomeDeUsuario) {
			showError('Informe o usuário.');
			return;
		}

		if (!senha) {
			showError('Informe a senha.');
			return;
		}

		var input = {
			nomeDeUsuario: nomeDeUsuario,
			senha: senha,
		};

		this.api.post('/login/token', input).then((result) => {
			this.sessionManager.setLogin(result);
			window.location = '/';
		});
	}

	render() {
		return (
			<Container
				fluid
				style={{
					fontSize: 15,
					height: '100%',
					display: 'flex',
					position: 'fixed',
					justifyContent: 'center',
					backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
				}}
			>
				<Row className='justify-content-md-center'>
					<Col
						xs
						lg='3'
						style={{
							minHeight: 424,
							maxHeight: 424,
							minWidth: 350,
							maxWidth: 350,
							borderRadius: 10,
							color: 'white',
							paddingTop: 20,
						}}
					>
						<br />
						<img alt='' src={LogoLogin} style={{ width: '100%', margin: "0 auto 10px auto" }} />
						<br />
						<div className='justify-content-md-center'>
							<div>
								<Form onSubmit={this.handleSubmit} action='#' id='formLogin'>
									<Form.Group>
										<Form.Label>Usuário</Form.Label>
										<Form.Control type='text' name='nomeDeUsuario' />
									</Form.Group>
									<Form.Group>
										<Form.Label>Senha</Form.Label>
										<Form.Control type='password' name='senha' />
									</Form.Group>
									<Button
										style={{
											backgroundColor: LayoutParams.colors.corDoTemaPrincipal,
											borderBlockColor: LayoutParams.colors.corSecundaria,
											color: LayoutParams.colors.corSecundaria,
											borderColor: LayoutParams.colors.corSecundaria,
											fontSize: 20,
										}}
										block
										type='submit'
									>
										entrar
									</Button>
								</Form>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}
}
