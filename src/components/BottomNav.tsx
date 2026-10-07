import React from 'react';
import {
  LayoutDashboard,
  Store as StoreIcon,
  Boxes,
  TrendingUp,
  BarChart3,
  Settings,
} from 'lucide-react';
import { AppState } from '../types';

interface BottomNavProps {
  activeTab: AppState['activeTab'];
  onChangeTab: (tab: AppState['activeTab']) => void;
  storeCount: number;
  onOpenSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  storeCount,
  onOpenSettings,
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Beranda',
      icon: LayoutDashboard,
    },
    {
      id: 'stores' as const,
      label: 'Toko',
      icon: StoreIcon,
      badge: storeCount > 0 ? storeCount : undefined,
    },
    {
      id: 'inventory' as const,
      label: 'Stok',
      icon: Boxes,
    },
    {
      id: 'marketing' as const,
      label: 'Marketing',
      icon: TrendingUp,
    },
    {
      id: 'reports' as const,
      label: 'Laporan',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-300 shadow-xl no-print max-w-3xl mx-auto pb-safe">
      <div className="grid grid-cols-6 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative transition-all duration-150 select-none cursor-pointer ${
                isActive ? 'text-emerald-950' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.8] text-emerald-800' : 'stroke-[2.2]'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-800 text-white text-[9px] font-black px-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-1 tracking-tight whitespace-nowrap truncate max-w-[54px] sm:max-w-[62px] ${
                  isActive ? 'font-black text-emerald-950' : 'font-bold text-slate-700'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-5 h-1 bg-emerald-800 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Tombol Pengaturan - Berada tepat di samping Laporan */}
        <button
          onClick={onOpenSettings}
          className="min-h-[48px] flex flex-col items-center justify-center relative transition-all duration-150 select-none text-slate-700 hover:text-slate-950 active:scale-95 cursor-pointer"
          title="Buka Pengaturan & Backup"
        >
          <div className="relative">
            <Settings className="w-5 h-5 stroke-[2.2] text-slate-700 hover:rotate-45 transition-transform duration-200" />
          </div>
          <span className="text-[10px] sm:text-[11px] mt-1 tracking-tight whitespace-nowrap truncate max-w-[54px] sm:max-w-[62px] font-bold text-slate-700">
            Pengaturan
          </span>
        </button>
      </div>
    </nav>
  );
};
