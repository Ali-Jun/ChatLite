import {
  Hash,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  PanelLeftClose,
  Sparkles,
  UserRound,
  X
} from 'lucide-react';
import Button from './Button.jsx';

const Sidebar = ({
  user,
  rooms = [],
  activeRoomId,
  open = false,
  showRooms = false,
  activeDashboard = false,
  onClose,
  onLogout,
  onRoomSelect,
  onRoomsClick
}) => {
  const panel = (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-50 flex w-80 max-w-[88vw] flex-col border-r border-white/10 bg-slate-950/90 shadow-panel backdrop-blur-2xl transition-transform duration-300 lg:static lg:z-auto lg:w-72 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      ].join(' ')}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <button className="flex items-center gap-3 text-left" onClick={onRoomsClick}>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-300 via-teal-300 to-sky-400 text-slate-950 shadow-glow">
            <MessageSquareText className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-bold text-white">ChatLite</span>
            <span className="flex items-center gap-1 text-xs text-emerald-200">
              <Sparkles className="h-3 w-3" />
              Workspace
            </span>
          </span>
        </button>
        <button
          className="rounded-md p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <button
          className={[
            'mb-5 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition',
            activeDashboard
              ? 'bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-300/20'
              : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
          ].join(' ')}
          onClick={onRoomsClick}
        >
          <LayoutDashboard className="h-5 w-5" />
          Rooms
        </button>

        {showRooms ? (
          <div>
            <div className="mb-3 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span>Channels</span>
              <PanelLeftClose className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              {rooms.map((room) => (
                <button
                  key={room._id}
                  onClick={() => onRoomSelect?.(room)}
                  className={[
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition',
                    activeRoomId === room._id
                      ? 'bg-white/[0.09] text-white ring-1 ring-white/10'
                      : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                  ].join(' ')}
                >
                  <Hash className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{room.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sky-400/15 text-sky-200">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name || 'ChatLite user'}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="danger"
          fullWidth
          icon={<LogOut className="h-4 w-4" />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      {open ? <button className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} aria-label="Close sidebar" /> : null}
      {panel}
    </>
  );
};

export default Sidebar;
