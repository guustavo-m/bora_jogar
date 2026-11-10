import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiDribbble } from 'react-icons/fi';
import Button from '../components/Button';
import Input from '../components/Input';
import { cadastro } from '../services/api';
import { useAuth } from '../context/useAuth';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const { autenticado, fazerLogin } = useAuth();
    const navegar = useNavigate();

    if (autenticado) return <Navigate to="/" replace />;

    async function enviar(evento) {
        evento.preventDefault();
        setErro('');
        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        setCarregando(true);
        try {
            const dados = await cadastro(nome.trim(), email.trim(), senha);
            fazerLogin(dados);
            navegar('/');
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-12">
            <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-10">
                <div className="mb-7 flex items-center gap-2 text-orange-600"><FiDribbble className="h-7 w-7" /><span className="text-sm font-extrabold uppercase tracking-widest">Bora Jogar?</span></div>
                <p className="eyebrow">Faça parte da comunidade</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900">Crie sua conta</h1>
                <p className="mt-2 text-sm text-stone-500">Cadastre-se para encontrar e organizar partidas.</p>
                <form onSubmit={enviar} className="mt-7 space-y-5">
                    <Input id="nome" label="Nome completo" autoComplete="name" placeholder="Como podemos te chamar?" required value={nome} onChange={e => setNome(e.target.value)} />
                    <Input id="email" label="E-mail" type="email" autoComplete="email" placeholder="voce@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    <Input id="senha" label="Senha" type="password" autoComplete="new-password" placeholder="Mínimo de 6 caracteres" minLength={6} required value={senha} onChange={e => setSenha(e.target.value)} />
                    {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{erro}</p>}
                    <Button type="submit" loading={carregando} className="w-full">Criar minha conta</Button>
                </form>
                <p className="mt-7 text-center text-sm text-stone-500">Já tem uma conta? <Link to="/login" className="font-bold text-orange-600">Entrar</Link></p>
            </div>
        </main>
    );
}