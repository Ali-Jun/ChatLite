import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-500 text-slate-950 shadow-glow hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-400',
  secondary:
    'border border-white/10 bg-white/[0.06] text-white hover:border-emerald-300/40 hover:bg-white/[0.1]',
  ghost: 'text-slate-300 hover:bg-white/[0.07] hover:text-white',
  danger:
    'border border-rose-400/20 bg-rose-500/10 text-rose-100 hover:border-rose-300/50 hover:bg-rose-500/20'
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base'
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={[
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
      'focus:outline-none focus:ring-4 focus:ring-emerald-400/20',
      'disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className
    ].join(' ')}
    {...props}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
    <span>{children}</span>
  </button>
);

export default Button;
