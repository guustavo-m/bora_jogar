import { FiFilter } from 'react-icons/fi';

export default function FiltroEsportes({ esportes = [], selecionado, aoSelecionar }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stone-400">
                <FiFilter /> Modalidade
            </span>
            <button onClick={() => aoSelecionar('todos')} className={`rounded-full px-4 py-2 text-xs font-bold transition ${selecionado === 'todos' ? 'bg-orange-500 text-white' : 'border border-stone-200 text-stone-600 hover:border-orange-300'}`}>
                Todas
            </button>
            {esportes.map(esporte => (
                <button key={esporte.id} onClick={() => aoSelecionar(String(esporte.id))} className={`rounded-full px-4 py-2 text-xs font-bold transition ${selecionado === String(esporte.id) ? 'bg-orange-500 text-white' : 'border border-stone-200 text-stone-600 hover:border-orange-300'}`}>
                    {esporte.nome}
                </button>
            ))}
        </div>
    );
}