import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ReactDOM from "react-dom";
import App from "./../App";

export default class Logoff extends Component {

    render () {
        sessionStorage.removeItem("usuario");
        ReactDOM.render(<App />, document.getElementById('root'));
        return  <Redirect to={{pathname: "/"}}/>;
    }
}