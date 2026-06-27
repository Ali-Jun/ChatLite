import { motion } from 'framer-motion';
import { MessageSquareText, Sparkles } from 'lucide-react';

const AuthCard = ({ title, subtitle, children, footer }) => (
  <motion.section
    initial={{ opacity: 0, y: 18, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
    className="w-full max-w-md rounded-lg border border-white/10 bg-slate-950/70 p-6 shadow-panel backdrop-blur-2xl sm:p-8"
  >
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-300 via-teal-300 to-sky-400 text-slate-950 shadow-glow">
        <MessageSquareText className="h-7 w-7" />
      </div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
        <Sparkles className="h-3.5 w-3.5" />
        ChatLite
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
    </div>
    {children}
    {footer ? <div className="mt-6 text-center text-sm text-slate-400">{footer}</div> : null}
  </motion.section>
);

export default AuthCard;
