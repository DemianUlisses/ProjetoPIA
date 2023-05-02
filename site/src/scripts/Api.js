import axios from 'axios';
import { showError } from './../scripts/Messages';
import SessionManager from './../scripts/SessionManager';

export const urlBase = 'http://localhost:8010';
//export const urlBase = 'http://167.114.38.230:4001';


export const DEBUG = false;

export default class Api {
    constructor() {
        // this.cache = [];

        this.insertToCache = this.insertToCache.bind(this);
        this.getFromCache = this.getFromCache.bind(this);
        this.getAll = this.getAll.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.finishLoading = this.finishLoading.bind(this);
        this.loading = false;
    }

    insertToCache(url, data) {
        let indice = -1;
        this.cache.map((item, index) => {
            if (item.url === url) {
                indice = index;
            }
            return true;
        });

        if (indice === -1) {
            this.cache.push({
                url: url,
                data: data,
            });
        }
    }

    getFromCache(url) {
        let result = null;
        let indice = -1;
        this.cache.map((item, index) => {
            if (item.url === url) {
                indice = index;
            }
            return true;
        });

        if (indice >= 0) {
            result = this.cache[indice];
        }

        return result;
    }

    urlBase = () => urlBase;

    getOptions(queryParams) {
        let sessionManager = new SessionManager();
        let login = sessionManager.getLogin();
        let headers = null;
        if (login) {
            headers = {
                Authorization: sessionManager.getLogin() ? sessionManager.getLogin().token : null,
                IdDoUsuario: sessionManager.getLogin() ? sessionManager.getLogin().idDoUsuario : null,
            };
        }
        let result = {
            headers: headers,
            params: queryParams,
        };
        return result;
    }

    startLoading() {
        this.loading = true;
        setTimeout(() => {
            if (this.loading) {
                document.getElementById('loading').className = 'loadingDiv';
            }
        }, 2000);
    }

    finishLoading() {
        this.loading = false;
        document.getElementById('loading').className = 'loadingDiv hide';
    }

    post(url, data) {
        return new Promise((resolve, reject) => {
            this.startLoading();
            axios
                .post(urlBase + url, data, this.getOptions())
                .then((result) => {
                    this.finishLoading();
                    resolve(result.data);
                })
                .catch((e) => this.handleErrorMessage(e, this, reject));
        });
    }

    put(url, data) {
        return new Promise((resolve, reject) => {
            this.startLoading();
            axios
                .put(urlBase + url, data, this.getOptions())
                .then((result) => {
                    this.finishLoading();
                    resolve(result.data);
                })
                .catch((e) => this.handleErrorMessage(e, this, reject));
        });
    }

    delete(url) {
        return new Promise((resolve, reject) => {
            this.startLoading();
            axios
                .delete(urlBase + url, this.getOptions())
                .then((result) => {
                    this.finishLoading();
                    resolve(result.data);
                })
                .catch((e) => this.handleErrorMessage(e, this, reject));
        });
    }

    get(url) {
        return new Promise((resolve, reject) => {
            this.startLoading();
            axios
                .get(urlBase + url, this.getOptions())
                .then((result) => {
                    this.finishLoading();
                    resolve(result.data);
                })
                .catch((e) => this.handleErrorMessage(e, this, reject));
        });
    }

    getAll(url, useCache = false) {
        return new Promise((resolve, reject) => {
            let achouNoCache = false;
            let cachedResult = null;

            if (useCache) {
                cachedResult = this.getFromCache(url);
                achouNoCache = cachedResult ? true : false;
            }

            if (!achouNoCache) {
                this.startLoading();
                axios
                    .get(urlBase + url, this.getOptions())
                    .then((result) => {
                        this.finishLoading();
                        if (useCache) {
                            this.insertToCache(url, result.data);
                        }
                        resolve(result.data);
                    })
                    .catch((e) => this.handleErrorMessage(e, this, reject));
            } else {
                resolve(cachedResult.data);
            }
        });
    }

    query(url, queryParams) {
        return new Promise((resolve, reject) => {
            this.startLoading();
            axios
                .get(urlBase + url, this.getOptions(queryParams))
                .then((result) => {
                    this.finishLoading();
                    resolve(result.data);
                })
                .catch((e) => this.handleErrorMessage(e, this));
        });
    }

    handleErrorMessage(e, sender, reject) {
        sender.finishLoading();
        let mensagem = '';
        if (e.response && e.response.data && e.response.data.errorMessage) {
            mensagem = e.response.data.errorMessage;
        } else if (e.response && e.response.data && e.response.data.ExceptionMessage) {
            mensagem = e.response.request.response;
        } else if (e.response && e.response.request && e.response.request.response) {
            mensagem = e.response.request.response;
        } else if (e.response && e.response.statusText) {
            mensagem = e.response.statusText;
        } else {
            mensagem = e.message;
        }

        if (mensagem === 'Network Error') {
            mensagem = 'Servidor indisponível. Tente novamente em instantes.';
        }

        showError(mensagem).then(() => {
            if (e && e.response && e.response.status === 401) {
                window.location = '/';
            }
        });

        if (reject) {
            reject(mensagem);
        }
    }
}
