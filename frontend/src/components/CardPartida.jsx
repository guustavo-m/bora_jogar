import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiArrowUpRight } from 'react-icons/fi';

function formatarData(data) {
    if (!data) return 'Data não informada';
    const [ano, mes, dia] = String(data).slice(0, 10).split('-').map(Number);
    return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
}

export default function CardPartida({ partida }) {
    const confirmados = Number(partida.participantes_confirmados || 0);
    const vagas = Number(partida.vagas_disponiveis ?? partida.max_participantes);
    return (
        <article className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50">
            <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-orange-700">
                    <span className="h-2 w-2 rounded-full bg-orange-500" /> {partida.esporte || 'Esporte'}
                </span>
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-600">
                    {vagas} {vagas === 1 ? 'vaga' : 'vagas'}
                </span>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-stone-900">{partida.nome}</h3>
            <p className="mt-1 line-clamp-2 min-h-10 text-sm text-stone-500">{partida.descricao || 'Partida aberta para quem quiser participar.'}</p>

            <div className="mt-5 space-y-2.5 text-xs font-medium text-stone-600">
                <p className="flex items-center gap-2"><FiCalendar className="text-orange-500" /> {formatarData(partida.data)}</p>
                <p className="flex items-center gap-2"><FiClock className="text-orange-500" /> {String(partida.horario || '').slice(0, 5)}</p>
                <p className="flex items-center gap-2"><FiMapPin className="text-orange-500" /> <span className="truncate">{partida.local}</span></p>
                <p className="flex items-center gap-2"><FiUsers className="text-orange-500" /> {confirmados} de {partida.max_participantes} participantes</p>
            </div>

            <div className="mt-5 border-t border-stone-100 pt-4">
                <Link to={`/partidas/${partida.id}`} className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 py-2.5 text-xs font-bold text-stone-700 transition group-hover:border-orange-300 group-hover:text-orange-700">
                    Ver detalhes <FiArrowUpRight />
                </Link>
            </div>
        </article>
    );
}