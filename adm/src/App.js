

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom';
import { NoMatch } from './views/NoMatch';
import Home from './views/Home';
import Login from './views/Login';
import Logoff from './views/Logoff';
import Usuario from './views/Usuario';
import Jogador from './views/Jogador';
import MainLayout from './components/MainLayout';
import SessionManager from './scripts/SessionManager';
import Parametros from './views/Parametros';
import PerfilDeUsuario from './views/PerfilDeUsuario';
import Api from './scripts/Api';
import Feriado from './views/Feriado';
import Acao from './views/Acao';
import Semana from './views/Semana';
import Dashboard from './views/Dashboard';
import Ganhadores from './views/Ganhadores';
import Banco from './views/Banco';
import Liga from './views/Liga';
import GerenciaDeLiga from './views/GerenciaDeLiga';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.api = new Api();
	}

	render() {
		var sessionManager = new SessionManager();
		if (sessionManager.isAuthenticated()) {
			return (
				<HashRouter >
					<MainLayout>
						<Switch>
							<Route exact path='/' render={() => <Home api={this.api} />} />
							<Route path='/login' component={Login} />
							<Route path='/sair' component={Logoff} />
							<Route path='/perfilusuario' render={() => <PerfilDeUsuario api={this.api} />} />
							<Route path='/usuarios' render={() => <Usuario api={this.api} />} />
							<Route path='/jogadores' render={() => <Jogador api={this.api} />} />
							<Route path='/parametros' render={() => <Parametros api={this.api} />} />
							<Route path='/feriado' render={() => <Feriado api={this.api} />} />
							<Route path='/acao' render={() => <Acao api={this.api} />} />
							<Route path='/semanas' render={() => <Semana api={this.api} />} />
							<Route path='/dashboard' render={() => <Dashboard api={this.api} />} />
							<Route path='/ganhadores' render={() => <Ganhadores api={this.api} />} />
							<Route path='/banco' render={() => <Banco api={this.api} />} />
							<Route path='/ligas' render={() => <Liga api={this.api} />} />
							<Route path='/gerenciarligas' render={() => <GerenciaDeLiga api={this.api} />} />
							<Route component={NoMatch} />
						</Switch>
					</MainLayout>
				</HashRouter >
			);
		} else {
			return (
				<React.Fragment>
					<Router>
						<Route component={Login} />
					</Router>
				</React.Fragment>
			);
		}
	}

	componentDidCatch(error, info) {
		console.log(error);
		console.log(info);
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}
}
