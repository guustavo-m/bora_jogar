const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function requisicao(url, opcoes = {}, protegida = false) {
    const token = localStorage.getItem('token');

    const headers = {
        ...(opcoes.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...opcoes.headers
    };

    if (protegida && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const resposta = await fetch(
        url.startsWith('http') ? url : `${API_URL}${url}`,
        { ...opcoes, headers }
    );

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        if (resposta.status === 401 && protegida) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.dispatchEvent(new Event('sessao-expirada'));
        }
        throw new Error(dados.mensagem || 'Erro na comunicação com o servidor');
    }

    return dados;
}

export function login(email, senha) {
    return requisicao('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
    });
}

export function cadastro(nome, email, senha) {
    return requisicao('/api/auth/cadastro', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha })
    });
}

export function requisicaoProtegida(url, opcoes = {}) {
    return requisicao(url, opcoes, true);
}

export { API_URL };