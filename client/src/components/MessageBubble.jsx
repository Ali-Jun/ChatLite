const formatTime = (value) => {
  if (!value) return '';

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
};

const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[86%] sm:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
      <div className={`mb-1 flex items-center gap-2 px-1 text-xs ${isOwn ? 'text-emerald-100/80' : 'text-slate-400'}`}>
        <span className="font-semibold">{isOwn ? 'You' : message.sender?.name || 'Unknown user'}</span>
        <span>{formatTime(message.createdAt)}</span>
      </div>
      <div
        className={[
          'rounded-lg px-4 py-3 text-sm leading-6 shadow-lg',
          isOwn
            ? 'rounded-br-lg bg-gradient-to-br from-emerald-300 via-teal-300 to-sky-400 text-slate-950 shadow-emerald-950/20'
            : 'rounded-bl-lg border border-white/10 bg-white/[0.065] text-slate-100 shadow-black/20 backdrop-blur-xl'
        ].join(' ')}
      >
        {message.text}
      </div>
    </div>
  </div>
);

export default MessageBubble;
