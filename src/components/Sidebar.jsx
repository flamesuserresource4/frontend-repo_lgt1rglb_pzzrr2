import React from 'react';
import { Home, CalendarDays, Users, Settings } from 'lucide-react';

const roles = ["Super Admin", "Team Lead", "Project Lead", "Member"];

export default function Sidebar({ currentUserId, users, onChangeUser }) {
  return (
    <aside className="w-72 bg-white/70 backdrop-blur border-r border-slate-200 h-screen sticky top-0 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-indigo-600 text-white grid place-items-center font-bold">LM</div>
        <div>
          <div className="text-slate-900 font-semibold">CRM Leave</div>
          <div className="text-xs text-slate-500">Management Module</div>
        </div>
      </div>

      <nav className="space-y-1 text-sm">
        <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 cursor-default">
          <Home size={18} /> Dashboard
        </a>
        <a className="flex items-center gap-3 px-3 py-2 rounded-md bg-indigo-50 text-indigo-700">
          <CalendarDays size={18} /> Leave Management
        </a>
        <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 cursor-default">
          <Users size={18} /> Teams
        </a>
        <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 cursor-default">
          <Settings size={18} /> Settings
        </a>
      </nav>

      <div className="mt-6 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Switch User (demo)</div>
        <select
          className="w-full rounded-md border-slate-300 text-sm"
          value={currentUserId}
          onChange={(e) => onChangeUser(e.target.value)}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — {roles[u.role]}
            </option>
          ))}
        </select>
        <div className="text-[11px] text-slate-500 mt-2 leading-snug">
          Use this to preview permissions for each role.
        </div>
      </div>

      <div className="mt-auto text-[11px] text-slate-400">
        Built with React + Tailwind
      </div>
    </aside>
  );
}
