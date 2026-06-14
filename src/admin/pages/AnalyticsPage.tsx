import { useState, useEffect, useMemo } from 'react';
import {
  Download, TrendingUp, Calendar, BarChart3,
  FileText, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO, subDays } from 'date-fns';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { appointmentsDB, inquiriesDB, patientsDB } from '../db/database';

type ReportRange = 'daily' | 'weekly' | 'monthly';

export default function AnalyticsPage() {
  const [range, setRange] = useState<ReportRange>('weekly');
  const [appointments, setAppointments] = useState(appointmentsDB.list());

  useEffect(() => {
    setAppointments(appointmentsDB.list());
  }, []);

  const reportData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    if (range === 'daily') {
      startDate = subDays(now, 1);
    } else if (range === 'weekly') {
      startDate = subDays(now, 7);
    } else {
      startDate = subDays(now, 30);
    }

    const filtered = appointments.filter(a => parseISO(a.createdAt) >= startDate);

    const completed = filtered.filter(a => a.status === 'completed').length;
    const cancelled = filtered.filter(a => a.status === 'cancelled').length;
    const noShow = filtered.filter(a => a.status === 'no-show').length;
    const total = filtered.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

    // Treatment breakdown
    const treatmentCounts: Record<string, number> = {};
    filtered.forEach(a => {
      treatmentCounts[a.treatment] = (treatmentCounts[a.treatment] || 0) + 1;
    });
    const topTreatments = Object.entries(treatmentCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    // Daily trend
    const days = range === 'daily' ? 1 : range === 'weekly' ? 7 : 30;
    const dailyData = Array.from({ length: days }, (_, i) => {
      const date = subDays(now, days - 1 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayAppts = appointments.filter(a => a.date === dateStr);
      return {
        date: format(date, range === 'daily' ? 'HH:mm' : 'MMM dd'),
        bookings: dayAppts.length,
        completed: dayAppts.filter(a => a.status === 'completed').length,
        cancelled: dayAppts.filter(a => a.status === 'cancelled').length,
      };
    });

    return {
      total, completed, cancelled, noShow,
      completionRate, cancellationRate,
      topTreatments, dailyData,
    };
  }, [appointments, range]);

  const exportPDF = () => {
    // Generate a simple text/HTML report and download as PDF-like file
    const reportContent = generateReportText(reportData, range);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinic-report-${range}-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  const exportExcel = () => {
    const headers = ['Date', 'Bookings', 'Completed', 'Cancelled'];
    const rows = reportData.dailyData.map(d => [d.date, d.bookings, d.completed, d.cancelled]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinic-report-${range}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Excel report exported');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Reports & Analytics</h2>
          <p className="text-sm text-text-secondary mt-1">Insights and trends for your clinic operations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-text-primary text-sm font-semibold hover:bg-section-alt">
            <FileText size={16} />
            Excel
          </button>
          <button onClick={exportPDF} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-semibold">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Range Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Filter size={16} />
          Report Period:
        </div>
        <div className="flex gap-1 p-1 bg-section-alt rounded-xl">
          {[
            { key: 'daily' as ReportRange, label: 'Daily' },
            { key: 'weekly' as ReportRange, label: 'Weekly' },
            { key: 'monthly' as ReportRange, label: 'Monthly' },
          ].map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                range === r.key ? 'bg-white text-dental-blue shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Bookings" value={reportData.total} icon={Calendar} color="dental-blue" />
        <MetricCard label="Completed" value={reportData.completed} icon={TrendingUp} color="teal" />
        <MetricCard label="Completion Rate" value={`${reportData.completionRate}%`} icon={BarChart3} color="emerald" />
        <MetricCard label="Cancellations" value={reportData.cancelled} icon={TrendingUp} color="red" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Booking Trends</h3>
          <p className="text-xs text-text-secondary mb-4">Daily appointment activity over the {range} period</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="bookings" stroke="#0F4C81" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="completed" stroke="#2BB7A3" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="cancelled" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Top Requested Treatments</h3>
          <p className="text-xs text-text-secondary mb-4">Most popular services during this period</p>
          {reportData.topTreatments.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-sm text-text-light">No data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.topTreatments.slice(0, 7)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={100} tickLine={false} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="#0F4C81" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Cancellation Report */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Cancellation Insights</h3>
          <p className="text-xs text-text-secondary mb-4">Track cancellation patterns</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-text-primary">Completion Rate</span>
                <span className="text-sm font-bold text-emerald-600">{reportData.completionRate}%</span>
              </div>
              <div className="h-2 bg-section-alt rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${reportData.completionRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-text-primary">Cancellation Rate</span>
                <span className="text-sm font-bold text-red-600">{reportData.cancellationRate}%</span>
              </div>
              <div className="h-2 bg-section-alt rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full" style={{ width: `${reportData.cancellationRate}%` }} />
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{reportData.noShow}</p>
                <p className="text-xs text-text-secondary">No Shows</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{reportData.cancelled}</p>
                <p className="text-xs text-text-secondary">Cancelled</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Patient Statistics</h3>
          <p className="text-xs text-text-secondary mb-4">Database growth overview</p>
          <div className="space-y-3">
            <StatRow label="Total Patients" value={patientsDB.list().length} />
            <StatRow label="New Inquiries" value={inquiriesDB.list().length} />
            <StatRow label="Total Appointments" value={appointments.length} />
            <StatRow label="Unique Patients (with appts)" value={new Set(appointments.map(a => a.email).filter(Boolean)).size} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-dental-blue to-teal rounded-2xl p-6 text-white">
          <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Quick Insights</h3>
          <p className="text-white/70 text-xs mb-4">Key takeaways from this period</p>
          <div className="space-y-3 text-sm">
            <Insight
              text={reportData.total > 0
                ? `Your busiest day had ${Math.max(...reportData.dailyData.map(d => d.bookings))} bookings.`
                : 'No bookings recorded in this period.'}
            />
            <Insight
              text={reportData.topTreatments[0]
                ? `${reportData.topTreatments[0].name} is your most requested service.`
                : 'No treatment data available.'}
            />
            <Insight
              text={`${reportData.completionRate}% of appointments were completed successfully.`}
            />
            {reportData.cancellationRate > 20 && (
              <Insight text={`Consider sending reminders — cancellation rate is ${reportData.cancellationRate}%.`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  const colorMap: Record<string, string> = {
    'dental-blue': 'bg-dental-blue/10 text-dental-blue',
    'teal': 'bg-teal/10 text-teal',
    'emerald': 'bg-emerald-50 text-emerald-600',
    'red': 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{value}</span>
    </div>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-light mt-1.5 flex-shrink-0" />
      <p className="text-white/90">{text}</p>
    </div>
  );
}

function generateReportText(data: any, range: string): string {
  return `
SPS DENTAL CLINIC - ${range.toUpperCase()} REPORT
Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}
==============================================

SUMMARY
-------
Total Bookings:    ${data.total}
Completed:         ${data.completed}
Cancelled:         ${data.cancelled}
No Shows:          ${data.noShow}
Completion Rate:   ${data.completionRate}%
Cancellation Rate: ${data.cancellationRate}%

TOP TREATMENTS
--------------
${data.topTreatments.map((t: any, i: number) => `${i + 1}. ${t.name}: ${t.value} bookings`).join('\n')}

==============================================
SPS Multispeciality Dental Clinic
2/598, Thirumohoor Road, Madurai
  `.trim();
}
