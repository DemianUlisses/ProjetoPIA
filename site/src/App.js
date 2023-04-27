import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom';
import { NoMatch } from './views/NoMatch';
import Home from './views/Home';
import Login from './views/Login';
import Logoff from './views/Logoff';
import MainLayout from './components/MainLayout';
import SessionManager from './scripts/SessionManager';
import Api from './scripts/Api';
import CadastroDeUsuario from './views/CadastroDeUsuario';
import Jogar from './views/Jogar';
import { LayoutParams } from './components/LayoutParams';
import RecuperarSenha from './views/RecuperarSenha';
import Competicao from './views/Competicao';
import { Ajuda } from './views/Ajuda';
import Dashboard from './views/Dashboard';
import Ganhadores from './views/Ganhadores';
import Conta from './views/Conta';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.api = new Api();
    }

    render() {
        var sessionManager = new SessionManager();
        if (sessionManager.isAuthenticated()) {
            return (
                <HashRouter>
                    <MainLayout>
                        <Switch>
                            <Route exact path='/' render={() => <Home api={this.api} />} />
                            <Route path='/dashboard' render={() => <Dashboard api={this.api} />} />
                            <Route path='/ganhadores' render={() => <Ganhadores api={this.api} />} />
                            <Route path='/conta' render={() => <Conta api={this.api} />} />
                            <Route path='/login' component={Login} />
                            <Route path='/jogar' component={Jogar} />
                            <Route path='/sair' component={Logoff} />
                            <Route path='/competicao' render={() => <Competicao api={this.api} />} />
                            <Route path='/ajuda' component={Ajuda} />
                            <Route component={NoMatch} />
                        </Switch>
                    </MainLayout>
                    <div style={{ display: 'flex', backgroundColor: LayoutParams.colors.corDoTemaPrincipal }}>
                        <span style={{ margin: 'auto', color: 'white' }}>Todos os direitos reservados ®</span>
                    </div>
                </HashRouter>
            );
        } else {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                        position: 'fixed',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ flexBasis: '100%', overflow: 'auto' }}>
                        <Router>
                            <Route exact path='/' component={Login} />
                            <Route path='/cadastro' component={CadastroDeUsuario} />
                            <Route path='/recuperarsenha' component={RecuperarSenha} />
                        </Router>
                    </div>
                    <div style={{ display: 'flex', backgroundColor: LayoutParams.colors.corDoTemaPrincipal }}>
                        <span style={{ margin: 'auto', color: 'white' }}>Todos os direitos reservados ®</span>
                    </div>
                </div>
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
