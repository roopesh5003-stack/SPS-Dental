import { useNavigate } from 'react-router-dom';
import { Bell, X, CheckCheck, Trash2, Calendar, MessageSquare, Activity } from 'lucide-react';
import { notificationsDB, Notification } from '../db/database';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  notifications: Notification[];
  onClose: () => void;
  onUpdate: () => void;
}

export default function NotificationCenter({ notifications, onClose, onUpdate }: Props) {
  const navigate = useNavigate();

  const handleMarkRead = (id: string) => {
    notificationsDB.markRead(id);
    onUpdate();
  };

  const handleMarkAllRead = () => {
    notificationsDB.markAllRead();
    onUpdate();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    notificationsDB.delete(id);
    onUpdate();
  };

  const handleClick = (n: Notification) => {
    if (!n.read) handleMarkRead(n.id);
    if (n.link) {
      navigate(n.link);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment_new': return <Calendar size={16} className="text-dental-blue" />;
      case 'appointment_cancelled': return <Activity size={16} className="text-red-500" />;
      case 'inquiry_new': return <MessageSquare size={16} className="text-teal" />;
      default: return <Bell size={16} className="text-text-secondary" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[80vh] rounded-2xl bg-white shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Notifications</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {notifications.filter(n => !n.read).length} unread
            </p>
          </div>
          <div className="flex items-center gap-1">
            {notifications.some(n => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 text-text-secondary hover:bg-section-alt rounded-lg transition-colors"
                title="Mark all read"
              >
                <CheckCheck size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-text-secondary hover:bg-section-alt rounded-lg transition-colors lg:hidden"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-section-alt flex items-center justify-center mx-auto mb-3">
                <Bell size={20} className="text-text-light" />
              </div>
              <p className="text-sm text-text-secondary">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-section-alt ${
                    !n.read ? 'bg-accent/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-section-alt flex items-center justify-center flex-shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-text-primary truncate">{n.title}</p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-dental-blue flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-text-light mt-1.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(n.id, e)}
                      className="p-1 text-text-light hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
