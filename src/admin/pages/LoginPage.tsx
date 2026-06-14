import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('admin@spsdental.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/admin', { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email');
      return;
    }
    toast.success('Password reset link sent to your email');
    setShowForgot(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
              S
            </div>
            <div>
              <div className="font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>SPS Dental</div>
              <div className="text-xs text-white/60 tracking-wider uppercase">Admin Panel</div>
            </div>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs mb-6">
              <Shield size={14} />
              Secure Admin Access
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Manage Your Clinic With <span className="text-teal-light">Confidence</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-10">
              A complete healthcare management system designed for modern dental clinics. Appointments, patients, and analytics — all in one secure dashboard.
            </p>

            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-light" />
                Real-time appointment tracking
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-light" />
                Secure patient data management
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-light" />
                Comprehensive analytics & reports
              </div>
            </div>
          </div>

          <p className="text-xs text-white/40">© 2026 SPS Multispeciality Dental Clinic. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col bg-section-alt">
        <div className="p-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-dental-blue transition-colors">
            <ArrowLeft size={16} />
            Back to website
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            {!showForgot ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Welcome back
                  </h2>
                  <p className="text-text-secondary">Sign in to access your admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@spsdental.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-text-primary">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-xs text-dental-blue hover:text-teal font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-secondary"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-dental-blue focus:ring-dental-blue" />
                    <label htmlFor="remember" className="text-sm text-text-secondary">Remember me for 30 days</label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl btn-primary text-sm font-semibold disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 p-4 rounded-xl bg-accent border border-teal/10">
                  <p className="text-xs font-semibold text-teal-dark mb-2">Demo Credentials</p>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <p><span className="font-medium">Admin:</span> admin@spsdental.com / admin123</p>
                    <p><span className="font-medium">Receptionist:</span> reception@spsdental.com / staff123</p>
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-text-light lg:hidden">
                  <Link to="/" className="hover:text-dental-blue">← Back to website</Link>
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowForgot(false)}
                  className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-dental-blue mb-6"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </button>
                <h2 className="text-3xl font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Reset Password
                </h2>
                <p className="text-text-secondary mb-8">Enter your email and we'll send you a reset link.</p>

                <form onSubmit={handleForgot} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl btn-primary text-sm font-semibold"
                  >
                    Send Reset Link
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
