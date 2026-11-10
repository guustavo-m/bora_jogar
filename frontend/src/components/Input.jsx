export default function Input({
    label,
    id,
    error,
    className = '',
    as = 'input',
    children,
    ...props
}) {
    const Component = as;
    return (
        <div className={className}>
            {label && <label className="field-label" htmlFor={id}>{label}</label>}
            <Component id={id} className="field-control" {...props}>
                {children}
            </Component>
            {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}