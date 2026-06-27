import { useState } from 'react';
import { Eye, EyeOff, Lock, LogIn, Mail, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { isDemoMode } from '../utils/demo.js';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const demoMode = isDemoMode();

  if (isAuthenticated) {
    return <Navigate to="/rooms" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleDemoLogin = async () => {
    try {
      setSubmitting(true);
      await login({ email: 'demo@chatlite.dev', password: 'password123' });
      toast.success('Demo workspace ready.');
      navigate('/rooms', { replace: true });
    } catch (apiError) {
      const message = apiError.response?.data?.message || 'Could not open demo workspace.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setSubmitting(true);
      await login({ email: form.email, password: form.password });
      toast.success('Welcome back to ChatLite.');
      navigate(location.state?.from?.pathname || '/rooms', { replace: true });
    } catch (apiError) {
      const message = apiError.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-app-gradient px-4 py-10 text-white">
      <AuthCard
        title="Welcome back"
        subtitle="Real-time conversations, simple and fast."
        footer={
          <>
            New to ChatLite?{' '}
            <Link className="font-semibold text-emerald-200 hover:text-emerald-100" to="/register">
              Create an account
            </Link>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            icon={Mail}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            icon={Lock}
            placeholder="Enter your password"
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                className="rounded-lg p-1 text-slate-400 transition hover:text-white"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={submitting}
            icon={<LogIn className="h-5 w-5" />}
          >
            Login
          </Button>

          {demoMode ? (
            <Button
              type="button"
              fullWidth
              variant="secondary"
              icon={<Sparkles className="h-5 w-5" />}
              onClick={handleDemoLogin}
              disabled={submitting}
            >
              View demo workspace
            </Button>
          ) : null}
        </form>
      </AuthCard>
    </main>
  );
};

export default Login;
