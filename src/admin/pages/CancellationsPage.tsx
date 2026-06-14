import { useState, useEffect, useMemo } from 'react';
import {
  Search, RotateCcw, Trash2, XCircle, Phone, Calendar,
  MessageSquare, AlertTriangle, Download, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { appointmentsDB, Appointment } from '../db/database';
import ConfirmDialog from '../components/ConfirmDialog';

export default function CancellationsPage() {
  const [cancellations, setCancellations] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => {
    setCancellations(appointmentsDB.list().filter(a => a.status === 'cancelled'));
  };
  useEffect(refresh, []);

  const filtered = useMemo(() => {
    if (!search) return cancellations;
    const q = search.toLowerCase();
    return cancellations.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.cancellationReason || '').toLowerCase().includes(q) ||
      c.treatment.toLowerCase().includes(q)
    );
  }, [cancellations, search]);

  const stats = useMemo(() => {
    const total = cancellations.length;
    const thisMonth = cancellations.filter(c => {
      const cancelled = c.cancelledAt ? new Date(c.cancelledAt) : new Date(c.updatedAt);
      const now = new Date();
      return cancelled.getMonth() === now.getMonth() && cancelled.getFullYear() === now.getFullYear();
    }).length;
    const reasons: Record<string, number> = {};
    cancellations.forEach(c => {
      const reason = c.cancellationReason || 'Not specified';
      reasons[reason] = (reasons[reason] || 0) + 1;
    });
    const topReason = Object.entries(reasons).sort((a, b) => b[1] - a[1])[0];
    return { total, thisMonth, topReason: topReason?.[0] };
  }, [cancellations]);

  const handleRestore = (id: string) => {
    appointmentsDB.update(id, { status: 'pending', cancellationReason: undefined, cancelledAt: undefined });
    refresh();
    toast.success('Appointment restored to pending');
    setRestoreId(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      appointmentsDB.delete(deleteId);
      refresh();
      toast.success('Cancelled appointment deleted');
      setDeleteId(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Treatment', 'Date', 'Reason', 'Cancelled At'];
    const rows = filtered.map(c => [c.name, c.phone, c.email, c.treatment, c.date, c.cancellationReason || '', c.cancelledAt || '']);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v.toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cancellations-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Cancellations</h2>
          <p className="text-sm text-text-secondary mt-1">Track and manage cancelled appointments</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-text-primary text-sm font-semibold hover:bg-section-alt">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <XCircle size={20} className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{stats.total}</p>
          <p className="text-xs text-text-secondary mt-1">Total Cancellations</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <Calendar size={20} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{stats.thisMonth}</p>
          <p className="text-xs text-text-secondary mt-1">This Month</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
            <MessageSquare size={20} className="text-purple-600" />
          </div>
          <p className="text-sm font-bold text-text-primary truncate" style={{ fontFamily: 'var(--font-heading)' }}>{stats.topReason || 'N/A'}</p>
          <p className="text-xs text-text-secondary mt-1">Top Reason</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cancellations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-section-alt flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-text-light" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">No cancellations</h3>
            <p className="text-sm text-text-secondary">Great news! No appointments have been cancelled.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(c => (
              <div key={c.id} className="p-5 hover:bg-section-alt transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-text-primary truncate" style={{ fontFamily: 'var(--font-heading)' }}>{c.name}</h4>
                      <p className="text-xs text-text-secondary truncate">{c.treatment} • {format(parseISO(c.date), 'MMM dd, yyyy')} at {c.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 text-xs text-text-secondary">
                    <a href={`tel:${c.phone}`} className="hover:text-dental-blue flex items-center gap-1">
                      <Phone size={12} />
                      <span className="hidden sm:inline">{c.phone}</span>
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRestoreId(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal/10 text-teal text-xs font-semibold hover:bg-teal/20"
                    >
                      <RotateCcw size={12} />
                      Restore
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
                {c.cancellationReason && (
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-red-50/50">
                    <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wider">Cancellation Reason</p>
                      <p className="text-xs text-text-primary mt-0.5">{c.cancellationReason}</p>
                      {c.cancelledAt && (
                        <p className="text-[10px] text-text-light mt-1">Cancelled on {format(parseISO(c.cancelledAt), 'MMM dd, yyyy HH:mm')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {restoreId && (
        <ConfirmDialog
          title="Restore Appointment?"
          message="The appointment will be moved back to pending status and the patient can be contacted for rescheduling."
          confirmText="Restore"
          variant="primary"
          onConfirm={() => handleRestore(restoreId)}
          onCancel={() => setRestoreId(null)}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Permanently?"
          message="This cancelled appointment will be permanently removed from the system."
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
