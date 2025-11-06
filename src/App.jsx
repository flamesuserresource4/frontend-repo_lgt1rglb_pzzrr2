import React, { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import LeaveForm from './components/LeaveForm.jsx';
import LeaveTable from './components/LeaveTable.jsx';
import Filters from './components/Filters.jsx';

const ROLE = {
  SUPER_ADMIN: 0,
  TEAM_LEAD: 1,
  PROJECT_LEAD: 2,
  MEMBER: 3,
};
const roleLabel = ["Super Admin", "Team Lead", "Project Lead", "Member"];

const initialUsers = [
  { id: 'u1', name: 'Ava Collins', role: ROLE.SUPER_ADMIN, balance: 12 },
  { id: 'u2', name: 'Liam Patel', role: ROLE.TEAM_LEAD, balance: 12 },
  { id: 'u3', name: 'Noah Kim', role: ROLE.PROJECT_LEAD, balance: 12 },
  { id: 'u4', name: 'Mia Chen', role: ROLE.MEMBER, managerId: 'u2', projectLeadId: 'u3', balance: 12 },
  { id: 'u5', name: 'Ethan Ross', role: ROLE.MEMBER, managerId: 'u2', projectLeadId: 'u3', balance: 12 },
];

export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUserId, setCurrentUserId] = useState('u1');
  const currentUser = users.find((u) => u.id === currentUserId);

  const [requests, setRequests] = useState([]);
  const [holidays, setHolidays] = useState([
    { id: 'h1', date: '2025-01-01', name: 'New Year Holiday' },
    { id: 'h2', date: '2025-01-26', name: 'Republic Day' },
  ]);

  const [filters, setFilters] = useState({ status: '', from: '', to: '', employee: '' });

  const viewableRequests = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === ROLE.SUPER_ADMIN) return requests;

    if (currentUser.role === ROLE.TEAM_LEAD) {
      const teamMemberIds = users.filter((u) => u.managerId === currentUser.id).map((u) => u.id);
      return requests.filter((r) => r.userId === currentUser.id || teamMemberIds.includes(r.userId));
    }

    if (currentUser.role === ROLE.PROJECT_LEAD) {
      const projMemberIds = users.filter((u) => u.projectLeadId === currentUser.id).map((u) => u.id);
      return requests.filter((r) => r.userId === currentUser.id || projMemberIds.includes(r.userId));
    }

    return requests.filter((r) => r.userId === currentUser.id);
  }, [currentUser, requests, users]);

  const filteredRequests = useMemo(() => {
    return viewableRequests.filter((r) => {
      const matchStatus = !filters.status || r.status === filters.status;
      const matchFrom = !filters.from || r.start >= filters.from;
      const matchTo = !filters.to || r.end <= filters.to;
      const matchEmp = !filters.employee || r.employeeName.toLowerCase().includes(filters.employee.toLowerCase());
      return matchStatus && matchFrom && matchTo && matchEmp;
    });
  }, [viewableRequests, filters]);

  const canApprove = currentUser && (currentUser.role === ROLE.SUPER_ADMIN || currentUser.role === ROLE.TEAM_LEAD || currentUser.role === ROLE.PROJECT_LEAD);

  const handleSubmitRequest = (payload) => {
    if (!payload.start || !payload.end || !payload.days) return;
    const id = `r_${Date.now()}`;
    const me = currentUser;
    const newReq = {
      id,
      userId: me.id,
      employeeName: me.name,
      role: roleLabel[me.role],
      start: payload.start,
      end: payload.end,
      type: payload.type,
      reason: payload.reason,
      days: payload.days,
      lop: payload.lop || false,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [newReq, ...prev]);
  };

  const updateBalance = (userId, days, isLop) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      const deduction = isLop ? Math.max(0, Math.min(u.balance, days)) : Math.min(u.balance, days);
      return { ...u, balance: Math.max(0, u.balance - deduction) };
    }));
  };

  const onApprove = (id) => {
    setRequests((prev) => prev.map((r) => {
      if (r.id !== id || r.status !== 'Pending') return r;
      updateBalance(r.userId, r.days, r.lop);
      return { ...r, status: 'Approved' };
    }));
  };

  const onReject = (id) => {
    setRequests((prev) => prev.map((r) => (r.id === id && r.status === 'Pending' ? { ...r, status: 'Rejected' } : r)));
  };

  const setYearlyQuota = (days) => {
    setUsers((prev) => prev.map((u) => ({ ...u, balance: days })));
  };

  const addHoliday = (date, name) => {
    if (!date || !name) return;
    setHolidays((h) => [{ id: `h_${Date.now()}`, date, name }, ...h]);
  };

  const removeHoliday = (id) => setHolidays((h) => h.filter((x) => x.id !== id));

  const myBalance = users.find((u) => u.id === currentUserId)?.balance ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 text-slate-900">
      <div className="flex">
        <Sidebar currentUserId={currentUserId} users={users} onChangeUser={setCurrentUserId} />

        <main className="flex-1 p-6 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">🚀 Leave Management</h1>
              <p className="text-sm text-slate-600">Signed in as {currentUser?.name} · {currentUser ? roleLabel[currentUser.role] : ''}</p>
            </div>
            {currentUser?.role === ROLE.SUPER_ADMIN && (
              <div className="flex items-center gap-2">
                <button onClick={() => setYearlyQuota(12)} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">Reset Yearly Balance (12)</button>
              </div>
            )}
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 bg-white/80 backdrop-blur rounded-xl border border-slate-200 shadow-sm">
              <LeaveForm onSubmit={handleSubmitRequest} balance={myBalance} roleLabel={currentUser ? roleLabel[currentUser.role] : ''} />
            </div>

            <div className="p-5 bg-white/80 backdrop-blur rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="font-semibold">Quick Stats</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <div className="text-xs text-slate-500">Balance</div>
                  <div className="text-xl font-semibold">{myBalance}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <div className="text-xs text-slate-500">Pending</div>
                  <div className="text-xl font-semibold">{requests.filter(r=>r.userId===currentUserId && r.status==='Pending').length}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <div className="text-xs text-slate-500">Approved</div>
                  <div className="text-xl font-semibold">{requests.filter(r=>r.userId===currentUserId && r.status==='Approved').length}</div>
                </div>
              </div>

              {currentUser?.role === ROLE.SUPER_ADMIN && (
                <div className="space-y-3">
                  <div className="font-semibold">Company Holidays</div>
                  <HolidayManager holidays={holidays} onAdd={addHoliday} onRemove={removeHoliday} />
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <Filters filters={filters} setFilters={setFilters} />
            <LeaveTable
              requests={filteredRequests}
              canApprove={!!canApprove}
              onApprove={onApprove}
              onReject={onReject}
              showEmployee={currentUser ? currentUser.role !== ROLE.MEMBER : false}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

function HolidayManager({ holidays, onAdd, onRemove }) {
  const [form, setForm] = useState({ date: '', name: '' });
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} className="rounded-md border-slate-300 text-sm flex-1" />
        <input type="text" placeholder="Holiday name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="rounded-md border-slate-300 text-sm flex-[2]" />
        <button onClick={()=>{ onAdd(form.date, form.name); setForm({date:'', name:''}); }} className="px-3 rounded-md bg-indigo-600 text-white text-sm">Add</button>
      </div>
      <ul className="divide-y border rounded-md bg-slate-50">
        {holidays.map(h => (
          <li key={h.id} className="flex items-center justify-between px-3 py-2 text-sm">
            <span>{h.date} — {h.name}</span>
            <button onClick={()=>onRemove(h.id)} className="text-rose-600 hover:underline">Remove</button>
          </li>
        ))}
        {holidays.length===0 && <li className="px-3 py-2 text-sm text-slate-500">No holidays added</li>}
      </ul>
    </div>
  );
}
