import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { requisicaoProtegida } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function Perfil() {
    const { usuario, fazerLogin, token } = useAuth();
    const [form, setForm] = useState({ nome: usuario?.nome || '', email: usuario?.email || '' });
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    useEffect(() => {
        if (usuario) setForm({ nome: usuario.nome || '', email: usuario.email || '' });
    }, [usuario]);

    async function salvar(evento) {
        evento.preventDefault();
        setErro('');
        setSucesso('');
        setCarregando(true);
        try {
            const atualizado = await requisicaoProtegida(`/usuarios/${usuario.id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...form, tipo: usuario.tipo })
            });
            fazerLogin({ token, usuario: atualizado });
            setSucesso('Perfil atualizado com sucesso!');
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    if (!usuario) return <div className="page-container"><Loading /></div>;

    return (
        <main className="page-container max-w-3xl pb-16 pt-10 sm:pt-14">
            <p className="eyebrow">Sua conta</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-900">Meu perfil</h1>
            <p className="mt-2 text-sm text-stone-500">Mantenha suas informações atualizadas.</p>
            <form onSubmit={salvar} className="panel mt-8 space-y-5 p-6 sm:p-8">
                <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-xl font-black text-orange-700">{usuario.nome?.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}</span>
                    <div><p className="font-bold text-stone-900">{usuario.nome}</p><p className="mt-1 text-xs text-stone-400">{usuario.tipo === 'admin' ? 'Administrador' : 'Jogador'}</p></div>
                </div>
                <Input id="nome" label="Nome completo" required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                <Input id="email" label="E-mail" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
                {sucesso && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{sucesso}</p>}
                <div className="flex justify-end"><Button type="submit" loading={carregando}>Salvar alterações</Button></div>
            </form>
        </main>
    );
}