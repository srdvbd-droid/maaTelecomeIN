
import React from 'react';
import { RepairJob, RepairStatus } from '../types';
import { MAA_TELECOM } from '../constants';
import { Printer, Download, Store, MapPin, Phone, User, Calendar } from 'lucide-react';

interface InvoiceProps {
  repair: RepairJob;
}

const Invoice: React.FC<InvoiceProps> = ({ repair }) => {
  const handlePrint = () => {
    window.print();
  };

  const totalCost = (repair.partsUsed?.reduce((sum, p) => sum + p.price, 0) || 0) + (repair.laborCharge || 0);
  const dueAmount = totalCost - (repair.advancePaid || 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="no-print flex justify-end gap-3 mb-6">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl">
              <Store className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{MAA_TELECOM.name}</h1>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Mobile Repair Service</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">INVOICE</p>
            <p className="text-sm text-indigo-600 font-mono font-bold">#{repair.invoiceNumber}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Service Provider</h4>
            <div className="space-y-1">
              <p className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-3 h-3 text-indigo-600" />
                {MAA_TELECOM.address}
              </p>
              <p className="text-sm font-semibold flex items-center gap-2">
                <Phone className="w-3 h-3 text-indigo-600" />
                {MAA_TELECOM.phone}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Customer Details</h4>
            <div className="space-y-1">
              <p className="text-sm font-bold flex items-center gap-2">
                <User className="w-3 h-3 text-indigo-600" />
                {repair.customerName}
              </p>
              <p className="text-sm flex items-center gap-2">
                <Phone className="w-3 h-3 text-indigo-600" />
                {repair.customerPhone}
              </p>
              <p className="text-sm flex items-center gap-2">
                <Calendar className="w-3 h-3 text-indigo-600" />
                {new Date(repair.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Repair Subject</h4>
          <div className="flex justify-between">
            <p className="text-md font-bold text-slate-900">{repair.deviceModel}</p>
            {repair.imei && <p className="text-sm font-mono text-slate-500">IMEI: {repair.imei}</p>}
          </div>
          <p className="text-sm text-slate-600 mt-2 italic">Issue: {repair.issueDescription}</p>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase">Description</th>
              <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {repair.partsUsed.map((part, idx) => (
              <tr key={idx}>
                <td className="py-4 text-sm font-medium text-slate-700">{part.name}</td>
                <td className="py-4 text-sm font-bold text-right text-slate-900">৳{part.price}</td>
              </tr>
            ))}
            <tr>
              <td className="py-4 text-sm font-medium text-slate-700">Labor/Service Charge</td>
              <td className="py-4 text-sm font-bold text-right text-slate-900">৳{repair.laborCharge}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-1/2 space-y-2 border-t border-slate-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-bold">৳{totalCost}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Advance Paid:</span>
              <span className="text-emerald-600 font-bold">-৳{repair.advancePaid}</span>
            </div>
            <div className="flex justify-between text-lg font-black pt-2 border-t border-slate-200">
              <span className="text-slate-900">Grand Total:</span>
              <span className="text-indigo-600 font-mono">৳{dueAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-slate-100">
          <p className="text-sm font-bold text-slate-900 mb-1">Thank you for choosing Maa Telecom!</p>
          <p className="text-xs text-slate-500">Please keep this invoice for warranty (if applicable).</p>
          <div className="mt-8 grid grid-cols-2 gap-20">
            <div className="border-t border-slate-300 pt-2">
              <p className="text-[10px] text-slate-400 uppercase">Customer Signature</p>
            </div>
            <div className="border-t border-slate-300 pt-2">
              <p className="text-[10px] text-slate-400 uppercase">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
