import React, { Component, } from 'react';
import SessionManager from './../scripts/SessionManager';
import IconeJogar from './../img/jogar.png';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.sessionManager = new SessionManager();
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <div>
                    <br />
                    <br />
                    <br />
                    <span style={{ fontSize: 32, fontWeight: 500 }}>Como jogar:</span>
                    <br />
                    <br />
                    <br />
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 500,
                            maxWidth: 400,
                            textAlign: 'left',
                            margin: 'auto',
                            padding: 10,
                        }}
                    >
                        <span>1. Clique em </span>
                        <img src={IconeJogar} alt='icone-jogar' style={{ height: 32 }} />
                        <br />
                        <br />
                        <span>2. Escolha as ações conforme sua</span>
                        <br />
                        <span>performance para a semana.</span>
                        <br />
                        <br />
                        <span>3. Clique no botão "enviar palpite".</span>
                    </div>
                </div>
            </div>
        );
    }
}