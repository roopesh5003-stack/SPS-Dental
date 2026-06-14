import { useState, useEffect, useMemo } from 'react';
import {
  Search, User, Phone, Mail, Calendar, Edit, Trash2,
  Plus, X, Save, FileText, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { patientsDB, Patient, appointmentsDB } from '../db/database';
import ConfirmDialog from '../components/ConfirmDialog';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = () => setPatients(patientsDB.list());
  useEffect(refresh, []);

  const filtered = useMemo(() => {
    if (!search) return patients;
    const q = search.toLowerCase();
    return patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  }, [patients, search]);

  const getPatientAppointments = (id: string) => appointmentsDB.list().filter(a => a.patientId === id || a.email === patients.find(p => p.id === id)?.email);

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Age', 'Gender', 'Address', 'Total Visits', 'Last Visit'];
    const rows = filtered.map(p => [p.name, p.phone, p.email, p.age || '', p.gender || '', p.address || '', p.totalVisits, p.lastVisit || '']);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c.toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Patient Database</h2>
          <p className="text-sm text-text-secondary mt-1">Manage your patient records and history</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-text-primary text-sm font-semibold hover:bg-section-alt">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => { setEditing({ name: '', phone: '', email: '', totalVisits: 0 } as Patient); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-semibold"
          >
            <Plus size={16} />
            Add Patient
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients by name, phone, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
          />
        </div>
        <p className="text-xs text-text-secondary mt-3">
          Showing {filtered.length} of {patients.length} patients
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-section-alt flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-text-light" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">No patients found</h3>
            <p className="text-sm text-text-secondary">Try adjusting your search or add a new patient.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filtered.map(p => (
              <div key={p.id} className="p-4 rounded-2xl border border-gray-100 hover:border-dental-blue/30 hover:shadow-md transition-all group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate" style={{ fontFamily: 'var(--font-heading)' }}>{p.name}</h3>
                    <p className="text-xs text-text-secondary">{p.totalVisits} visit{p.totalVisits !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-text-secondary mb-3">
                  <div className="flex items-center gap-2 truncate">
                    <Phone size={12} className="flex-shrink-0" />
                    {p.phone}
                  </div>
                  {p.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={12} className="flex-shrink-0" />
                      {p.email}
                    </div>
                  )}
                  {p.lastVisit && (
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="flex-shrink-0" />
                      Last visit: {format(parseISO(p.lastVisit), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setSelected(p)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-section-alt text-text-secondary text-xs font-semibold hover:bg-dental-blue/10 hover:text-dental-blue transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => { setEditing(p); setModalOpen(true); }}
                    className="p-1.5 rounded-lg text-text-secondary hover:bg-dental-blue/10 hover:text-dental-blue"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="p-1.5 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold">
                  {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{selected.name}</h3>
                  <p className="text-xs text-text-secondary">{selected.totalVisits} visits</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg text-text-secondary hover:bg-section-alt">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <InfoBlock label="Phone" value={selected.phone} icon={Phone} />
                <InfoBlock label="Email" value={selected.email} icon={Mail} />
                {selected.age && <InfoBlock label="Age" value={selected.age.toString()} icon={User} />}
                {selected.gender && <InfoBlock label="Gender" value={selected.gender} icon={User} />}
                {selected.address && <InfoBlock label="Address" value={selected.address} icon={FileText} />}
                {selected.lastVisit && <InfoBlock label="Last Visit" value={format(parseISO(selected.lastVisit), 'MMM dd, yyyy')} icon={Calendar} />}
              </div>
              {selected.medicalHistory && (
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Medical History</h4>
                  <p className="text-sm text-text-primary bg-section-alt rounded-xl p-3">{selected.medicalHistory}</p>
                </div>
              )}
              <div>
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Appointment History</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getPatientAppointments(selected.id).length === 0 ? (
                    <p className="text-sm text-text-light italic">No appointments yet</p>
                  ) : (
                    getPatientAppointments(selected.id).map(a => (
                      <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-section-alt">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{a.treatment}</p>
                          <p className="text-xs text-text-secondary">{format(parseISO(a.date), 'MMM dd, yyyy')} at {a.time}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          a.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          a.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {a.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && editing && (
        <PatientModal patient={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={() => { refresh(); setModalOpen(false); setEditing(null); }} />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Patient?"
          message="This will permanently remove the patient record from your database."
          confirmText="Delete"
          onConfirm={() => { patientsDB.delete(deleteId); refresh(); setDeleteId(null); toast.success('Patient deleted'); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

function InfoBlock({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-section-alt flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-text-primary break-words">{value}</p>
      </div>
    </div>
  );
}

function PatientModal({ patient, onClose, onSave }: { patient: Patient; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState<Partial<Patient>>(patient);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Name and phone are required');
      return;
    }
    if (patient.id) {
      patientsDB.update(patient.id, form);
      toast.success('Patient updated');
    } else {
      patientsDB.create({ ...(form as Patient), totalVisits: 0 });
      toast.success('Patient added');
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {patient.id ? 'Edit Patient' : 'Add Patient'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-text-secondary hover:bg-section-alt">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <InputField label="Name *" name="name" value={form.name || ''} onChange={handleChange} />
          <InputField label="Phone *" name="phone" value={form.phone || ''} onChange={handleChange} />
          <InputField label="Email" name="email" type="email" value={form.email || ''} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Age" name="age" type="number" value={form.age?.toString() || ''} onChange={handleChange} />
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">Gender</label>
              <select name="gender" value={form.gender || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <InputField label="Address" name="address" value={form.address || ''} onChange={handleChange} />
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">Medical History / Notes</label>
            <textarea name="medicalHistory" value={form.medicalHistory || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:bg-section-alt">Cancel</button>
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm font-semibold">
              <Save size={16} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text' }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-primary mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
      />
    </div>
  );
}
