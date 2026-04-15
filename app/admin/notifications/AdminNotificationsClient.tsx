"use client";

import { useState } from "react";

const PRIMARY = "#1e3a8a";

type Notification = {
  id: string; type: string; title: string; description: string;
  date: string; isRead: boolean;
  Employee: { firstName: string; lastName: string };
};
type Employee = { id: string; firstName: string; lastName: string };

const TYPES = ["ABSENCE", "RETARD", "REMARQUE", "ALERT"];
const typeColor: Record<string, string> = {
  ABSENCE: "#3b82f6", RETARD: "#f59e0b", REMARQUE: "#10b981", ALERT: "#ef4444",
};

export default function AdminNotificationsClient({
  notifications: initial,
  employees,
}: {
  notifications: Notification[];
  employees: Employee[];
}) {
  const [notifications, setNotifications] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "ALERT", title: "", description: "", employeeId: "" });
  const [sending, setSending] = useState(false);

  async function sendNotif() {
    if (!form.title || !form.description || !form.employeeId) return;
    setSending(true);
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const n = await res.json();
    setSending(false);
    if (res.ok) {
      const emp = employees.find((e) => e.id === form.employeeId);
      setNotifications([{ ...n, Employee: emp! }, ...notifications]);
      setForm({ type: "ALERT", title: "", description: "", employeeId: "" });
      setShowForm(false);
    }
  }

  async function deleteNotif(id: string) {
    await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#111827" }}>Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">{notifications.length} notification(s)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="text-sm font-bold text-white px-4 py-2.5 rounded-xl"
          style={{ backgroundColor: PRIMARY }}>
          + Envoyer une notification
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 max-w-lg">
          <h3 className="font-bold text-sm mb-4" style={{ color: "#111827" }}>Nouvelle notification</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">Destinataire</label>
              <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #e5e7eb", color: "#111827" }}>
                <option value="">Choisir...</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #e5e7eb", color: "#111827" }}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">Titre</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: "1px solid #e5e7eb", color: "#111827" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-gray-500">Message</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{ border: "1px solid #e5e7eb", color: "#111827" }} />
            </div>
            <button onClick={sendNotif} disabled={sending}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 w-fit"
              style={{ backgroundColor: PRIMARY }}>
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              {["Type", "Titre", "Employé", "Date", "Lu", "Action"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: (typeColor[n.type] ?? "#6b7280") + "20", color: typeColor[n.type] ?? "#6b7280" }}>
                    {n.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-semibold max-w-xs truncate" style={{ color: "#111827" }}>{n.title}</td>
                <td className="px-5 py-3.5 text-gray-600">{n.Employee.firstName} {n.Employee.lastName}</td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{new Date(n.date).toLocaleDateString("fr-FR")}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.isRead ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                    {n.isRead ? "Lu" : "Non lu"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => deleteNotif(n.id)} className="text-xs text-red-500 hover:underline font-semibold">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-400 py-10">Aucune notification</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
