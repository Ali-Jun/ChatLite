import { MessageSquareText } from 'lucide-react';

const EmptyState = ({
  icon: Icon = MessageSquareText,
  title,
  description,
  action,
  className = ''
}) => (
  <div
    className={[
      'flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center',
      className
    ].join(' ')}
  >
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-200">
      <Icon className="h-7 w-7" />
    </div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {description ? <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p> : null}
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;
