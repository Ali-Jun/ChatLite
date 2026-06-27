import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Menu, Send, Signal, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';
import MessageBubble from '../components/MessageBubble.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { createSocket } from '../socket.js';
import { getDemoMessages, getDemoRooms, isDemoMode, saveDemoMessage } from '../utils/demo.js';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');

  const activeRoom = useMemo(
    () => rooms.find((room) => room._id === roomId),
    [rooms, roomId]
  );

  useEffect(() => {
    const loadRooms = async () => {
      try {
        if (isDemoMode()) {
          setRooms(getDemoRooms());
          return;
        }

        const { data } = await api.get('/rooms');
        setRooms(data);
      } catch (apiError) {
        if (apiError.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        } else {
          toast.error(apiError.response?.data?.message || 'Could not load rooms.');
        }
      }
    };

    loadRooms();
  }, [logout, navigate]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setError('');
        setLoadingMessages(true);

        if (isDemoMode()) {
          setMessages(getDemoMessages(roomId));
          return;
        }

        const { data } = await api.get(`/messages/${roomId}`);
        setMessages(data);
      } catch (apiError) {
        const message = apiError.response?.data?.message || 'Could not load messages.';
        setError(message);
        toast.error(message);

        if (apiError.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        }
      } finally {
        setLoadingMessages(false);
      }
    };

    if (roomId) {
      loadMessages();
    }
  }, [roomId, logout, navigate]);

  useEffect(() => {
    if (!token || !roomId) return undefined;

    if (isDemoMode()) {
      setSocketConnected(true);
      return () => setSocketConnected(false);
    }

    const socket = createSocket(token);
    socketRef.current = socket;
    setSocketConnected(false);

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('joinRoom', roomId, (response) => {
        if (!response?.success) {
          toast.error(response?.message || 'Could not join room.');
        }
      });
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('connect_error', (socketError) => {
      setSocketConnected(false);
      toast.error(socketError.message || 'Chat connection failed.');
    });

    socket.on('newMessage', (message) => {
      if (message.room !== roomId) return;

      setMessages((current) => {
        const alreadyExists = current.some((item) => item._id === message._id);
        return alreadyExists ? current : [...current, message];
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const cleanText = messageText.trim();

    if (!cleanText || sending) return;

    if (isDemoMode()) {
      setSending(true);
      const message = saveDemoMessage(roomId, cleanText, user);
      setMessages((current) => [...current, message]);
      setMessageText('');
      setSending(false);
      return;
    }

    if (!socketRef.current?.connected) {
      toast.error('Chat connection is not ready yet.');
      return;
    }

    setSending(true);
    socketRef.current.timeout(5000).emit(
      'sendMessage',
      { roomId, text: cleanText },
      (socketError, response) => {
        setSending(false);

        if (socketError) {
          toast.error('Message could not be sent.');
          return;
        }

        if (!response?.success) {
          toast.error(response?.message || 'Message could not be sent.');
          return;
        }

        setMessageText('');
      }
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSendMessage(event);
    }
  };

  const openRoom = (room) => {
    setSidebarOpen(false);
    navigate(`/rooms/${room._id}`);
  };

  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-app-gradient text-white">
      <Sidebar
        user={user}
        rooms={rooms}
        activeRoomId={roomId}
        open={sidebarOpen}
        showRooms
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onRoomSelect={openRoom}
        onRoomsClick={() => {
          setSidebarOpen(false);
          navigate('/rooms');
        }}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="rounded-md p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-bold text-white sm:text-xl">
                  {activeRoom?.name || 'Chat room'}
                </h1>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                {socketConnected ? (
                  <>
                    <Signal className="h-3.5 w-3.5 text-emerald-300" />
                    <span className="text-emerald-200">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5 text-slate-500" />
                    <span>Connecting</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/rooms')}
          >
            Rooms
          </Button>
        </header>

        {error ? (
          <div className="border-b border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 sm:px-6">
            {error}
          </div>
        ) : null}

        <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {loadingMessages ? (
            <Loader label="Loading messages..." />
          ) : messages.length > 0 ? (
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwn={message.sender?._id === user?._id}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <EmptyState title="No messages yet" description="Start the conversation." />
              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <form className="border-t border-white/10 bg-slate-950/75 p-4 backdrop-blur-xl sm:p-5" onSubmit={handleSendMessage}>
          <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-2 shadow-panel">
            <textarea
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message..."
              className="max-h-32 min-h-11 flex-1 resize-none rounded-lg bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <Button
              type="submit"
              loading={sending}
              disabled={!messageText.trim()}
              icon={<Send className="h-4 w-4" />}
              className="shrink-0"
            >
              Send
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ChatRoom;
