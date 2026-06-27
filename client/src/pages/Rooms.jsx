import { useEffect, useMemo, useState } from 'react';
import { Menu, MessageSquarePlus, Search, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import RoomCard from '../components/RoomCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Rooms = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/rooms');
        setRooms(data);
      } catch (apiError) {
        const message = apiError.response?.data?.message || 'Could not load rooms.';
        setError(message);
        toast.error(message);

        if (apiError.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [logout, navigate]);

  const filteredRooms = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return rooms;

    return rooms.filter((room) => room.name.toLowerCase().includes(query));
  }, [rooms, search]);

  const handleCreateRoom = async (event) => {
    event.preventDefault();

    if (!roomName.trim()) {
      toast.error('Room name is required.');
      return;
    }

    try {
      setCreating(true);
      const { data } = await api.post('/rooms', { name: roomName });
      setRooms((current) => [data, ...current]);
      setRoomName('');
      toast.success('Room created.');
    } catch (apiError) {
      const message = apiError.response?.data?.message || 'Could not create room.';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const openRoom = (room) => {
    navigate(`/rooms/${room._id}`);
  };

  return (
    <div className="flex min-h-screen bg-app-gradient text-white">
      <Sidebar
        user={user}
        open={sidebarOpen}
        activeDashboard
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onRoomsClick={() => {
          setSidebarOpen(false);
          navigate('/rooms');
        }}
      />

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            className="rounded-md p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-sm font-semibold text-white">ChatLite</span>
          <span className="h-10 w-10" />
        </header>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-200">Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Your Rooms</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:w-auto">
              <div className="rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
                <p className="text-xs text-slate-500">Rooms</p>
                <p className="text-2xl font-bold text-white">{rooms.length}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
                <p className="text-xs text-slate-500">Signed in</p>
                <p className="line-clamp-1 text-lg font-semibold text-white">{user?.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Input
              label="Search rooms"
              icon={Search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by room name"
            />

            <form
              onSubmit={handleCreateRoom}
              className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-panel backdrop-blur-xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Input
                  label="Create room"
                  icon={MessageSquarePlus}
                  value={roomName}
                  onChange={(event) => setRoomName(event.target.value)}
                  placeholder="Design team"
                  className="flex-1"
                />
                <Button type="submit" loading={creating} icon={<MessageSquarePlus className="h-4 w-4" />}>
                  Create
                </Button>
              </div>
            </form>
          </div>

          {error ? (
            <div className="mt-6 rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <div className="mt-7">
            {loading ? (
              <Loader label="Loading rooms..." />
            ) : filteredRooms.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredRooms.map((room) => (
                  <RoomCard key={room._id} room={room} onJoin={openRoom} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={UsersRound}
                title={rooms.length ? 'No matching rooms' : 'No rooms yet'}
                description={
                  rooms.length
                    ? 'Try a different search term.'
                    : 'Create the first room and start a real-time conversation.'
                }
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Rooms;
