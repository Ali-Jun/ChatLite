const DEMO_FLAG_KEY = 'chatlite_demo_mode';
const DEMO_ROOMS_KEY = 'chatlite_demo_rooms';
const DEMO_MESSAGES_KEY = 'chatlite_demo_messages';

export const isDemoMode = () => {
  if (import.meta.env.VITE_DEMO_MODE === 'true') return true;
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);

  if (params.get('demo') === '1' || window.location.hostname.endsWith('github.io')) {
    localStorage.setItem(DEMO_FLAG_KEY, 'true');
    return true;
  }

  return localStorage.getItem(DEMO_FLAG_KEY) === 'true';
};

export const demoUser = {
  _id: 'demo-user-1',
  name: 'Portfolio Visitor',
  email: 'visitor@chatlite.demo',
  createdAt: new Date().toISOString()
};

const now = () => new Date().toISOString();

const starterRooms = () => [
  {
    _id: 'demo-room-general',
    name: 'General',
    createdAt: now(),
    updatedAt: now(),
    createdBy: { _id: 'demo-user-2', name: 'Ameer Hamza', email: 'ameer@chatlite.demo' }
  },
  {
    _id: 'demo-room-product',
    name: 'Product Ideas',
    createdAt: now(),
    updatedAt: now(),
    createdBy: { _id: 'demo-user-2', name: 'Ameer Hamza', email: 'ameer@chatlite.demo' }
  },
  {
    _id: 'demo-room-support',
    name: 'Support Desk',
    createdAt: now(),
    updatedAt: now(),
    createdBy: { _id: 'demo-user-3', name: 'Sara Khan', email: 'sara@chatlite.demo' }
  }
];

const starterMessages = () => ({
  'demo-room-general': [
    {
      _id: 'demo-message-1',
      room: 'demo-room-general',
      sender: { _id: 'demo-user-2', name: 'Ameer Hamza', email: 'ameer@chatlite.demo' },
      text: 'Welcome to ChatLite. This portfolio demo runs as a static preview.',
      createdAt: now(),
      updatedAt: now()
    },
    {
      _id: 'demo-message-2',
      room: 'demo-room-general',
      sender: demoUser,
      text: 'The full-stack version uses Express, MongoDB, JWT, and Socket.io.',
      createdAt: now(),
      updatedAt: now()
    }
  ],
  'demo-room-product': [
    {
      _id: 'demo-message-3',
      room: 'demo-room-product',
      sender: { _id: 'demo-user-3', name: 'Sara Khan', email: 'sara@chatlite.demo' },
      text: 'Room-based chat keeps project conversations organized.',
      createdAt: now(),
      updatedAt: now()
    }
  ],
  'demo-room-support': []
});

export const ensureDemoData = () => {
  if (!localStorage.getItem(DEMO_ROOMS_KEY)) {
    localStorage.setItem(DEMO_ROOMS_KEY, JSON.stringify(starterRooms()));
  }

  if (!localStorage.getItem(DEMO_MESSAGES_KEY)) {
    localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(starterMessages()));
  }
};

export const getDemoRooms = () => {
  ensureDemoData();
  return JSON.parse(localStorage.getItem(DEMO_ROOMS_KEY));
};

export const createDemoRoom = (name) => {
  const rooms = getDemoRooms();
  const room = {
    _id: `demo-room-${Date.now()}`,
    name,
    createdAt: now(),
    updatedAt: now(),
    createdBy: demoUser
  };

  localStorage.setItem(DEMO_ROOMS_KEY, JSON.stringify([room, ...rooms]));
  return room;
};

export const getDemoMessages = (roomId) => {
  ensureDemoData();
  const messages = JSON.parse(localStorage.getItem(DEMO_MESSAGES_KEY));
  return messages[roomId] || [];
};

export const saveDemoMessage = (roomId, text, sender = demoUser) => {
  const messages = JSON.parse(localStorage.getItem(DEMO_MESSAGES_KEY) || '{}');
  const message = {
    _id: `demo-message-${Date.now()}`,
    room: roomId,
    sender,
    text,
    createdAt: now(),
    updatedAt: now()
  };

  messages[roomId] = [...(messages[roomId] || []), message];
  localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(messages));
  return message;
};
