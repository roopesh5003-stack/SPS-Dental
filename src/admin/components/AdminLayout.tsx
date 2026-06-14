import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, CalendarDays, Users, UserCog, MessageSquare,
  Bell, BarChart3, Settings, LogOut, Menu, X, Search, ChevronDown,
  Stethoscope, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { notificationsDB, Notification } from '../db/database';
import NotificationCenter from './NotificationCenter';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { to: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/admin/patients', label: 'Patients', icon: Users },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/cancellations', label: 'Cancellations', icon: Activity },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshNotifications = () => {
    setNotifications(notificationsDB.list());
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login', { replace: true });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/appointments?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Get page title
  const getPageTitle = () => {
    const item = navItems.find(item => 
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
    );
    return item?.label || 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-section-alt flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 flex-shrink-0">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              S
            </div>
            <div>
              <div className="font-bold text-text-primary leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>SPS Dental</div>
              <div className="text-[10px] text-text-light tracking-wider uppercase">Admin Panel</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-dental-blue text-white shadow-md'
                  : 'text-text-secondary hover:bg-section-alt hover:text-dental-blue'
                }
              `}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-section-alt hover:text-dental-blue transition-all"
          >
            <Stethoscope size={18} />
            View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all mt-1"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-100 h-16 flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-text-secondary hover:bg-gray-100 rounded-lg"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-lg lg:text-xl font-bold text-text-primary hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
            {getPageTitle()}
          </h1>

          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appointments, patients..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-section-alt border-0 text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
              />
            </div>
          </form>

          <div className="flex-1 md:hidden" />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-text-secondary hover:bg-section-alt transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <NotificationCenter
                notifications={notifications}
                onClose={() => setNotifOpen(false)}
                onUpdate={refreshNotifications}
              />
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-section-alt transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold text-xs">
                {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-semibold text-text-primary leading-tight">{user?.name}</div>
                <div className="text-[10px] text-text-light uppercase tracking-wider">{user?.role}</div>
              </div>
              <ChevronDown size={14} className="hidden lg:block text-text-light" />
            </button>

            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden animate-slide-down">
                  <div className="p-4 border-b border-gray-100">
                    <div className="font-semibold text-text-primary text-sm">{user?.name}</div>
                    <div className="text-xs text-text-secondary truncate">{user?.email}</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-dental-blue/10 text-dental-blue text-[10px] font-semibold uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-section-alt transition-colors"
                    >
                      <UserCog size={16} />
                      Profile Settings
                    </Link>
                    <Link
                      to="/"
                      target="_blank"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-section-alt transition-colors"
                    >
                      <Stethoscope size={16} />
                      Public Website
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
