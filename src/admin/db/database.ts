// Dental Clinic Admin Database Layer
// Uses localStorage for persistent storage - acts as our "real database"
// In production, this would be replaced with REST/GraphQL API calls to a backend

export type AppointmentStatus = 'new' | 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show';
export type InquiryStatus = 'unread' | 'read' | 'replied';
export type UserRole = 'admin' | 'receptionist' | 'staff';

export interface Appointment {
  id: string;
  patientId?: string;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  message: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  cancelledAt?: string;
  notes?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  medicalHistory?: string;
  notes?: string;
  totalVisits: number;
  lastVisit?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  repliedAt?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string; // In production, would be hashed on server
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'appointment_new' | 'appointment_cancelled' | 'inquiry_new' | 'appointment_reminder';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ClinicSettings {
  clinicName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  whatsapp: string;
  workingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
  appointment: {
    duration: number; // minutes
    availableSlots: string[]; // ['09:00', '10:00', ...]
    autoConfirm: boolean;
    reminderHoursBefore: number;
  };
  holidays: string[]; // YYYY-MM-DD
}

// Database Keys
const KEYS = {
  APPOINTMENTS: 'sps_appointments',
  PATIENTS: 'sps_patients',
  INQUIRIES: 'sps_inquiries',
  USERS: 'sps_admin_users',
  NOTIFICATIONS: 'sps_notifications',
  SETTINGS: 'sps_settings',
  SESSION: 'sps_admin_session',
};

// ============ SESSION MANAGEMENT ============
export const session = {
  get(): { userId: string; loginAt: string } | null {
    const data = localStorage.getItem(KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  },
  set(userId: string) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify({ userId, loginAt: new Date().toISOString() }));
  },
  clear() {
    localStorage.removeItem(KEYS.SESSION);
  },
};

