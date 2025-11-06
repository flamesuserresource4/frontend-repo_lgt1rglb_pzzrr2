import React from 'react';
import { CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

const statusPill = (status) => {
  const map = {
    Pending: 'bg-slate-100 text-slate-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-rose-100 text-rose-700',
  };
  return map[status] || map.Pending;
};

export default function LeaveTable({ requests, canApprove, onApprove, onReject, showEmployee }) {
  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {showEmployee && <th className="text-left px-4 py-2">Employee</th>}
            <th className="text-left px-4 py-2">Role</th>
            <th className="text-left px-4 py-2">From</th>
            <th className="text-left px-4 py-2">To</th>
            <th className="text-left px-4 py-2">Type</th>
            <th className="text-left px-4 py-2">Days</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">LOP</th>
            {canApprove && <th className="text-left px-4 py-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr>
              <td colSpan={canApprove ? (showEmployee ? 9 : 8) : (showEmployee ? 8 : 7)} className="px-4 py-6 text-center text-slate-500">
                No leave records found.
              </td>
            </tr>
          )}
          {requests.map((r) => (
            <tr key={r.id} className="border-t border-slate-100">
              {showEmployee && <td className="px-4 py-2">{r.employeeName}</td>}
              <td className="px-4 py-2">{r.role}</td>
              <td className="px-4 py-2">{r.start}</td>
              <td className="px-4 py-2">{r.end}</td>
              <td className="px-4 py-2 capitalize">{r.type}</td>
              <td className="px-4 py-2">{r.days}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs ${statusPill(r.status)}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-4 py-2">{r.lop ? 'Yes' : 'No'}</td>
              {canApprove && (
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onApprove(r.id)}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                      disabled={r.status !== 'Pending'}
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button
                      onClick={() => onReject(r.id)}
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700"
                      disabled={r.status !== 'Pending'}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
