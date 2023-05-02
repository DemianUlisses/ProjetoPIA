export default class SessionManager {
    
    getLogin () {
        let result = JSON.parse(sessionStorage.getItem('usuario'));
        return result;
    };

    setLogin (usuario) {
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
    };

    isAuthenticated () {
        let usuario = JSON.parse(sessionStorage.getItem('usuario'));
        return usuario && usuario.token && (window.location.pathname !== "/login");
    };

    temAcessoARotina (rotina) {
        let result = this.isAuthenticated() &&
            this.getLogin().rotinasAcessiveis.some((i) => i.id === rotina);
        return result;
    }
};