// ============ GENERIC CRUD ============
function getCollection<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setCollection<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============ USERS ============
export const usersDB = {
  list: (): AdminUser[] => getCollection<AdminUser>(KEYS.USERS),
  findById: (id: string): AdminUser | undefined => usersDB.list().find(u => u.id === id),
  findByEmail: (email: string): AdminUser | undefined => usersDB.list().find(u => u.email.toLowerCase() === email.toLowerCase()),
  create: (user: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser => {
    const newUser: AdminUser = { ...user, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const all = usersDB.list();
    all.push(newUser);
    setCollection(KEYS.USERS, all);
    return newUser;
  },
  update: (id: string, updates: Partial<AdminUser>) => {
    const all = usersDB.list();
    const idx = all.findIndex(u => u.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      setCollection(KEYS.USERS, all);
      return all[idx];
    }
    return null;
  },
  delete: (id: string) => {
    setCollection(KEYS.USERS, usersDB.list().filter(u => u.id !== id));
  },
  seedIfEmpty: () => {
    if (usersDB.list().length === 0) {
      usersDB.create({
        name: 'Dr. A. Dhanalakshmi',
        email: 'admin@spsdental.com',
        password: 'admin123',
        role: 'admin',
      });
      usersDB.create({
        name: 'Reception Desk',
        email: 'reception@spsdental.com',
        password: 'staff123',
        role: 'receptionist',
      });
    }
  },
};

// ============ APPOINTMENTS ============
export const appointmentsDB = {
  list: (): Appointment[] => getCollection<Appointment>(KEYS.APPOINTMENTS),
  findById: (id: string): Appointment | undefined => appointmentsDB.list().find(a => a.id === id),
  create: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: AppointmentStatus }): Appointment => {
    const now = new Date().toISOString();
    const newAppt: Appointment = {
      ...data,
      id: crypto.randomUUID(),
      status: data.status || 'new',
      createdAt: now,
      updatedAt: now,
    };
    const all = appointmentsDB.list();
    all.push(newAppt);
    setCollection(KEYS.APPOINTMENTS, all);

    // Auto-add notification
    notificationsDB.create({
      type: 'appointment_new',
      title: 'New Appointment',
      message: `${newAppt.name} booked ${newAppt.treatment} on ${newAppt.date} at ${newAppt.time}`,
      link: `/admin/appointments/${newAppt.id}`,
    });

    // Auto-add patient if not exists
    patientsDB.upsert({
      name: newAppt.name,
      phone: newAppt.phone,
      email: newAppt.email,
    });

    return newAppt;
  },
  update: (id: string, updates: Partial<Appointment>): Appointment | null => {
    const all = appointmentsDB.list();
    const idx = all.findIndex(a => a.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
      setCollection(KEYS.APPOINTMENTS, all);
      return all[idx];
    }
    return null;
  },
  delete: (id: string) => {
    setCollection(KEYS.APPOINTMENTS, appointmentsDB.list().filter(a => a.id !== id));
  },
  seedIfEmpty: () => {
    if (appointmentsDB.list().length === 0) {
      const today = new Date();
      const samples: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Priya Krishnan',
          phone: '+91 98765 43210',
          email: 'priya.krishnan@email.com',
          treatment: 'Root Canal Treatment',
          date: formatDate(today),
          time: '10:00',
          message: 'Severe tooth pain in upper right molar',
          status: 'confirmed',
        },
        {
          name: 'Rajesh Kumar',
          phone: '+91 99887 76655',
          email: 'rajesh.k@email.com',
          treatment: 'General Checkup',
          date: formatDate(today),
          time: '11:30',
          message: 'Regular 6-month checkup',
          status: 'new',
        },
        {
          name: 'Lakshmi Sundaram',
          phone: '+91 97654 32109',
          email: 'lakshmi.s@email.com',
          treatment: 'Dental Implants',
          date: formatDate(addDays(today, 2)),
          time: '14:00',
          message: 'Consultation for missing tooth replacement',
          status: 'confirmed',
        },
        {
          name: 'Arun Venkatesh',
          phone: '+91 96543 21098',
          email: 'arun.v@email.com',
          treatment: 'Teeth Cleaning',
          date: formatDate(addDays(today, 3)),
          time: '09:30',
          message: 'Scaling and polishing',
          status: 'pending',
        },
        {
          name: 'Meena Raghavan',
          phone: '+91 95432 10987',
          email: 'meena.r@email.com',
          treatment: 'Cosmetic Dentistry',
          date: formatDate(addDays(today, 5)),
          time: '15:00',
          message: 'Smile makeover consultation',
          status: 'new',
        },
        {
          name: 'Saravanan Murugan',
          phone: '+91 94321 09876',
          email: 'saravanan.m@email.com',
          treatment: 'Pediatric Dentistry',
          date: formatDate(addDays(today, 1)),
          time: '16:00',
          message: 'My 7-year-old needs dental checkup',
          status: 'confirmed',
        },
        {
          name: 'Kavitha Raj',
          phone: '+91 93210 98765',
          email: 'kavitha.r@email.com',
          treatment: 'Orthodontics',
          date: formatDate(addDays(today, 7)),
          time: '11:00',
          message: 'Interested in braces for my daughter',
          status: 'new',
        },
        {
          name: 'Vijay Anand',
          phone: '+91 92109 87654',
          email: 'vijay.a@email.com',
          treatment: 'General Dentistry',
          date: formatDate(addDays(today, -3)),
          time: '10:00',
          message: 'Tooth filling',
          status: 'completed',
        },
        {
          name: 'Divya Selvam',
          phone: '+91 91098 76543',
          email: 'divya.s@email.com',
          treatment: 'Root Canal',
          date: formatDate(addDays(today, -7)),
          time: '14:30',
          message: 'Root canal for lower molar',
          status: 'completed',
        },
        {
          name: 'Mohan Raj',
          phone: '+91 90987 65432',
          email: 'mohan.r@email.com',
          treatment: 'Teeth Cleaning',
          date: formatDate(addDays(today, -2)),
          time: '09:00',
          message: 'Routine cleaning',
          status: 'cancelled',
          cancellationReason: 'Patient had to travel urgently',
          cancelledAt: new Date(addDays(today, -3).getTime()).toISOString(),
        },
        {
          name: 'Anitha Kumari',
          phone: '+91 89876 54321',
          email: 'anitha.k@email.com',
          treatment: 'Laser Dentistry',
          date: formatDate(addDays(today, 4)),
          time: '13:00',
          message: 'Gum treatment consultation',
          status: 'pending',
        },
        {
          name: 'Karthik Raja',
          phone: '+91 88765 43210',
          email: 'karthik.r@email.com',
          treatment: 'Dental Implants',
          date: formatDate(addDays(today, 10)),
          time: '15:30',
          message: 'Implant for front tooth',
          status: 'new',
        },
      ];
      samples.forEach(s => appointmentsDB.create(s));
    }
  },
};

