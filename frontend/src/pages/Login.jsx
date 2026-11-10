import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiDribbble } from 'react-icons/fi';
import Button from '../components/Button';
import Input from '../components/Input';
import { login } from '../services/api';
import { useAuth } from '../context/useAuth';

export default function Login() {
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
        setCarregando(true);
        try {
            const dados = await login(email.trim(), senha);
            fazerLogin(dados);
            navegar('/');
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
            <section className="flex items-center justify-center px-5 py-14">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-2 text-orange-600"><FiDribbble className="h-7 w-7" /><span className="text-sm font-extrabold uppercase tracking-widest">Bora Jogar?</span></div>
                    <p className="eyebrow">Que bom ter você de volta</p>
                    <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-900">Entre na sua conta</h1>
                    <p className="mt-3 text-sm text-stone-500">Encontre partidas, conheça pessoas e pratique seu esporte favorito.</p>

                    <form onSubmit={enviar} className="mt-8 space-y-5">
                        <Input id="email" label="E-mail" type="email" autoComplete="email" placeholder="voce@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                        <Input id="senha" label="Senha" type="password" autoComplete="current-password" placeholder="Digite sua senha" required value={senha} onChange={e => setSenha(e.target.value)} />
                        {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{erro}</p>}
                        <Button type="submit" loading={carregando} className="w-full">Entrar na plataforma</Button>
                    </form>

                    <p className="mt-7 text-center text-sm text-stone-500">Ainda não tem conta? <Link to="/cadastro" className="font-bold text-orange-600 hover:text-orange-700">Cadastre-se</Link></p>
                </div>
            </section>
            <aside className="relative hidden overflow-hidden bg-orange-500 p-12 text-white lg:flex lg:flex-col lg:justify-end">
                <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full border-[50px] border-white/10" />
                <div className="absolute -right-5 top-24 h-64 w-64 rounded-full border-[35px] border-white/10" />
                <div className="relative max-w-lg">
                    <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest">Seu próximo jogo começa aqui</span>
                    <h2 className="mt-6 text-5xl font-black leading-tight">O esporte fica melhor quando é compartilhado.</h2>
                    <p className="mt-5 max-w-md text-base leading-7 text-orange-50">Descubra partidas perto de você ou reúna pessoas para organizar a sua.</p>
                </div>
            </aside>
        </main>
    );
}