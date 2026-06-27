import { ArrowRight, CalendarDays, MessageSquareText, UserRound } from 'lucide-react';
import Button from './Button.jsx';

const formatDate = (value) => {
  if (!value) return 'Recently';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
};

const RoomCard = ({ room, onJoin }) => (
  <article className="group rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-panel backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/[0.07]">
    <div className="flex items-start justify-between gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-300/20 to-sky-400/20 text-emerald-200 ring-1 ring-white/10">
        <MessageSquareText className="h-6 w-6" />
      </div>
      <Button size="sm" variant="secondary" icon={<ArrowRight className="h-4 w-4" />} onClick={() => onJoin(room)}>
        Join
      </Button>
    </div>

    <div className="mt-5">
      <h3 className="line-clamp-1 text-lg font-semibold text-white">{room.name}</h3>
      <div className="mt-4 grid gap-2 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-500" />
          <span>{formatDate(room.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-slate-500" />
          <span className="line-clamp-1">{room.createdBy?.name || 'ChatLite user'}</span>
        </div>
      </div>
    </div>
  </article>
);

export default RoomCard;
