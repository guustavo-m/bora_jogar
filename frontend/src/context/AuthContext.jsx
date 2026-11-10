import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

function lerUsuarioSalvo() {
    try {
        const salvo = localStorage.getItem('usuario');
        return salvo ? JSON.parse(salvo) : null;
    } catch {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        return null;
    }
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(lerUsuarioSalvo);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    function fazerLogin(dados) {
        setToken(dados.token);
        setUsuario(dados.usuario);
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
    }

    function fazerLogout() {
        setToken(null);
        setUsuario(null);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }

    useEffect(() => {
        const expirada = () => fazerLogout();
        window.addEventListener('sessao-expirada', expirada);
        return () => window.removeEventListener('sessao-expirada', expirada);
    }, []);

    const valor = useMemo(() => ({
        usuario,
        token,
        autenticado: Boolean(token && usuario),
        fazerLogin,
        fazerLogout
    }), [usuario, token]);

    return (
        <AuthContext.Provider value={valor}>
            {children}
        </AuthContext.Provider>
    );
}