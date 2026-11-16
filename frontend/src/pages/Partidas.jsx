import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus, FiSearch } from 'react-icons/fi';
import Button from '../components/Button';
import CardPartida from '../components/CardPartida';
import FiltroEsportes from '../components/FiltroEsportes';
import Loading from '../components/Loading';
import { API_URL } from '../services/api';
import { useAuth } from '../context/useAuth';

export default function Home() {
    const [partidas, setPartidas] = useState([]);
    const [esportes, setEsportes] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtro, setFiltro] = useState('todos');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const { autenticado } = useAuth();

    useEffect(() => {
        async function carregar() {
            try {
                const [resPartidas, resEsportes] = await Promise.all([
                    fetch(`${API_URL}/partidas`),
                    fetch(`${API_URL}/esportes`)
                ]);
                if (!resPartidas.ok || !resEsportes.ok) {
                    throw new Error('Não foi possível carregar partidas e modalidades.');
                }
                const [listaPartidas, listaEsportes] = await Promise.all([
                    resPartidas.json(),
                    resEsportes.json()
                ]);
                setPartidas(Array.isArray(listaPartidas) ? listaPartidas : []);
                setEsportes(Array.isArray(listaEsportes) ? listaEsportes : []);
            } catch (error) {
                setErro(error.message || 'Não foi possível carregar as partidas.');
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    const partidasFiltradas = useMemo(() => {
        return partidas.filter(partida => {
            const termo = busca.toLocaleLowerCase('pt-BR');
            const correspondeBusca = `${partida.nome} ${partida.local} ${partida.esporte}`.toLocaleLowerCase('pt-BR').includes(termo);
            const correspondeEsporte = filtro === 'todos' || String(partida.esporte_id) === filtro;
            return correspondeBusca && correspondeEsporte;
        });
    }, [partidas, busca, filtro]);

    return (
        <main className="page-container pb-16 pt-10 sm:pt-14">
            <section className="flex flex-col justify-between gap-6 border-b border-stone-100 pb-9 sm:flex-row sm:items-end">
                <div>
                    <p className="eyebrow">Partidas perto de você</p>
                    <h1 className="mt-2 max-w-2xl text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">Encontre sua próxima partida!</h1>
                    <p className="mt-3 text-sm text-stone-500">Junte-se a uma turma, encontre novos jogadores e pratique seu esporte favorito.</p>
                </div>
                {autenticado && <Link to="/criar-partida"><Button><FiPlus /> Criar partida</Button></Link>}
            </section>

            <section className="mt-7 space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <label className="relative block w-full lg:max-w-xl">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Busque por nome da partida ou local" className="field-control pl-11" />
                    </label>
                    <FiltroEsportes esportes={esportes} selecionado={filtro} aoSelecionar={setFiltro} />
                </div>
            </section>

            <section className="mt-10">
                <div className="mb-5 flex items-end justify-between">
                    <div>
                        <h2 className="section-title">Partidas disponíveis</h2>
                        <p className="mt-1 text-xs text-stone-400">{partidasFiltradas.length} {partidasFiltradas.length === 1 ? 'partida encontrada' : 'partidas encontradas'}</p>
                    </div>
                </div>

                {carregando ? <Loading texto="Buscando partidas..." /> : erro ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{erro}</div>
                ) : partidasFiltradas.length ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {partidasFiltradas.map(partida => <CardPartida key={partida.id} partida={partida} />)}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-stone-300 px-5 py-16 text-center">
                        <h3 className="font-bold text-stone-800">Nenhuma partida encontrada</h3>
                        <p className="mt-2 text-sm text-stone-500">Tente mudar a pesquisa ou escolha outra modalidade.</p>
                    </div>
                )}
            </section>

            <section className="mt-14 flex flex-col items-start justify-between gap-5 rounded-3xl bg-orange-50 p-7 sm:flex-row sm:items-center sm:p-9">
                <div>
                    <p className="eyebrow">Não encontrou o que procura?</p>
                    <h2 className="mt-2 text-2xl font-black text-stone-900">Organize sua própria partida.</h2>
                    <p className="mt-2 text-sm text-stone-600">Crie um jogo e convide outras pessoas para participar.</p>
                </div>
                <Link to={autenticado ? '/criar-partida' : '/login'} className="inline-flex items-center gap-2 text-sm font-bold text-orange-700 hover:text-orange-800">Começar agora <FiArrowRight /></Link>
            </section>
        </main>
    );
}