// ============ PATIENTS ============
export const patientsDB = {
  list: (): Patient[] => getCollection<Patient>(KEYS.PATIENTS),
  findById: (id: string): Patient | undefined => patientsDB.list().find(p => p.id === id),
  upsert: (data: { name: string; phone: string; email: string }): Patient => {
    const all = patientsDB.list();
    const existing = all.find(p => p.email.toLowerCase() === data.email.toLowerCase() || p.phone === data.phone);
    if (existing) {
      // Update last visit timestamp
      existing.lastVisit = new Date().toISOString();
      existing.totalVisits = (existing.totalVisits || 0) + 1;
      patientsDB.update(existing.id, existing);
      return existing;
    }
    const newPatient: Patient = {
      ...data,
      id: crypto.randomUUID(),
      totalVisits: 1,
      lastVisit: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    all.push(newPatient);
    setCollection(KEYS.PATIENTS, all);
    return newPatient;
  },
  create: (data: Omit<Patient, 'id' | 'createdAt'>): Patient => {
    const newPatient: Patient = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const all = patientsDB.list();
    all.push(newPatient);
    setCollection(KEYS.PATIENTS, all);
    return newPatient;
  },
  update: (id: string, updates: Partial<Patient>): Patient | null => {
    const all = patientsDB.list();
    const idx = all.findIndex(p => p.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      setCollection(KEYS.PATIENTS, all);
      return all[idx];
    }
    return null;
  },
  delete: (id: string) => {
    setCollection(KEYS.PATIENTS, patientsDB.list().filter(p => p.id !== id));
  },
  seedIfEmpty: () => {
    if (patientsDB.list().length === 0) {
      const samples = [
        { name: 'Priya Krishnan', phone: '+91 98765 43210', email: 'priya.krishnan@email.com', gender: 'female' as const, age: 32, address: 'Anna Nagar, Madurai' },
        { name: 'Rajesh Kumar', phone: '+91 99887 76655', email: 'rajesh.k@email.com', gender: 'male' as const, age: 45, address: 'KK Nagar, Madurai' },
        { name: 'Lakshmi Sundaram', phone: '+91 97654 32109', email: 'lakshmi.s@email.com', gender: 'female' as const, age: 58, address: 'Thirunagar, Madurai' },
      ];
      samples.forEach(s => patientsDB.create({ ...s, totalVisits: 1, lastVisit: new Date().toISOString() }));
    }
  },
};

// ============ INQUIRIES ============
export const inquiriesDB = {
  list: (): Inquiry[] => getCollection<Inquiry>(KEYS.INQUIRIES),
  findById: (id: string): Inquiry | undefined => inquiriesDB.list().find(i => i.id === id),
  create: (data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry => {
    const newInquiry: Inquiry = {
      ...data,
      id: crypto.randomUUID(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    const all = inquiriesDB.list();
    all.push(newInquiry);
    setCollection(KEYS.INQUIRIES, all);

    notificationsDB.create({
      type: 'inquiry_new',
      title: 'New Patient Inquiry',
      message: `${newInquiry.name}: ${newInquiry.subject}`,
      link: `/admin/inquiries`,
    });

    return newInquiry;
  },
  update: (id: string, updates: Partial<Inquiry>): Inquiry | null => {
    const all = inquiriesDB.list();
    const idx = all.findIndex(i => i.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      setCollection(KEYS.INQUIRIES, all);
      return all[idx];
    }
    return null;
  },
  delete: (id: string) => {
    setCollection(KEYS.INQUIRIES, inquiriesDB.list().filter(i => i.id !== id));
  },
  seedIfEmpty: () => {
    if (inquiriesDB.list().length === 0) {
      const samples: Omit<Inquiry, 'id' | 'createdAt' | 'status'>[] = [
        {
          name: 'Suresh Babu',
          email: 'suresh.b@email.com',
          phone: '+91 98765 11111',
          subject: 'Insurance and Payment Options',
          message: 'Hello, I would like to know if you accept dental insurance and what payment options are available for major procedures like implants.',
        },
        {
          name: 'Ramya Devi',
          email: 'ramya.d@email.com',
          phone: '+91 97654 22222',
          subject: 'Pediatric Dentist Availability',
          message: 'My 5-year-old daughter is afraid of dentists. Do you have a pediatric specialist who can handle anxious children?',
        },
        {
          name: 'Prakash M',
          email: 'prakash.m@email.com',
          phone: '+91 96543 33333',
          subject: 'Emergency Toothache',
          message: 'I have severe tooth pain since last night. Can I come in for an emergency appointment today?',
        },
        {
          name: 'Geetha Lakshmi',
          email: 'geetha.l@email.com',
          phone: '+91 95432 44444',
          subject: 'Treatment Cost Inquiry',
          message: 'Could you please share the approximate cost for teeth whitening and orthodontic treatment?',
        },
      ];
      samples.forEach(s => inquiriesDB.create(s));
    }
  },
};

// ============ NOTIFICATIONS ============
export const notificationsDB = {
  list: (): Notification[] => getCollection<Notification>(KEYS.NOTIFICATIONS),
  unreadCount: (): number => notificationsDB.list().filter(n => !n.read).length,
  create: (data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification => {
    const newNotif: Notification = {
      ...data,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    const all = notificationsDB.list();
    all.unshift(newNotif); // newest first
    // Keep only last 50
    if (all.length > 50) all.length = 50;
    setCollection(KEYS.NOTIFICATIONS, all);
    return newNotif;
  },
  markRead: (id: string) => {
    const all = notificationsDB.list();
    const idx = all.findIndex(n => n.id === id);
    if (idx >= 0) {
      all[idx].read = true;
      setCollection(KEYS.NOTIFICATIONS, all);
    }
  },
  markAllRead: () => {
    const all = notificationsDB.list().map(n => ({ ...n, read: true }));
    setCollection(KEYS.NOTIFICATIONS, all);
  },
  delete: (id: string) => {
    setCollection(KEYS.NOTIFICATIONS, notificationsDB.list().filter(n => n.id !== id));
  },
  clearAll: () => {
    setCollection(KEYS.NOTIFICATIONS, []);
  },
};

// ============ SETTINGS ============
const DEFAULT_SETTINGS: ClinicSettings = {
  clinicName: 'SPS Multispeciality Dental Clinic',
  address: '2/598, Thirumohoor Road, Near Rishi Hospital, Othakadai',
  city: 'Madurai',
  state: 'Tamil Nadu',
  zipCode: '625107',
  phone: '+91 88077 00880',
  email: 'info@spsdental.com',
  whatsapp: '+91 88077 00880',
  workingHours: {
    monday: { open: '09:00', close: '21:00', closed: false },
    tuesday: { open: '09:00', close: '21:00', closed: false },
    wednesday: { open: '09:00', close: '21:00', closed: false },
    thursday: { open: '09:00', close: '21:00', closed: false },
    friday: { open: '09:00', close: '21:00', closed: false },
    saturday: { open: '09:00', close: '21:00', closed: false },
    sunday: { open: '10:00', close: '14:00', closed: false },
  },
  social: {
    facebook: 'https://facebook.com/spsdental',
    instagram: 'https://instagram.com/spsdental',
    youtube: 'https://youtube.com/spsdental',
    twitter: 'https://twitter.com/spsdental',
  },
  appointment: {
    duration: 30,
    availableSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
    autoConfirm: false,
    reminderHoursBefore: 24,
  },
  holidays: ['2026-01-26', '2026-08-15', '2026-10-02'],
};

export const settingsDB = {
  get: (): ClinicSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  },
  update: (updates: Partial<ClinicSettings>): ClinicSettings => {
    const current = settingsDB.get();
    const updated = { ...current, ...updates };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },
};

// ============ HELPERS ============
function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}
function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

// ============ INIT DATABASE ============
export function initDatabase() {
  usersDB.seedIfEmpty();
  appointmentsDB.seedIfEmpty();
  patientsDB.seedIfEmpty();
  inquiriesDB.seedIfEmpty();
  settingsDB.get();
}
