import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const estilos = {
    sucesso: { icone: FiCheckCircle, classe: 'border-green-200 bg-green-50 text-green-800' },
    erro: { icone: FiAlertCircle, classe: 'border-red-200 bg-red-50 text-red-800' },
    info: { icone: FiInfo, classe: 'border-orange-200 bg-orange-50 text-orange-800' }
};

export default function Toast({ mensagem, tipo = 'sucesso', aoFechar }) {
    useEffect(() => {
        if (!mensagem) return undefined;
        const timer = setTimeout(aoFechar, 3500);
        return () => clearTimeout(timer);
    }, [mensagem, aoFechar]);

    if (!mensagem) return null;
    const config = estilos[tipo] || estilos.info;
    const Icone = config.icone;

    return (
        <div className={`fixed bottom-5 right-5 z-50 flex max-w-[calc(100%-2.5rem)] items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${config.classe}`} role="status">
            <Icone className="h-5 w-5 shrink-0" />
            <span>{mensagem}</span>
            <button onClick={aoFechar} aria-label="Fechar notificação" className="ml-2 opacity-70 hover:opacity-100">
                <FiX />
            </button>
        </div>
    );
}