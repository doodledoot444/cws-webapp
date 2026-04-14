'use client';

import { useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { AppNotification } from '@/types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface NotificationBellProps {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationBell({
  notifications,
  unreadCount,
  onMarkAsRead,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const recent = useMemo(() => notifications.slice(0, 10), [notifications]);

  return (
    <div className="relative">
      <motion.button
        type="button"
        aria-label="Open notifications"
        onClick={() => setOpen((value) => !value)}
        className="icon-chip-muted relative w-10 h-10 rounded-xl hover:text-primary flex items-center justify-center"
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-elevated border border-default shadow-[0_20px_44px_rgba(0,0,0,0.45)] rounded-2xl p-3 z-50 backdrop-blur-xl"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-sm font-semibold text-primary">Notifications</p>
              <span className="text-xs text-secondary">{unreadCount} unread</span>
            </div>

            {recent.length === 0 ? (
              <p className="text-xs text-secondary px-2 py-6 text-center">No notifications yet.</p>
            ) : (
              <div className="max-h-72 overflow-auto pr-1 flex flex-col gap-2">
                {recent.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03, ease: 'easeOut' }}
                    className={`rounded-xl border p-3 ${
                      notification.isRead
                        ? 'border-default bg-surface'
                        : 'border-info/40 bg-info/10'
                    }`}
                  >
                    <p className="text-sm text-primary">{notification.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[11px] text-secondary">{formatWhen(notification.createdAt)}</p>
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-[11px] text-primary font-semibold hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
