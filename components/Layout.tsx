
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListTodo, 
  Settings, 
  Phone, 
  MapPin, 
  Store 
} from 'lucide-react';
import { MAA_TELECOM } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-repair', label: 'New Repair', icon: PlusCircle },
    { id: 'repair-list', label: 'All Repairs', icon: ListTodo },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-indigo-900 text-white flex-shrink-0 no-print">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-lg">
              <Store className="w-6 h-6 text-indigo-900" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight">Maa Telecom</h1>
              <p className="text-xs text-indigo-300">Repair POS Pro</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-white/10 text-white font-medium border-l-4 border-white' 
                    : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-indigo-800 hidden md:block">
          <div className="text-xs text-indigo-300 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span>{MAA_TELECOM.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" />
              <span>{MAA_TELECOM.phone}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 no-print flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-medium text-slate-900">Admin Panel</p>
               <p className="text-xs text-slate-500">Maa Telecom, Bogura</p>
             </div>
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
               M
             </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
