import { Loader2 } from 'lucide-react';

const Loader = ({ label = 'Loading...', fullScreen = false }) => (
  <div className={`flex items-center justify-center gap-3 text-slate-300 ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
    <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default Loader;
