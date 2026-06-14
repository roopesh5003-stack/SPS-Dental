import { useState, useEffect } from 'react';
import {
  Building2, Clock, Globe, Calendar,
  Save, Plus, Trash2, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsDB, ClinicSettings, AdminUser } from '../db/database';
import { useAuth } from '../context/AuthContext';

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'clinic' | 'hours' | 'appointments' | 'social' | 'profile'>('clinic');
  const [settings, setSettings] = useState<ClinicSettings>(settingsDB.get());
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    setSettings(settingsDB.get());
  }, []);

  const saveSettings = () => {
    settingsDB.update(settings);
    toast.success('Settings saved successfully');
  };

  const saveProfile = () => {
    if (!user) return;
    if (profile.newPassword && profile.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const updates: Partial<AdminUser> = { name: profile.name, email: profile.email };
    if (profile.newPassword) {
      if (profile.currentPassword !== user.password) {
        toast.error('Current password is incorrect');
        return;
      }
      updates.password = profile.newPassword;
    }
    updateUser(updates);
    toast.success('Profile updated');
    setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
  };

  const addHoliday = () => {
    const date = prompt('Enter holiday date (YYYY-MM-DD):');
    if (!date) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      toast.error('Invalid date format');
      return;
    }
    if (settings.holidays.includes(date)) {
      toast.error('Holiday already added');
      return;
    }
    setSettings({ ...settings, holidays: [...settings.holidays, date] });
  };

  const removeHoliday = (date: string) => {
    setSettings({ ...settings, holidays: settings.holidays.filter(d => d !== date) });
  };

  const addTimeSlot = () => {
    const slot = prompt('Enter time slot (HH:MM, 24-hour format):');
    if (!slot) return;
    if (!/^\d{2}:\d{2}$/.test(slot)) {
      toast.error('Invalid time format. Use HH:MM (e.g., 09:00)');
      return;
    }
    if (settings.appointment.availableSlots.includes(slot)) {
      toast.error('Slot already exists');
      return;
    }
    setSettings({
      ...settings,
      appointment: {
        ...settings.appointment,
        availableSlots: [...settings.appointment.availableSlots, slot].sort(),
      },
    });
  };

  const removeTimeSlot = (slot: string) => {
    setSettings({
      ...settings,
      appointment: {
        ...settings.appointment,
        availableSlots: settings.appointment.availableSlots.filter(s => s !== slot),
      },
    });
  };

  const tabs = [
    { key: 'clinic', label: 'Clinic Info', icon: Building2 },
    { key: 'hours', label: 'Working Hours', icon: Clock },
    { key: 'appointments', label: 'Appointments', icon: Calendar },
    { key: 'social', label: 'Social Media', icon: Globe },
    { key: 'profile', label: 'My Profile', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Settings</h2>
        <p className="text-sm text-text-secondary mt-1">Manage clinic configuration and your account</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? 'bg-dental-blue text-white'
                    : 'text-text-secondary hover:bg-section-alt'
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'clinic' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Clinic Information</h3>
              <p className="text-xs text-text-secondary mb-6">Basic details about your clinic</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Clinic Name</label>
                  <input
                    type="text"
                    value={settings.clinicName}
                    onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">City</label>
                    <input
                      type="text"
                      value={settings.city}
                      onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">State</label>
                    <input
                      type="text"
                      value={settings.state}
                      onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Zip Code</label>
                    <input
                      type="text"
                      value={settings.zipCode}
                      onChange={(e) => setSettings({ ...settings, zipCode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">WhatsApp</label>
                    <input
                      type="tel"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button onClick={saveSettings} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Working Hours</h3>
              <p className="text-xs text-text-secondary mb-6">Set your clinic's operating hours for each day</p>

              <div className="space-y-3">
                {DAYS.map(day => {
                  const hours = settings.workingHours[day.key];
                  return (
                    <div key={day.key} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-section-alt">
                      <div className="w-28 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`closed-${day.key}`}
                          checked={!hours.closed}
                          onChange={(e) => setSettings({
                            ...settings,
                            workingHours: {
                              ...settings.workingHours,
                              [day.key]: { ...hours, closed: !e.target.checked },
                            },
                          })}
                          className="w-4 h-4 rounded border-gray-300 text-dental-blue focus:ring-dental-blue"
                        />
                        <label htmlFor={`closed-${day.key}`} className="text-sm font-medium text-text-primary">
                          {day.label}
                        </label>
                      </div>
                      {!hours.closed ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => setSettings({
                              ...settings,
                              workingHours: {
                                ...settings.workingHours,
                                [day.key]: { ...hours, open: e.target.value },
                              },
                            })}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                          />
                          <span className="text-text-light text-sm">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => setSettings({
                              ...settings,
                              workingHours: {
                                ...settings.workingHours,
                                [day.key]: { ...hours, close: e.target.value },
                              },
                            })}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-text-light italic">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-text-primary mb-3">Holidays</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {settings.holidays.map(h => (
                    <span key={h} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium">
                      {h}
                      <button onClick={() => removeHoliday(h)} className="hover:text-red-900">
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <button onClick={addHoliday} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-section-alt text-text-secondary text-xs font-semibold hover:bg-gray-200">
                  <Plus size={12} />
                  Add Holiday
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <button onClick={saveSettings} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Appointment Settings</h3>
              <p className="text-xs text-text-secondary mb-6">Configure how appointments are scheduled</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Default Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings.appointment.duration}
                    onChange={(e) => setSettings({
                      ...settings,
                      appointment: { ...settings.appointment, duration: parseInt(e.target.value) || 30 },
                    })}
                    className="w-32 px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Reminder Hours Before</label>
                  <input
                    type="number"
                    value={settings.appointment.reminderHoursBefore}
                    onChange={(e) => setSettings({
                      ...settings,
                      appointment: { ...settings.appointment, reminderHoursBefore: parseInt(e.target.value) || 24 },
                    })}
                    className="w-32 px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-section-alt">
                  <input
                    type="checkbox"
                    id="autoConfirm"
                    checked={settings.appointment.autoConfirm}
                    onChange={(e) => setSettings({
                      ...settings,
                      appointment: { ...settings.appointment, autoConfirm: e.target.checked },
                    })}
                    className="w-4 h-4 rounded border-gray-300 text-dental-blue focus:ring-dental-blue"
                  />
                  <label htmlFor="autoConfirm" className="text-sm font-medium text-text-primary">
                    Auto-confirm new appointments
                  </label>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Available Time Slots</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {settings.appointment.availableSlots.map(slot => (
                      <span key={slot} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dental-blue/10 text-dental-blue text-xs font-medium">
                        {slot}
                        <button onClick={() => removeTimeSlot(slot)} className="hover:text-red-500">
                          <Trash2 size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button onClick={addTimeSlot} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-section-alt text-text-secondary text-xs font-semibold hover:bg-gray-200">
                    <Plus size={12} />
                    Add Time Slot
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button onClick={saveSettings} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Social Media</h3>
              <p className="text-xs text-text-secondary mb-6">Connect your social media accounts</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-2">
                    <span className="font-bold text-xs">f</span>
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.facebook}
                    onChange={(e) => setSettings({ ...settings, social: { ...settings.social, facebook: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-2">
                    <span className="font-bold text-xs">IG</span>
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.instagram}
                    onChange={(e) => setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-2">
                    <span className="font-bold text-xs">YT</span>
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.youtube}
                    onChange={(e) => setSettings({ ...settings, social: { ...settings.social, youtube: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-2">
                    <span className="font-bold text-xs">X</span>
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={settings.social.twitter}
                    onChange={(e) => setSettings({ ...settings, social: { ...settings.social, twitter: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button onClick={saveSettings} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && user && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>My Profile</h3>
                <p className="text-xs text-text-secondary mb-6">Update your account information</p>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold text-xl">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{user.name}</h4>
                    <p className="text-sm text-text-secondary">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-dental-blue/10 text-dental-blue text-[10px] font-semibold uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Change Password</h3>
                <p className="text-xs text-text-secondary mb-6">Update your password to keep your account secure</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-section-alt border-0 text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                  <button onClick={saveProfile} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold">
                    <Save size={16} />
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
