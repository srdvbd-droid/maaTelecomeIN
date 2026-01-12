
import React, { useState } from 'react';
import { RepairJob, RepairStatus, Part } from '../types';
import { COMMON_PARTS } from '../constants';
import { getDiagnosticSuggestion } from '../services/geminiService';
import { Sparkles, Save, User, Smartphone, AlertCircle, Wrench, Loader2 } from 'lucide-react';

interface RepairFormProps {
  onSave: (repair: Omit<RepairJob, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: RepairJob;
}

const RepairForm: React.FC<RepairFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    customerPhone: initialData?.customerPhone || '',
    deviceModel: initialData?.deviceModel || '',
    imei: initialData?.imei || '',
    issueDescription: initialData?.issueDescription || '',
    estimatedCost: initialData?.estimatedCost || 0,
    advancePaid: initialData?.advancePaid || 0,
    laborCharge: initialData?.laborCharge || 0,
    status: initialData?.status || RepairStatus.PENDING,
    notes: initialData?.notes || '',
  });

  const [selectedParts, setSelectedParts] = useState<Part[]>(initialData?.partsUsed || []);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDiagnostic, setAiDiagnostic] = useState(initialData?.aiDiagnostic || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePart = (part: Part) => {
    if (selectedParts.find(p => p.id === part.id)) {
      setSelectedParts(prev => prev.filter(p => p.id !== part.id));
    } else {
      setSelectedParts(prev => [...prev, part]);
    }
  };

  const handleAiAnalyze = async () => {
    if (!formData.issueDescription || !formData.deviceModel) {
      alert("Please enter Device Model and Issue Description first.");
      return;
    }
    setIsAnalyzing(true);
    const suggestion = await getDiagnosticSuggestion(formData.issueDescription, formData.deviceModel);
    setAiDiagnostic(suggestion);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      partsUsed: selectedParts,
      aiDiagnostic,
      estimatedCost: Number(formData.estimatedCost),
      advancePaid: Number(formData.advancePaid),
      laborCharge: Number(formData.laborCharge),
    });
  };

  const totalPartsCost = selectedParts.reduce((sum, p) => sum + p.price, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-800">Customer & Device Information</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Customer Name *</label>
            <input
              type="text"
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Rahul Hasan"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Phone Number *</label>
            <input
              type="tel"
              name="customerPhone"
              required
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="017xxxxxxxx"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Device Model *</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="deviceModel"
                required
                value={formData.deviceModel}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. iPhone 13 / Samsung S22"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">IMEI (Optional)</label>
            <input
              type="text"
              name="imei"
              value={formData.imei}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="15-digit IMEI"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800">Diagnosis & Issues</h3>
          </div>
          <button
            type="button"
            onClick={handleAiAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors text-sm font-medium border border-indigo-100 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI Diagnostic
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Issue Description *</label>
            <textarea
              name="issueDescription"
              required
              value={formData.issueDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Describe the problem..."
            />
          </div>

          {aiDiagnostic && (
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Gemini Suggestions</span>
              </div>
              <div className="text-sm text-indigo-900 whitespace-pre-wrap leading-relaxed">
                {aiDiagnostic}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800">Parts & Labor</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium text-slate-700 mb-1">Quick Select Common Parts</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_PARTS.map(part => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => togglePart(part)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedParts.find(p => p.id === part.id)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {part.name} (৳{part.price})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Labor/Service Charge (৳)</label>
              <input
                type="number"
                name="laborCharge"
                value={formData.laborCharge}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Financials & Status</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Object.values(RepairStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Advance Paid (৳)</label>
                <input
                  type="number"
                  name="advancePaid"
                  value={formData.advancePaid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Parts Total:</span>
                <span>৳{totalPartsCost}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Labor Charge:</span>
                <span>৳{formData.laborCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-200">
                <span>Estimated Total:</span>
                <span>৳{Number(totalPartsCost) + Number(formData.laborCharge)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Repair & Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RepairForm;
