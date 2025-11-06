import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calendar, Send } from 'lucide-react';

const LEAVE_TYPES = [
  { value: 'casual', label: 'Casual' },
  { value: 'sick', label: 'Sick' },
  { value: 'other', label: 'Other' },
];

export default function LeaveForm({ onSubmit, balance, roleLabel }) {
  const [form, setForm] = useState({
    start: '',
    end: '',
    type: 'casual',
    reason: '',
  });
  const [showLopWarn, setShowLopWarn] = useState(false);

  const daysRequested = useMemo(() => {
    if (!form.start || !form.end) return 0;
    const s = new Date(form.start);
    const e = new Date(form.end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return isNaN(diff) || diff < 0 ? 0 : diff;
  }, [form.start, form.end]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // LOP logic: allow submit but mark lop if exceeding available by > 1 day in a month
    const willBeLop = daysRequested > balance + 1;
    setShowLopWarn(willBeLop);
    onSubmit({ ...form, days: daysRequested, lop: willBeLop });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-slate-900 font-semibold">Raise Leave Request</div>
        <div className="text-xs text-slate-500">Remaining Balance: <span className="font-semibold text-slate-700">{balance} days</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          <div className="mb-1 text-slate-600 flex items-center gap-2"><Calendar size={16}/> Start Date</div>
          <input type="date" name="start" value={form.start} onChange={handleChange} required className="w-full rounded-md border-slate-300" />
        </label>
        <label className="text-sm">
          <div className="mb-1 text-slate-600 flex items-center gap-2"><Calendar size={16}/> End Date</div>
          <input type="date" name="end" value={form.end} onChange={handleChange} required className="w-full rounded-md border-slate-300" />
        </label>
        <label className="text-sm">
          <div className="mb-1 text-slate-600">Leave Type</div>
          <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-md border-slate-300">
            {LEAVE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          <div className="mb-1 text-slate-600">Reason</div>
          <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Add context for your manager..." className="w-full rounded-md border-slate-300" />
        </label>
      </div>
      {showLopWarn && (
        <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
          <AlertTriangle className="mt-0.5" size={18} />
          <div>
            <div className="font-medium">You are exceeding your available leave limit.</div>
            <div className="text-sm">This will be considered as Loss of Pay (LOP).</div>
          </div>
        </div>
      )}
      <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
        <Send size={16}/> Submit Request ({daysRequested} day{daysRequested === 1 ? '' : 's'})
      </button>
    </form>
  );
}
