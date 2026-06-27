const Input = ({
  label,
  icon: Icon,
  error,
  rightElement,
  className = '',
  inputClassName = '',
  ...props
}) => (
  <label className={`block ${className}`}>
    {label ? <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span> : null}
    <div
      className={[
        'relative rounded-lg border bg-slate-950/50 transition-all',
        error
          ? 'border-rose-400/60 focus-within:ring-4 focus-within:ring-rose-400/10'
          : 'border-white/10 focus-within:border-emerald-300/70 focus-within:ring-4 focus-within:ring-emerald-400/10'
      ].join(' ')}
    >
      {Icon ? (
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      ) : null}
      <input
        className={[
          'h-12 w-full rounded-lg bg-transparent text-white outline-none placeholder:text-slate-500',
          Icon ? 'pl-11' : 'pl-4',
          rightElement ? 'pr-12' : 'pr-4',
          inputClassName
        ].join(' ')}
        {...props}
      />
      {rightElement ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div> : null}
    </div>
    {error ? <span className="mt-2 block text-sm text-rose-300">{error}</span> : null}
  </label>
);

export default Input;
