import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAppStore } from '../store';
import { ChefHat, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function LoginPage() {
  const { login } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard-loading');
    } else {
      setError(result.message ?? 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1>Welcome to MealCraft</h1>
          <p className="text-muted-foreground mt-1">Sign in to manage your recipes and meal plans</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-[0.85rem]">{error}</div>
            )}
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-muted-foreground text-[0.85rem]">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">Sign up</Link>
            </p>
          </div>

          <div className="mt-3 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border text-[0.85rem] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAppStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message ?? 'Unable to create account');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1>Create Account</h1>
          <p className="text-muted-foreground mt-1">Join MealCraft and start planning meals</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-[0.85rem]">{error}</div>
            )}
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="At least 6 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
              Create Account
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-muted-foreground text-[0.85rem]">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
