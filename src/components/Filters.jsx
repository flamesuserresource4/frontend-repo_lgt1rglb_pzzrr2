import React from 'react';
import { Filter } from 'lucide-react';

export default function Filters({ filters, setFilters }) {
  const handle = (e) => setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="flex flex-wrap items-end gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex items-center gap-2 text-slate-700 font-medium"><Filter size={16}/> Filters</div>
      <label className="text-xs">
        <div className="mb-1 text-slate-500">Status</div>
        <select name="status" value={filters.status} onChange={handle} className="rounded-md border-slate-300 text-sm">
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </label>
      <label className="text-xs">
        <div className="mb-1 text-slate-500">From</div>
        <input type="date" name="from" value={filters.from} onChange={handle} className="rounded-md border-slate-300 text-sm" />
      </label>
      <label className="text-xs">
        <div className="mb-1 text-slate-500">To</div>
        <input type="date" name="to" value={filters.to} onChange={handle} className="rounded-md border-slate-300 text-sm" />
      </label>
      <label className="text-xs">
        <div className="mb-1 text-slate-500">Employee</div>
        <input type="text" name="employee" value={filters.employee} onChange={handle} placeholder="Search name" className="rounded-md border-slate-300 text-sm" />
      </label>
    </div>
  );
}
