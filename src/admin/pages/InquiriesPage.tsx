import { useState, useEffect, useMemo } from 'react';
import {
  Search, Mail, Phone, Trash2, CheckCheck,
  Download, MailOpen, MessageSquare, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { inquiriesDB, Inquiry } from '../db/database';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setInquiries(inquiriesDB.list());
  useEffect(refresh, []);

  const filtered = useMemo(() => {
    let result = inquiries;
    if (statusFilter !== 'all') {
      result = result.filter(i => i.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [inquiries, search, statusFilter]);

  const handleMarkRead = (id: string) => {
    inquiriesDB.update(id, { status: 'read' });
    refresh();
    if (selected?.id === id) setSelected({ ...selected, status: 'read' });
  };

  const handleMarkReplied = (id: string) => {
    inquiriesDB.update(id, { status: 'replied', repliedAt: new Date().toISOString() });
    refresh();
    if (selected?.id === id) setSelected({ ...selected, status: 'replied', repliedAt: new Date().toISOString() });
    toast.success('Marked as replied');
  };

  const handleDelete = () => {
    if (deleteId) {
      inquiriesDB.delete(deleteId);
      refresh();
      if (selected?.id === deleteId) setSelected(null);
      toast.success('Inquiry deleted');
      setDeleteId(null);
    }
  };

  const handleSelect = (i: Inquiry) => {
    setSelected(i);
    if (i.status === 'unread') handleMarkRead(i.id);
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Created'];
    const rows = filtered.map(i => [i.name, i.email, i.phone, i.subject, i.message, i.status, i.createdAt]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c.toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Patient Inquiries</h2>
          <p className="text-sm text-text-secondary mt-1">Manage contact form submissions from your website</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-text-primary text-sm font-semibold hover:bg-section-alt">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
            />
          </div>
          <div className="flex gap-1 p-1 bg-section-alt rounded-xl">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' },
              { key: 'replied', label: 'Replied' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === f.key ? 'bg-white text-dental-blue shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {f.label}
                {f.key === 'unread' && inquiries.filter(i => i.status === 'unread').length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px]">
                    {inquiries.filter(i => i.status === 'unread').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-section-alt flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={24} className="text-text-light" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">No inquiries found</h3>
              <p className="text-sm text-text-secondary">New contact form submissions will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
              {filtered.map(i => (
                <button
                  key={i.id}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 hover:bg-section-alt transition-colors ${
                    selected?.id === i.id ? 'bg-accent' : ''
                  } ${i.status === 'unread' ? 'border-l-4 border-l-dental-blue' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dental-blue/20 to-teal/20 flex items-center justify-center text-dental-blue font-semibold text-xs flex-shrink-0">
                      {i.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm truncate ${i.status === 'unread' ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                          {i.name}
                        </p>
                        {i.status === 'unread' && <span className="w-2 h-2 rounded-full bg-dental-blue flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-text-secondary truncate mb-1">{i.subject}</p>
                      <p className="text-xs text-text-light">{format(parseISO(i.createdAt), 'MMM dd, HH:mm')}</p>
                    </div>
                    <StatusBadge status={i.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold">
                      {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{selected.name}</h3>
                      <p className="text-xs text-text-secondary mt-0.5">{format(parseISO(selected.createdAt), 'EEEE, MMMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-section-alt">
                    <X size={18} />
                  </button>
                </div>
                <StatusBadge status={selected.status} size="md" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Subject</h4>
                  <p className="text-sm font-medium text-text-primary">{selected.subject}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Message</h4>
                  <p className="text-sm text-text-primary bg-section-alt rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-section-alt hover:bg-dental-blue/5 transition-colors">
                    <Mail size={16} className="text-dental-blue" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider">Email</p>
                      <p className="text-sm text-text-primary truncate">{selected.email}</p>
                    </div>
                  </a>
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-section-alt hover:bg-dental-blue/5 transition-colors">
                    <Phone size={16} className="text-teal" />
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider">Phone</p>
                      <p className="text-sm text-text-primary">{selected.phone}</p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex flex-wrap items-center gap-2 justify-end">
                <button
                  onClick={() => setDeleteId(selected.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                {selected.status === 'read' && (
                  <button
                    onClick={() => handleMarkReplied(selected.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold"
                  >
                    <CheckCheck size={14} />
                    Mark Replied
                  </button>
                )}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm font-semibold"
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-section-alt flex items-center justify-center mx-auto mb-4">
                <MailOpen size={24} className="text-text-light" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">Select an inquiry</h3>
              <p className="text-sm text-text-secondary">Choose a message from the list to view details</p>
            </div>
          )}
        </div>
      </div>

      {deleteId && (
        <ConfirmDialog
          title="Delete Inquiry?"
          message="This action cannot be undone. The inquiry will be permanently removed."
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
