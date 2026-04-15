"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  Bell,
  MoreVertical,
} from "lucide-react";

const PRIMARY = "#1e3a8a";

type Notification = {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
};

const typeConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  ABSENCE: { label: "ABSENCE", color: "#3b82f6", bg: "#eff6ff", icon: Calendar },
  RETARD: { label: "RETARD", color: "#f59e0b", bg: "#fffbeb", icon: Clock },
  REMARQUE: { label: "REMARQUE", color: "#10b981", bg: "#ecfdf5", icon: CheckCircle },
  ALERT: { label: "ALERT", color: "#ef4444", bg: "#fef2f2", icon: Bell },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = now - date.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Aujourd'hui, " + date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (h < 24) return "Aujourd'hui, " + date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (h < 48) return "Hier, " + date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) +
    ", " +
    date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      });
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications/mark-all-read", { method: "POST" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/mark-read`, { method: "POST" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1
            className="text-3xl font-extrabold"
            style={{ color: "#111827" }}
          >
            Centre de Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Restez informé de votre situation administrative.
          </p>
        </div>
        <div className="flex gap-3 mt-1">
          <button
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border"
            style={{ borderColor: "#d1d5db", color: "#374151" }}
          >
            ⬦ FILTRER
          </button>
          <button
            onClick={markAllRead}
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            TOUT MARQUER COMME LU
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 max-w-3xl">
        {loading && (
          <p className="text-gray-400 text-sm text-center py-10">Chargement...</p>
        )}
        {!loading && notifications.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-10">
            Aucune notification
          </p>
        )}
        {notifications.map((n) => {
          const cfg = typeConfig[n.type] ?? typeConfig.ALERT;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className="bg-white rounded-2xl p-5 shadow-sm flex gap-4 items-start"
              style={
                !n.isRead
                  ? { borderLeft: `4px solid ${PRIMARY}` }
                  : { borderLeft: "4px solid transparent" }
              }
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cfg.bg }}
              >
                <Icon size={20} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-bold text-sm"
                    style={{ color: "#111827" }}
                  >
                    {n.title}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatDate(n.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{n.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
                    style={{
                      backgroundColor: cfg.bg,
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </span>
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: PRIMARY }}
                    >
                      MARQUER COMME LU
                    </button>
                  )}
                </div>
              </div>
              <button className="p-1 hover:bg-gray-50 rounded-lg">
                <MoreVertical size={16} style={{ color: "#9ca3af" }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
