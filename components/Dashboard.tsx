
import React from 'react';
import { RepairJob, RepairStatus } from '../types';
// Fix: Added missing Store icon to imports from lucide-react
import { TrendingUp, Clock, CheckCircle, Package, ReceiptText, Store } from 'lucide-react';

interface DashboardProps {
  repairs: RepairJob[];
}

const Dashboard: React.FC<DashboardProps> = ({ repairs }) => {
  const stats = [
    {
      label: 'Total Repairs',
      value: repairs.length,
      icon: ReceiptText,
      color: 'bg-blue-500',
    },
    {
      label: 'Pending',
      value: repairs.filter(r => r.status === RepairStatus.PENDING).length,
      icon: Clock,
      color: 'bg-amber-500',
    },
    {
      label: 'Completed',
      value: repairs.filter(r => r.status === RepairStatus.COMPLETED || r.status === RepairStatus.DELIVERED).length,
      icon: CheckCircle,
      color: 'bg-emerald-500',
    },
    {
      label: 'Revenue Today',
      value: repairs
        .filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString())
        .reduce((sum, r) => sum + (r.estimatedCost || 0), 0),
      icon: TrendingUp,
      color: 'bg-indigo-500',
      isCurrency: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-900">
                  {stat.isCurrency ? '৳' : ''}{stat.value}
                </h3>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-semibold mb-6">Recent Activities</h4>
          <div className="space-y-4">
            {repairs.slice(0, 5).map((repair) => (
              <div key={repair.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{repair.deviceModel}</p>
                    <p className="text-xs text-slate-500">{repair.customerName} • {repair.invoiceNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    repair.status === RepairStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                    repair.status === RepairStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {repair.status}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{new Date(repair.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {repairs.length === 0 && <p className="text-center text-slate-400 py-8">No repair jobs recorded yet.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
           <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Store className="w-8 h-8 text-indigo-600" />
           </div>
           <h4 className="text-xl font-bold text-slate-800">Maa Telecom POS</h4>
           <p className="text-slate-500 max-w-xs mt-2">
             Efficiently manage your mobile repair shop operations in Runner Plaza, Bogura.
           </p>
           <button 
             onClick={() => window.location.hash = '#new-repair'}
             className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 font-medium"
           >
             Start New Repair
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
