export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
    ...props
}) {
    const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60';
    const variants = {
        primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-100',
        secondary: 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 focus:ring-stone-100',
        soft: 'bg-orange-50 text-orange-700 hover:bg-orange-100 focus:ring-orange-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-100'
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`${base} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            )}
            {children}
        </button>
    );
}