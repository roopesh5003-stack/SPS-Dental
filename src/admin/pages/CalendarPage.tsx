import { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Plus,
  Clock
} from 'lucide-react';
import {
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameMonth, isToday, addMonths, addWeeks
} from 'date-fns';
import { appointmentsDB, Appointment } from '../db/database';
import StatusBadge from '../components/StatusBadge';
import AppointmentModal from '../components/AppointmentModal';

type View = 'month' | 'week' | 'day';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-300',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  completed: 'bg-dental-blue/10 text-dental-blue border-dental-blue/30',
  cancelled: 'bg-red-100 text-red-700 border-red-200 opacity-60',
  'no-show': 'bg-gray-100 text-gray-700 border-gray-300',
};

export default function CalendarPage() {
  const [view, setView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);

  const appointments = appointmentsDB.list();

  const days = useMemo(() => {
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return eachDayOfInterval({ start, end });
    } else if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    }
    return [currentDate];
  }, [view, currentDate]);

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments
      .filter(a => a.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const navigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }
    const factor = direction === 'next' ? 1 : -1;
    if (view === 'month') setCurrentDate(d => addMonths(d, factor));
    else if (view === 'week') setCurrentDate(d => addWeeks(d, factor));
    else setCurrentDate(d => addDays(d, factor));
  };

  const getHeaderText = () => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
    }
    return format(currentDate, 'EEEE, MMMM dd, yyyy');
  };

  const refresh = () => { /* re-render is automatic since we re-read */ };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Calendar</h2>
          <p className="text-sm text-text-secondary mt-1">Visual appointment scheduling and management</p>
        </div>
        <button
          onClick={() => { setEditingAppt(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-semibold"
        >
          <Plus size={16} />
          New Appointment
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('prev')} className="p-2 rounded-lg text-text-secondary hover:bg-section-alt">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => navigate('today')} className="px-3 py-1.5 rounded-lg text-sm font-medium text-text-primary hover:bg-section-alt">
            Today
          </button>
          <button onClick={() => navigate('next')} className="p-2 rounded-lg text-text-secondary hover:bg-section-alt">
            <ChevronRight size={18} />
          </button>
          <h3 className="text-lg font-bold text-text-primary ml-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {getHeaderText()}
          </h3>
        </div>
        <div className="flex gap-1 p-1 bg-section-alt rounded-xl">
          {(['month', 'week', 'day'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                view === v ? 'bg-white text-dental-blue shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Day Headers */}
        {view !== 'day' && (
          <div className={`grid ${view === 'month' ? 'grid-cols-7' : 'grid-cols-7'} border-b border-gray-100`}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="px-2 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>
        )}

        {/* Day View */}
        {view === 'day' && (
          <DayView date={currentDate} appointments={getAppointmentsForDay(currentDate)} onSelect={(a) => { setEditingAppt(a); setModalOpen(true); }} />
        )}

        {/* Month View */}
        {view === 'month' && (
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayAppts = getAppointmentsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);
              return (
                <div
                  key={i}
                  className={`min-h-[110px] border-b border-r border-gray-100 p-2 ${
                    !isCurrentMonth ? 'bg-section-alt/50' : ''
                  } ${isDayToday ? 'bg-accent/40' : ''}`}
                >
                  <div className={`text-xs font-semibold mb-1.5 ${
                    isDayToday
                      ? 'w-6 h-6 rounded-full bg-dental-blue text-white flex items-center justify-center'
                      : isCurrentMonth
                        ? 'text-text-primary'
                        : 'text-text-light'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayAppts.slice(0, 3).map(a => (
                      <button
                        key={a.id}
                        onClick={() => { setEditingAppt(a); setModalOpen(true); }}
                        className={`w-full text-left px-1.5 py-1 rounded text-[10px] font-medium border truncate hover:opacity-80 ${STATUS_COLORS[a.status]}`}
                        title={`${a.time} - ${a.name} - ${a.treatment}`}
                      >
                        <span className="font-bold">{a.time}</span> {a.name}
                      </button>
                    ))}
                    {dayAppts.length > 3 && (
                      <div className="text-[10px] text-text-secondary font-medium">
                        +{dayAppts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Week View */}
        {view === 'week' && (
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayAppts = getAppointmentsForDay(day);
              const isDayToday = isToday(day);
              return (
                <div key={i} className={`min-h-[300px] border-r border-gray-100 p-3 ${isDayToday ? 'bg-accent/40' : ''}`}>
                  <div className="text-center mb-3 pb-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-2xl font-bold mt-1 ${isDayToday ? 'text-dental-blue' : 'text-text-primary'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {dayAppts.length === 0 ? (
                      <p className="text-xs text-text-light text-center py-4">No appointments</p>
                    ) : (
                      dayAppts.map(a => (
                        <button
                          key={a.id}
                          onClick={() => { setEditingAppt(a); setModalOpen(true); }}
                          className={`w-full text-left p-2 rounded-lg border text-xs hover:opacity-80 ${STATUS_COLORS[a.status]}`}
                        >
                          <div className="font-bold flex items-center gap-1 mb-1">
                            <Clock size={10} />
                            {a.time}
                          </div>
                          <div className="font-semibold truncate">{a.name}</div>
                          <div className="truncate opacity-80">{a.treatment}</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Status Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries({
            new: 'New',
            confirmed: 'Confirmed',
            pending: 'Pending',
            completed: 'Completed',
            cancelled: 'Cancelled',
            'no-show': 'No Show',
          }).map(([k, v]) => (
            <span key={k} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${STATUS_COLORS[k]}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {v}
            </span>
          ))}
        </div>
      </div>

      {modalOpen && (
        <AppointmentModal
          appointment={editingAppt}
          onClose={() => { setModalOpen(false); setEditingAppt(null); }}
          onSave={() => { setModalOpen(false); setEditingAppt(null); refresh(); }}
        />
      )}
    </div>
  );
}

function DayView({ appointments, onSelect }: { date: Date; appointments: Appointment[]; onSelect: (a: Appointment) => void }) {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  return (
    <div className="p-4">
      <h4 className="font-bold text-text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled
      </h4>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {hours.map(hour => {
          const hourAppts = appointments.filter(a => {
            const aHour = parseInt(a.time.split(':')[0]);
            return aHour === hour;
          });
          return (
            <div key={hour} className="flex gap-4">
              <div className="w-16 flex-shrink-0 pt-2 text-xs font-semibold text-text-secondary">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 border-l-2 border-gray-100 pl-4 space-y-2 min-h-[50px]">
                {hourAppts.length === 0 ? (
                  <div className="h-12 border border-dashed border-gray-200 rounded-lg" />
                ) : (
                  hourAppts.map(a => (
                    <button
                      key={a.id}
                      onClick={() => onSelect(a)}
                      className={`w-full text-left p-3 rounded-lg border-l-4 hover:opacity-80 ${STATUS_COLORS[a.status]}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold flex items-center gap-1.5">
                          <Clock size={12} />
                          {a.time}
                        </span>
                        <StatusBadge status={a.status} />
                      </div>
                      <div className="font-semibold">{a.name}</div>
                      <div className="text-xs opacity-80">{a.treatment}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
