import { useState } from 'react';
import { X, Save, User, Phone, Mail, FileText, CalendarDays, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Appointment, appointmentsDB, settingsDB, AppointmentStatus } from '../db/database';

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
  onSave: () => void;
}

const TREATMENTS = [
  'General Checkup',
  'Teeth Cleaning',
  'Root Canal Treatment',
  'Dental Implants',
  'Orthodontics / Braces',
  'Cosmetic Dentistry',
  'Pediatric Dentistry',
  'Laser Dentistry',
  'Emergency Dental Care',
  'Other',
];

const STATUSES: AppointmentStatus[] = ['new', 'confirmed', 'pending', 'completed', 'cancelled', 'no-show'];

export default function AppointmentModal({ appointment, onClose, onSave }: Props) {
  const settings = settingsDB.get();
  const [form, setForm] = useState({
    name: appointment?.name || '',
    phone: appointment?.phone || '',
    email: appointment?.email || '',
    treatment: appointment?.treatment || TREATMENTS[0],
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || settings.appointment.availableSlots[0] || '09:00',
    message: appointment?.message || '',
    status: (appointment?.status || 'new') as AppointmentStatus,
    notes: appointment?.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Name and phone are required');
      return;
    }
    if (appointment) {
      appointmentsDB.update(appointment.id, form);
      toast.success('Appointment updated');
    } else {
      appointmentsDB.create(form);
      toast.success('Appointment created');
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              {appointment ? 'Edit Appointment' : 'New Appointment'}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {appointment ? 'Update the appointment details' : 'Schedule a new appointment for a patient'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-text-secondary hover:bg-section-alt">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">Patient Name *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">Phone *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Treatment *</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <select
                name="treatment"
                value={form.treatment}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
              >
                {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">Date *</label>
              <div className="relative">
                <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">Time *</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                >
                  {settings.appointment.availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Patient Message</label>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-3 top-3 text-text-light" />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white resize-none"
                placeholder="Patient's note or reason for visit..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Internal Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white resize-none"
              placeholder="Staff notes (not visible to patient)..."
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-section-alt">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold"
          >
            <Save size={16} />
            {appointment ? 'Save Changes' : 'Create Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}
