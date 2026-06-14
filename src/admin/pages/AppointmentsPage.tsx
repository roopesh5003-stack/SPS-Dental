import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus, Search, Calendar,
  ChevronLeft, ChevronRight, Eye, Edit, Trash2,
  XCircle, Download, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { appointmentsDB, Appointment, AppointmentStatus } from '../db/database';
import StatusBadge from '../components/StatusBadge';
import AppointmentModal from '../components/AppointmentModal';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_OPTIONS: AppointmentStatus[] = ['new', 'confirmed', 'pending', 'completed', 'cancelled', 'no-show'];
const PAGE_SIZE = 10;

export default function AppointmentsPage() {
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [treatmentFilter, setTreatmentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customDate, setCustomDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setAppointments(appointmentsDB.list());

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (searchParams.get('search')) {
      setSearch(searchParams.get('search') || '');
    }
  }, [searchParams]);

  // Get unique treatments
  const treatments = useMemo(() => {
    const set = new Set(appointments.map(a => a.treatment));
    return Array.from(set).sort();
  }, [appointments]);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = [...appointments];
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.treatment.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q)
      );
    }

    // Status
    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }

    // Treatment
    if (treatmentFilter !== 'all') {
      result = result.filter(a => a.treatment === treatmentFilter);
    }

    // Date
    if (dateFilter === 'today') {
      result = result.filter(a => a.date === today);
    } else if (dateFilter === 'upcoming') {
      result = result.filter(a => a.date >= today);
    } else if (dateFilter === 'past') {
      result = result.filter(a => a.date < today);
    } else if (dateFilter === 'thisWeek') {
      result = result.filter(a => a.date >= weekAgoStr && a.date <= today);
    } else if (dateFilter === 'custom' && customDate) {
      result = result.filter(a => a.date === customDate);
    }

    // Sort
    result.sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const bTime = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return sortBy === 'newest' ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [appointments, search, statusFilter, treatmentFilter, dateFilter, customDate, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, treatmentFilter, dateFilter, customDate, sortBy]);

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    appointmentsDB.update(id, { status });
    refresh();
    toast.success(`Appointment ${status === 'cancelled' ? 'cancelled' : 'updated'}`);
  };

  const handleDelete = () => {
    if (deleteId) {
      appointmentsDB.delete(deleteId);
      refresh();
      toast.success('Appointment deleted');
      setDeleteId(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Treatment', 'Date', 'Time', 'Status', 'Message', 'Created'];
    const rows = filtered.map(a => [
      a.name, a.phone, a.email, a.treatment, a.date, a.time, a.status, a.message, a.createdAt
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Appointments</h2>
          <p className="text-sm text-text-secondary mt-1">Manage and track all patient appointments</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-text-primary text-sm font-semibold hover:bg-section-alt transition-colors">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => { setEditingAppt(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-semibold"
          >
            <Plus size={16} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-section-alt border-0 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-dental-blue/20"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>

          <select
            value={treatmentFilter}
            onChange={(e) => setTreatmentFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-section-alt border-0 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-dental-blue/20"
          >
            <option value="all">All Treatments</option>
            {treatments.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="px-3.5 py-2.5 rounded-xl bg-section-alt border-0 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-dental-blue/20"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          {[
            { key: 'all', label: 'All' },
            { key: 'today', label: 'Today' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'thisWeek', label: 'This Week' },
            { key: 'past', label: 'Past' },
            { key: 'custom', label: 'Custom Date' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setDateFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                dateFilter === f.key
                  ? 'bg-dental-blue text-white'
                  : 'bg-section-alt text-text-secondary hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
          {dateFilter === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
            />
          )}
          <div className="ml-auto text-xs text-text-secondary self-center">
            Showing {paginated.length} of {filtered.length} appointments
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-section-alt flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-text-light" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>No appointments found</h3>
            <p className="text-sm text-text-secondary mb-6">Try adjusting your filters or create a new appointment.</p>
            <button
              onClick={() => { setEditingAppt(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm font-semibold"
            >
              <Plus size={16} />
              New Appointment
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-section-alt border-b border-gray-100">
                  <tr className="text-left">
                    <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Patient</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Treatment</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date & Time</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map(a => (
                    <tr key={a.id} className="hover:bg-section-alt transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-dental-blue/20 to-teal/20 flex items-center justify-center text-dental-blue font-semibold text-xs flex-shrink-0">
                            {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{a.name}</p>
                            <p className="text-xs text-text-secondary truncate">{a.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-text-primary font-medium">{a.treatment}</p>
                        {a.message && <p className="text-xs text-text-secondary truncate max-w-[200px]">{a.message}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-text-primary font-medium">{format(parseISO(a.date), 'MMM dd, yyyy')}</p>
                        <p className="text-xs text-text-secondary">{a.time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/admin/appointments/${a.id}`}
                            className="p-2 rounded-lg text-text-secondary hover:bg-dental-blue/10 hover:text-dental-blue transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => { setEditingAppt(a); setModalOpen(true); }}
                            className="p-2 rounded-lg text-text-secondary hover:bg-dental-blue/10 hover:text-dental-blue transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          {a.status === 'cancelled' ? (
                            <button
                              onClick={() => handleStatusChange(a.id, 'pending')}
                              className="p-2 rounded-lg text-text-secondary hover:bg-teal/10 hover:text-teal transition-colors"
                              title="Restore"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(a.id, 'cancelled')}
                              className="p-2 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Cancel"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteId(a.id)}
                            className="p-2 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {paginated.map(a => (
                <div key={a.id} className="p-4 hover:bg-section-alt transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dental-blue/20 to-teal/20 flex items-center justify-center text-dental-blue font-semibold text-xs flex-shrink-0">
                        {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{a.name}</p>
                        <p className="text-xs text-text-secondary truncate">{a.treatment}</p>
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(parseISO(a.date), 'MMM dd')} at {a.time}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/appointments/${a.id}`}
                      className="flex-1 text-center px-3 py-1.5 rounded-lg bg-dental-blue/10 text-dental-blue text-xs font-semibold"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => { setEditingAppt(a); setModalOpen(true); }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-section-alt text-text-secondary text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(a.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <p className="text-xs text-text-secondary">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg text-text-secondary hover:bg-section-alt disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5) {
                      if (page <= 3) pageNum = i + 1;
                      else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold ${
                          page === pageNum
                            ? 'bg-dental-blue text-white'
                            : 'text-text-secondary hover:bg-section-alt'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg text-text-secondary hover:bg-section-alt disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <AppointmentModal
          appointment={editingAppt}
          onClose={() => { setModalOpen(false); setEditingAppt(null); }}
          onSave={() => { refresh(); setModalOpen(false); setEditingAppt(null); }}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Appointment?"
          message="This action cannot be undone. The appointment will be permanently removed."
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
