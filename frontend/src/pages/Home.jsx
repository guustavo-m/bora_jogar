import { Link } from 'react-router-dom';
import {
    FiArrowRight,
    FiCalendar,
    FiMapPin,
    FiUsers,
    FiSearch,
    FiPlusCircle,
    FiActivity,
    FiCheckCircle,
    FiTarget,
} from 'react-icons/fi';
import { useAuth } from '../context/useAuth';

const esportes = [
    { nome: 'Futebol', emoji: '⚽', detalhe: 'Monte seu time e entre em campo.' },
    { nome: 'Vôlei', emoji: '🏐', detalhe: 'Reúna a galera para jogar.' },
    { nome: 'Basquete', emoji: '🏀', detalhe: 'Encontre jogadores para a próxima partida.' },
    { nome: 'Tênis', emoji: '🎾', detalhe: 'Marque um jogo e pratique.' },
];

const etapas = [
    { numero: '01', icone: FiSearch, titulo: 'Encontre uma partida', texto: 'Explore os jogos disponíveis e escolha o que combina com você.' },
    { numero: '02', icone: FiCalendar, titulo: 'Peça para participar', texto: 'Confira as informações e solicite sua vaga na partida.' },
    { numero: '03', icone: FiUsers, titulo: 'Jogue junto', texto: 'Com a participação aprovada, é só se preparar para entrar em quadra ou campo.' },
];

export default function Inicio() {
    const { autenticado } = useAuth();
    const linkCriar = autenticado ? '/criar-partida' : '/cadastro';

    return (
        <main className="overflow-hidden">
            <section className="relative isolate bg-stone-950 text-white">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_20%,rgba(249,115,22,0.28),transparent_45%),radial-gradient(ellipse_at_10%_90%,rgba(234,88,12,0.16),transparent_40%)]" />
                <div className="page-container grid min-h-[570px] items-center gap-12 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[.15em] text-orange-300">
                            <FiActivity /> Esporte, conexão e diversão
                        </span>
                        <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                            Seu próximo jogo <span className="text-orange-400">começa aqui.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-7 text-stone-300 sm:text-lg">
                            Encontre pessoas para praticar seu esporte favorito, participe de partidas e organize seus próprios jogos. A próxima partida pode estar mais perto do que você imagina.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link to="/partidas" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-400">
                                Encontrar partidas <FiArrowRight />
                            </Link>
                            <Link to={linkCriar} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                                <FiPlusCircle /> Criar uma partida
                            </Link>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-stone-400">
                            <span className="inline-flex items-center gap-2"><FiCheckCircle className="text-orange-400" /> Diversos esportes</span>
                            <span className="inline-flex items-center gap-2"><FiCheckCircle className="text-orange-400" /> Partidas organizadas</span>
                            <span className="inline-flex items-center gap-2"><FiCheckCircle className="text-orange-400" /> Novas conexões</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md">
                        <div className="absolute -inset-5 rounded-[2.5rem] bg-orange-500/15 blur-2xl" />
                        <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur sm:p-7">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-300">Bora Jogar?</p>
                                    <h2 className="mt-1 text-xl font-extrabold">A partida ideal te espera</h2>
                                </div>
                                <span className="rounded-xl bg-orange-500/15 p-3 text-orange-300"><FiTarget className="h-6 w-6" /></span>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                {esportes.map(esporte => (
                                    <div key={esporte.nome} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-orange-400/40 hover:bg-white/[0.09]">
                                        <span className="text-3xl">{esporte.emoji}</span>
                                        <h3 className="mt-3 font-bold">{esporte.nome}</h3>
                                        <p className="mt-1 text-xs leading-5 text-stone-400">{esporte.detalhe}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-orange-500 p-4">
                                <span className="rounded-xl bg-white/15 p-2"><FiUsers className="h-5 w-5" /></span>
                                <div>
                                    <p className="text-sm font-extrabold">Jogue com mais pessoas</p>
                                    <p className="mt-0.5 text-xs text-orange-100">Descubra, participe e organize.</p>
                                </div>
                                <FiArrowRight className="ml-auto" />
                            </div>
                        </div>
                        <div className="ml-auto mt-4 flex w-fit items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-stone-900 shadow-xl">
                            <span className="rounded-xl bg-green-50 p-2 text-green-600"><FiMapPin className="h-5 w-5" /></span>
                            <div><p className="text-xs font-bold">Locais das partidas</p><p className="text-[11px] text-stone-500">Confira os locais informados</p></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container py-20 sm:py-24">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="eyebrow">Simples assim</p>
                    <h2 className="section-title mt-3 text-3xl sm:text-4xl">Do primeiro clique ao dia do jogo.</h2>
                    <p className="mt-4 text-sm leading-6 text-stone-500">O Bora Jogar aproxima quem quer praticar esporte. Você encontra uma partida ou organiza a sua.</p>
                </div>
                <div className="mt-12 grid gap-5 md:grid-cols-3">
                    {etapas.map(etapa => {
                        const Icone = etapa.icone;
                        return (
                            <article key={etapa.numero} className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-stone-200/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black tracking-widest text-orange-500">{etapa.numero}</span>
                                    <span className="rounded-xl bg-orange-50 p-3 text-orange-600"><Icone className="h-5 w-5" /></span>
                                </div>
                                <h3 className="mt-6 text-lg font-extrabold text-stone-900">{etapa.titulo}</h3>
                                <p className="mt-2 text-sm leading-6 text-stone-500">{etapa.texto}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="bg-stone-50 py-20 sm:py-24">
                <div className="page-container">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="eyebrow">Tem espaço para todo mundo</p>
                            <h2 className="section-title mt-3 text-3xl sm:text-4xl">Qual é o seu esporte?</h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">Escolha sua modalidade, descubra novas partidas e encontre pessoas que também gostam de jogar.</p>
                        </div>
                        <Link to="/partidas" className="inline-flex items-center gap-2 text-sm font-extrabold text-orange-600 hover:text-orange-700">Explorar partidas <FiArrowRight /></Link>
                    </div>
                    <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {esportes.map(esporte => (
                            <Link to="/partidas" key={esporte.nome} className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg sm:p-6">
                                <span className="text-4xl">{esporte.emoji}</span>
                                <h3 className="mt-4 font-extrabold text-stone-900">{esporte.nome}</h3>
                                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-orange-600">Ver partidas <FiArrowRight className="transition group-hover:translate-x-1" /></span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-container py-16 sm:py-20">
                <div className="relative overflow-hidden rounded-[2rem] bg-orange-500 px-7 py-10 text-white sm:px-12 sm:py-14">
                    <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
                    <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
                        <div className="max-w-xl">
                            <p className="text-xs font-bold uppercase tracking-[.16em] text-orange-100">Chegou a sua vez</p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Não fique só na vontade. Bora jogar?</h2>
                            <p className="mt-3 text-sm leading-6 text-orange-50">Encontre uma partida ou reúna a galera para organizar a próxima.</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link to="/partidas" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-extrabold text-orange-600 transition hover:bg-orange-50">Ver partidas <FiArrowRight /></Link>
                            <Link to={linkCriar} className="inline-flex items-center justify-center rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Criar partida</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
