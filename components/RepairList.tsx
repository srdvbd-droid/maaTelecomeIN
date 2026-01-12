
import React, { useState } from 'react';
import { RepairJob, RepairStatus } from '../types';
import { Search, Eye, Edit3, Trash2, Smartphone, User, MoreVertical } from 'lucide-react';

interface RepairListProps {
  repairs: RepairJob[];
  onView: (repair: RepairJob) => void;
  onDelete: (id: string) => void;
}

const RepairList: React.FC<RepairListProps> = ({ repairs, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRepairs = repairs.filter(r => 
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customerPhone.includes(searchTerm) ||
    r.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.deviceModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm text-slate-500">Showing {filteredRepairs.length} repairs</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase">Invoice</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase">Customer</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase">Device</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
              <th className="text-center px-6 py-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRepairs.map((repair) => (
              <tr key={repair.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {repair.invoiceNumber}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(repair.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{repair.customerName}</p>
                      <p className="text-xs text-slate-500">{repair.customerPhone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{repair.deviceModel}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[120px]">{repair.issueDescription}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    repair.status === RepairStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    repair.status === RepairStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    repair.status === RepairStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {repair.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="text-sm font-bold text-slate-900">৳{repair.estimatedCost + repair.laborCharge + repair.partsUsed.reduce((s, p) => s + p.price, 0)}</p>
                  <p className="text-xs text-emerald-600">Paid: ৳{repair.advancePaid}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onView(repair)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(repair.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRepairs.length === 0 && (
          <div className="py-20 text-center">
            <Smartphone className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No matching repair jobs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairList;
