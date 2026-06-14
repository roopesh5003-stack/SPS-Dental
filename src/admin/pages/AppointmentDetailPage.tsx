import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Phone, Mail, MessageSquare, Clock,
  User, FileText, Edit, Trash2, CheckCircle2, XCircle,
  RotateCcw, Send, History
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { appointmentsDB, Appointment, AppointmentStatus } from '../db/database';
import StatusBadge from '../components/StatusBadge';
import AppointmentModal from '../components/AppointmentModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (id) {
      const found = appointmentsDB.findById(id);
      setAppt(found || null);
    }
  }, [id]);

  if (!appt) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-section-alt flex items-center justify-center mx-auto mb-4">
          <Calendar size={24} className="text-text-light" />
        </div>
        <h3 className="font-semibold text-text-primary mb-1">Appointment not found</h3>
        <Link to="/admin/appointments" className="text-sm text-dental-blue hover:text-teal">
          ← Back to appointments
        </Link>
      </div>
    );
  }

  const handleStatus = (status: AppointmentStatus) => {
    appointmentsDB.update(appt.id, { status });
    setAppt(appointmentsDB.findById(appt.id) || null);
    toast.success('Status updated');
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    appointmentsDB.update(appt.id, {
      status: 'cancelled',
      cancellationReason: cancelReason,
      cancelledAt: new Date().toISOString(),
    });
    setAppt(appointmentsDB.findById(appt.id) || null);
    setCancelOpen(false);
    setCancelReason('');
    toast.success('Appointment cancelled');
  };

  const handleDelete = () => {
    appointmentsDB.delete(appt.id);
    toast.success('Appointment deleted');
    navigate('/admin/appointments');
  };

  const quickActions = [
    { label: 'Confirm', status: 'confirmed' as AppointmentStatus, color: 'bg-emerald-500 hover:bg-emerald-600', icon: CheckCircle2, show: appt.status !== 'confirmed' && appt.status !== 'completed' && appt.status !== 'cancelled' },
    { label: 'Mark Complete', status: 'completed' as AppointmentStatus, color: 'bg-dental-blue hover:bg-dental-blue-dark', icon: CheckCircle2, show: appt.status !== 'completed' && appt.status !== 'cancelled' },
    { label: 'Mark Pending', status: 'pending' as AppointmentStatus, color: 'bg-amber-500 hover:bg-amber-600', icon: Clock, show: appt.status !== 'pending' && appt.status !== 'completed' && appt.status !== 'cancelled' },
    { label: 'Restore', status: 'pending' as AppointmentStatus, color: 'bg-teal hover:bg-teal-dark', icon: RotateCcw, show: appt.status === 'cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/appointments" className="p-2 rounded-xl text-text-secondary hover:bg-section-alt">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Appointment Details</h2>
            <p className="text-sm text-text-secondary mt-0.5">ID: {appt.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-text-primary text-sm font-semibold hover:bg-section-alt"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Status & Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={appt.status} size="md" />
              <span className="text-sm text-text-secondary">Booked on {format(parseISO(appt.createdAt), 'MMM dd, yyyy HH:mm')}</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{appt.name}</h3>
            <p className="text-sm text-text-secondary mt-1">{appt.treatment}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.filter(a => a.show).map(action => (
              <button
                key={action.label}
                onClick={() => {
                  if (action.label === 'Restore' || action.label === 'Confirm' || action.label === 'Mark Complete' || action.label === 'Mark Pending') {
                    handleStatus(action.status);
                  }
                }}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs font-semibold transition-colors ${action.color}`}
              >
                <action.icon size={14} />
                {action.label}
              </button>
            ))}
            {appt.status !== 'cancelled' && appt.status !== 'completed' && (
              <button
                onClick={() => setCancelOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
              >
                <XCircle size={14} />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <User size={18} className="text-dental-blue" />
              Patient Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={User} label="Name" value={appt.name} />
              <InfoRow icon={Phone} label="Phone" value={appt.phone} link={`tel:${appt.phone}`} />
              <InfoRow icon={Mail} label="Email" value={appt.email || 'Not provided'} link={appt.email ? `mailto:${appt.email}` : undefined} />
              <InfoRow icon={FileText} label="Treatment" value={appt.treatment} />
            </div>
          </div>

          {/* Appointment Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <Calendar size={18} className="text-dental-blue" />
              Appointment Schedule
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={Calendar} label="Date" value={format(parseISO(appt.date), 'EEEE, MMM dd, yyyy')} />
              <InfoRow icon={Clock} label="Time" value={appt.time} />
            </div>
          </div>

          {/* Patient Message */}
          {appt.message && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                <MessageSquare size={18} className="text-dental-blue" />
                Patient Message
              </h3>
              <p className="text-sm text-text-secondary bg-section-alt rounded-xl p-4 leading-relaxed">
                "{appt.message}"
              </p>
            </div>
          )}

          {/* Internal Notes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <FileText size={18} className="text-dental-blue" />
              Internal Notes
            </h3>
            {appt.notes ? (
              <p className="text-sm text-text-secondary bg-section-alt rounded-xl p-4 leading-relaxed">
                {appt.notes}
              </p>
            ) : (
              <p className="text-sm text-text-light italic">No internal notes added yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <History size={18} className="text-dental-blue" />
              Status History
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-dental-blue mt-2" />
                <div>
                  <p className="text-xs font-semibold text-text-primary">Booking Created</p>
                  <p className="text-xs text-text-secondary">{format(parseISO(appt.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
              {appt.status === 'cancelled' && appt.cancelledAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Cancelled</p>
                    <p className="text-xs text-text-secondary">{format(parseISO(appt.cancelledAt), 'MMM dd, yyyy HH:mm')}</p>
                    {appt.cancellationReason && (
                      <p className="text-xs text-text-secondary mt-1 italic">"{appt.cancellationReason}"</p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal mt-2" />
                <div>
                  <p className="text-xs font-semibold text-text-primary">Last Updated</p>
                  <p className="text-xs text-text-secondary">{format(parseISO(appt.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-gradient-to-br from-dental-blue to-teal rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <Send size={18} />
              Quick Contact
            </h3>
            <div className="space-y-2">
              <a
                href={`tel:${appt.phone}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors"
              >
                <Phone size={14} />
                Call Patient
              </a>
              <a
                href={`https://wa.me/${appt.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(appt.name)},%20regarding%20your%20appointment%20at%20SPS%20Dental%20Clinic...`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors"
              >
                <MessageSquare size={14} />
                WhatsApp
              </a>
              {appt.email && (
                <a
                  href={`mailto:${appt.email}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors"
                >
                  <Mail size={14} />
                  Send Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <AppointmentModal
          appointment={appt}
          onClose={() => setEditOpen(false)}
          onSave={() => {
            setAppt(appointmentsDB.findById(appt.id) || null);
            setEditOpen(false);
          }}
        />
      )}

      {deleteOpen && (
        <ConfirmDialog
          title="Delete Appointment?"
          message="This action cannot be undone. The appointment will be permanently removed."
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
        />
      )}

      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Cancel Appointment</h3>
            <p className="text-sm text-text-secondary mb-4">Please provide a reason for cancellation. This will be recorded for tracking purposes.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              placeholder="Cancellation reason..."
              className="w-full px-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setCancelOpen(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:bg-section-alt">
                Keep Appointment
              </button>
              <button onClick={handleCancel} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, link }: { icon: any; label: string; value: string; link?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-section-alt flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className={`text-sm font-medium text-text-primary break-words ${link ? 'hover:text-dental-blue' : ''}`}>{value}</p>
      </div>
    </div>
  );
  return link ? <a href={link}>{content}</a> : content;
}
