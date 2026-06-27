import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, UserRound, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/rooms" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await register(form);
      toast.success('Your ChatLite account is ready.');
      navigate('/rooms', { replace: true });
    } catch (apiError) {
      const message = apiError.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-app-gradient px-4 py-10 text-white">
      <AuthCard
        title="Create your account"
        subtitle="Real-time conversations, simple and fast."
        footer={
          <>
            Already have an account?{' '}
            <Link className="font-semibold text-emerald-200 hover:text-emerald-100" to="/login">
              Login
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
            label="Name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            icon={UserRound}
            placeholder="Ameer Hamza"
            autoComplete="name"
          />

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
            placeholder="Create a password"
            autoComplete="new-password"
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
            icon={<UserPlus className="h-5 w-5" />}
          >
            Register
          </Button>
        </form>
      </AuthCard>
    </main>
  );
};

export default Register;
