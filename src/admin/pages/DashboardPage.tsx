import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle2, Clock, XCircle,
  TrendingUp, MessageSquare, ArrowRight,
  Plus, UserPlus, Mail
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subDays, isFuture } from 'date-fns';
import { appointmentsDB, inquiriesDB, Appointment } from '../db/database';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setAppointments(appointmentsDB.list());
  }, [refresh]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => setRefresh(r => r + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const today = format(new Date(), 'yyyy-MM-dd');
  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(a => a.date === today);
  const upcomingAppointments = appointments.filter(a => isFuture(parseISO(a.date)) || (a.date === today && parseISO(`${a.date}T${a.time || '23:59'}`) > new Date()));
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');
  const newInquiries = inquiriesDB.list().filter(i => i.status === 'unread');

  // Last 7 days booking data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const dayAppointments = appointments.filter(a => a.date === date);
    return {
      date: format(subDays(new Date(), 6 - i), 'MMM dd'),
      bookings: dayAppointments.length,
      completed: dayAppointments.filter(a => a.status === 'completed').length,
    };
  });

  // Status distribution
  const statusData = [
    { name: 'New', value: appointments.filter(a => a.status === 'new').length, color: '#3B82F6' },
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: '#10B981' },
    { name: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: '#F59E0B' },
    { name: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: '#0F4C81' },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, color: '#EF4444' },
  ].filter(s => s.value > 0);

  // Treatment distribution
  const treatmentCounts: Record<string, number> = {};
  appointments.forEach(a => {
    treatmentCounts[a.treatment] = (treatmentCounts[a.treatment] || 0) + 1;
  });
  const topTreatments = Object.entries(treatmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const stats = [
    { label: 'Total Appointments', value: totalAppointments, change: '+12%', icon: Calendar, color: 'from-dental-blue to-dental-blue-light', iconBg: 'bg-dental-blue/10', iconColor: 'text-dental-blue' },
    { label: "Today's Appointments", value: todayAppointments.length, change: `${todayAppointments.length} scheduled`, icon: Clock, color: 'from-teal to-teal-light', iconBg: 'bg-teal/10', iconColor: 'text-teal' },
    { label: 'Upcoming', value: upcomingAppointments.length, change: 'Future bookings', icon: TrendingUp, color: 'from-purple-500 to-purple-600', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { label: 'Completed', value: completedAppointments.length, change: 'All-time', icon: CheckCircle2, color: 'from-green-500 to-green-600', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Cancelled', value: cancelledAppointments.length, change: 'Requires attention', icon: XCircle, color: 'from-red-500 to-red-600', iconBg: 'bg-red-50', iconColor: 'text-red-600' },
    { label: 'New Inquiries', value: newInquiries.length, change: 'Unread', icon: MessageSquare, color: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  const recentActivity = [
    ...appointments.slice(-5).reverse().map(a => ({
      type: 'appointment' as const,
      title: a.status === 'cancelled' ? 'Appointment Cancelled' : 'New Appointment',
      description: `${a.name} - ${a.treatment}`,
      time: a.createdAt,
      status: a.status,
    })),
    ...inquiriesDB.list().slice(-3).reverse().map(i => ({
      type: 'inquiry' as const,
      title: 'New Inquiry',
      description: `${i.name}: ${i.subject}`,
      time: i.createdAt,
      status: i.status,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  const todaySchedule = todayAppointments
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome back! 👋
          </h2>
          <p className="text-sm text-text-secondary mt-1">Here's what's happening at your clinic today.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-semibold"
          >
            <Plus size={16} />
            New Appointment
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.iconColor} />
            </div>
            <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              {stat.value}
            </p>
            <p className="text-xs text-text-secondary mt-1 line-clamp-1">{stat.label}</p>
            <p className={`text-[10px] mt-1.5 font-medium ${stat.iconColor}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Booking Trends</h3>
              <p className="text-xs text-text-secondary mt-0.5">Last 7 days appointment activity</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={last7Days}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0F4C81" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="bookings" stroke="#0F4C81" strokeWidth={2.5} dot={{ fill: '#0F4C81', r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="completed" stroke="#2BB7A3" strokeWidth={2.5} dot={{ fill: '#2BB7A3', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Status Overview</h3>
          <p className="text-xs text-text-secondary mb-4">Appointment status distribution</p>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-text-light">No data yet</div>
          )}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-xs text-text-secondary">{s.name}</span>
                <span className="text-xs font-semibold text-text-primary ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Today's Schedule</h3>
            <Link to="/admin/appointments" className="text-xs font-medium text-dental-blue hover:text-teal inline-flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {todaySchedule.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-section-alt flex items-center justify-center mx-auto mb-3">
                <Calendar size={20} className="text-text-light" />
              </div>
              <p className="text-sm text-text-secondary">No appointments today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-section-alt hover:bg-accent transition-colors">
                  <div className="text-center">
                    <div className="text-sm font-bold text-dental-blue" style={{ fontFamily: 'var(--font-heading)' }}>{a.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{a.name}</p>
                    <p className="text-xs text-text-secondary truncate">{a.treatment}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Treatments */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Top Treatments</h3>
          <p className="text-xs text-text-secondary mb-4">Most requested services</p>
          {topTreatments.length === 0 ? (
            <div className="text-center py-10 text-sm text-text-light">No data yet</div>
          ) : (
            <div className="space-y-3">
              {topTreatments.map((t) => {
                const percentage = (t.count / topTreatments[0].count) * 100;
                return (
                  <div key={t.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-text-primary font-medium truncate flex-1">{t.name}</span>
                      <span className="text-sm font-bold text-dental-blue ml-2">{t.count}</span>
                    </div>
                    <div className="h-2 bg-section-alt rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-dental-blue to-teal rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-10 text-sm text-text-light">No activity yet</div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    a.type === 'appointment' ? 'bg-dental-blue/10' : 'bg-teal/10'
                  }`}>
                    {a.type === 'appointment' ? <Calendar size={14} className="text-dental-blue" /> : <MessageSquare size={14} className="text-teal" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary">{a.title}</p>
                    <p className="text-xs text-text-secondary truncate">{a.description}</p>
                    <p className="text-[10px] text-text-light mt-0.5">
                      {format(new Date(a.time), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-dental-blue to-teal rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Quick Actions</h3>
            <p className="text-white/80 text-sm mt-1">Manage your clinic efficiently</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/appointments" className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-sm font-medium transition-colors inline-flex items-center gap-2">
              <Calendar size={14} />
              View Appointments
            </Link>
            <Link to="/admin/patients" className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-sm font-medium transition-colors inline-flex items-center gap-2">
              <UserPlus size={14} />
              Add Patient
            </Link>
            <Link to="/admin/inquiries" className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-sm font-medium transition-colors inline-flex items-center gap-2">
              <Mail size={14} />
              Reply Inquiries
            </Link>
            <Link to="/admin/analytics" className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-sm font-medium transition-colors inline-flex items-center gap-2">
              <TrendingUp size={14} />
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
