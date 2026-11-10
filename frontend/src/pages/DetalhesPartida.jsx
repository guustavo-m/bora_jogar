import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiCheck, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { API_URL, requisicaoProtegida } from '../services/api';
import { useAuth } from '../context/useAuth';

function formatarData(data) {
    if (!data) return '—';
    const [ano, mes, dia] = String(data).slice(0, 10).split('-').map(Number);
    return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
}

function iniciais(nome = '') {
    return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

export default function DetalhesPartida() {
    const { id } = useParams();
    const { usuario, autenticado } = useAuth();
    const [partida, setPartida] = useState(null);
    const [participantes, setParticipantes] = useState([]);
    const [minhaParticipacao, setMinhaParticipacao] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');
    const [toast, setToast] = useState('');

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro('');
        try {
            const [dadosPartida, listaParticipantes] = await Promise.all([
                fetch(`${API_URL}/partidas/${id}`).then(async r => {
                    const dados = await r.json();
                    if (!r.ok) throw new Error(dados.mensagem || 'Partida não encontrada');
                    return dados;
                }),
                fetch(`${API_URL}/partidas/${id}/participantes`).then(r => r.json())
            ]);
            setPartida(dadosPartida);
            setParticipantes(Array.isArray(listaParticipantes) ? listaParticipantes : []);

            if (autenticado) {
                const minhas = await requisicaoProtegida('/participacoes/minhas');
                setMinhaParticipacao(minhas.find(p => Number(p.partida_id) === Number(id)) || null);
            } else {
                setMinhaParticipacao(null);
            }
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }, [id, autenticado]);

    useEffect(() => { carregar(); }, [carregar]);

    async function solicitar() {
        setEnviando(true);
        try {
            const resposta = await requisicaoProtegida(`/participacoes/partida/${id}`, { method: 'POST' });
            setMinhaParticipacao(resposta.participacao);
            setToast(resposta.mensagem || 'Solicitação enviada!');
            await carregar();
        } catch (error) {
            setToast(error.message);
        } finally {
            setEnviando(false);
        }
    }

    if (carregando) return <div className="page-container"><Loading texto="Carregando partida..." /></div>;
    if (erro || !partida) return <main className="page-container py-16"><p className="text-red-600">{erro || 'Partida não encontrada.'}</p><Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600"><FiArrowLeft /> Voltar</Link></main>;

    const confirmados = Number(partida.participantes_confirmados ?? participantes.length);
    const limite = Number(partida.max_participantes);
    const vagas = Math.max(0, Number(partida.vagas_disponiveis ?? limite - confirmados));
    const souOrganizador = Number(usuario?.id) === Number(partida.organizador_id);
    const status = minhaParticipacao?.status;
    const progresso = limite ? Math.min(100, confirmados / limite * 100) : 0;

    let textoBotao = 'Confirmar presença';
    let variante = 'primary';
    let desabilitado = false;
    if (!autenticado) textoBotao = 'Entre para participar';
    else if (souOrganizador) { textoBotao = 'Você organiza esta partida'; desabilitado = true; variante = 'soft'; }
    else if (status === 'aprovado') { textoBotao = 'Presença confirmada'; desabilitado = true; variante = 'soft'; }
    else if (status === 'pendente') { textoBotao = 'Solicitação enviada'; desabilitado = true; variante = 'soft'; }
    else if (status === 'rejeitado' || status === 'cancelado') { textoBotao = `Solicitação ${status}`; desabilitado = true; variante = 'secondary'; }
    else if (vagas <= 0) { textoBotao = 'Partida lotada'; desabilitado = true; }

    return (
        <main className="page-container pb-16 pt-8 sm:pt-12">
            <Link to="/" className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-orange-600"><FiArrowLeft /> Voltar às partidas</Link>

            <section className="flex flex-col justify-between gap-5 border-b border-stone-100 pb-7 sm:flex-row sm:items-end">
                <div>
                    <p className="eyebrow">{partida.esporte}</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">{partida.nome}</h1>
                    <p className="mt-2 text-sm text-stone-500">{partida.descricao || 'Partida amistosa para jogadores de todos os níveis.'}</p>
                </div>
                {autenticado ? (
                    <Button onClick={solicitar} loading={enviando} disabled={desabilitado} variant={variante}>
                        {status === 'aprovado' ? <FiCheck /> : null}{textoBotao}
                    </Button>
                ) : <Link to="/login"><Button>{textoBotao}</Button></Link>}
            </section>

            <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
                <div className="space-y-5">
                    <section className="panel p-5 sm:p-6">
                        <h2 className="font-bold text-stone-900">Informações da partida</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-stone-100 bg-stone-50 p-4"><FiCalendar className="mb-3 text-orange-500" /><p className="text-[11px] text-stone-400">Data</p><p className="mt-1 text-sm font-bold">{formatarData(partida.data)}</p></div>
                            <div className="rounded-xl border border-stone-100 bg-stone-50 p-4"><FiClock className="mb-3 text-orange-500" /><p className="text-[11px] text-stone-400">Horário</p><p className="mt-1 text-sm font-bold">{String(partida.horario).slice(0, 5)}</p></div>
                            <div className="rounded-xl border border-stone-100 bg-stone-50 p-4"><FiMapPin className="mb-3 text-orange-500" /><p className="text-[11px] text-stone-400">Local</p><p className="mt-1 text-sm font-bold">{partida.local}</p></div>
                        </div>
                        <p className="mt-4 text-xs text-stone-400">Organizada por <strong className="text-stone-600">{partida.organizador}</strong></p>
                    </section>

                    <section className="panel p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div><h2 className="font-bold text-stone-900">Participantes confirmados</h2><p className="mt-1 text-xs text-stone-400">{confirmados} pessoas confirmadas</p></div>
                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{confirmados}/{limite}</span>
                        </div>
                        {participantes.length ? (
                            <div className="mt-5 grid gap-x-8 sm:grid-cols-2">
                                {participantes.map(p => (
                                    <div key={p.id || p.usuario_id} className="flex items-center gap-3 border-t border-stone-100 py-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[11px] font-extrabold text-orange-700">{iniciais(p.nome)}</span>
                                        <div><p className="text-sm font-semibold text-stone-800">{p.nome}{Number(p.id) === Number(partida.organizador_id) ? ' (organizador)' : ''}</p><p className="text-[11px] text-stone-400">Confirmado</p></div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="mt-5 text-sm text-stone-500">Ainda não há participantes confirmados.</p>}
                    </section>
                </div>

                <aside className="panel h-fit p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><FiUsers className="h-5 w-5" /></div>
                    <p className="mt-5 text-xs font-medium text-stone-400">Ocupação da partida</p>
                    <p className="mt-1 text-3xl font-black text-stone-900">{confirmados}<span className="ml-1 text-sm font-semibold text-stone-400">de {limite}</span></p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${progresso}%` }} /></div>
                    <p className="mt-4 text-sm font-bold text-stone-800">{vagas} {vagas === 1 ? 'vaga disponível' : 'vagas disponíveis'}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-400">Solicite sua participação para garantir sua vaga. O organizador precisa aprovar.</p>
                </aside>
            </div>
            <Toast mensagem={toast} tipo={toast.toLowerCase().includes('erro') || toast.toLowerCase().includes('não') ? 'erro' : 'sucesso'} aoFechar={() => setToast('')} />
        </main>
    );
}