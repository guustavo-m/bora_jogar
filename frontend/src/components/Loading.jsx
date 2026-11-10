export default function Loading({ texto = 'Carregando...' }) {
    return (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-stone-500">
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-orange-200 border-t-orange-500" />
            <p className="text-sm">{texto}</p>
        </div>
    );
}