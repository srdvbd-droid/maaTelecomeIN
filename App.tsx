
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RepairForm from './components/RepairForm';
import RepairList from './components/RepairList';
import Invoice from './components/Invoice';
import { RepairJob, RepairStatus } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [repairs, setRepairs] = useState<RepairJob[]>([]);
  const [selectedRepair, setSelectedRepair] = useState<RepairJob | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedRepairs = localStorage.getItem('maa_telecom_repairs');
    if (savedRepairs) {
      try {
        setRepairs(JSON.parse(savedRepairs));
      } catch (e) {
        console.error("Failed to parse repairs", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('maa_telecom_repairs', JSON.stringify(repairs));
  }, [repairs]);

  // Handle URL Hash for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'new-repair', 'repair-list', 'invoice'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addRepair = (data: Omit<RepairJob, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    const newRepair: RepairJob = {
      ...data,
      id: Date.now().toString(),
      invoiceNumber: `MAA-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRepairs(prev => [newRepair, ...prev]);
    setSelectedRepair(newRepair);
    window.location.hash = '#invoice';
  };

  const deleteRepair = (id: string) => {
    if (confirm("Are you sure you want to delete this repair record?")) {
      setRepairs(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleViewRepair = (repair: RepairJob) => {
    setSelectedRepair(repair);
    window.location.hash = '#invoice';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard repairs={repairs} />;
      case 'new-repair':
        return <RepairForm onSave={addRepair} />;
      case 'repair-list':
        return <RepairList repairs={repairs} onView={handleViewRepair} onDelete={deleteRepair} />;
      case 'invoice':
        return selectedRepair ? (
          <Invoice repair={selectedRepair} />
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
            <p className="text-slate-500">No invoice selected. Please go to Repair List.</p>
            <button 
              onClick={() => setActiveTab('repair-list')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              View Repairs
            </button>
          </div>
        );
      default:
        return <Dashboard repairs={repairs} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => window.location.hash = tab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
