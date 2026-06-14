import { AppointmentStatus } from '../db/database';

interface Props {
  status: AppointmentStatus | string;
  size?: 'sm' | 'md';
}

const config: Record<string, { label: string; classes: string }> = {
  new: { label: 'New', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  confirmed: { label: 'Confirmed', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'Pending', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', classes: 'bg-dental-blue/10 text-dental-blue border-dental-blue/20' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-700 border-red-200' },
  'no-show': { label: 'No Show', classes: 'bg-gray-100 text-gray-700 border-gray-200' },
  unread: { label: 'Unread', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  read: { label: 'Read', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  replied: { label: 'Replied', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const conf = config[status] || { label: status, classes: 'bg-gray-100 text-gray-700 border-gray-200' };
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${conf.classes} ${sizeClasses}`}>
      {conf.label}
    </span>
  );
}
