import React from 'react';
import { UserProfile, BusinessProfile } from '../types';
import { Plus } from 'lucide-react';

interface HeaderProps {
  business: BusinessProfile;
  user?: UserProfile | null;
  onOpenStoreRegistration: () => void;
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  business,
  onOpenStoreRegistration,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-slate-200 shadow-xs px-4 py-3 flex items-center justify-between no-print">
      {/* Profil Usaha dari Pengaturan - Bersih Tanpa Logo Profil */}
      <div
        onClick={onOpenSettings}
        className="flex flex-col min-w-0 cursor-pointer group pr-2"
        title="Klik untuk ubah profil usaha di Pengaturan"
      >
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight truncate group-hover:text-emerald-700 transition-colors">
            {business.name || 'Berkah Snack Mandiri'}
          </h1>
          <span className="text-[10px] font-black bg-emerald-800 text-white px-1.5 py-0.5 rounded shadow-2xs font-mono tracking-wide shrink-0">
            PRO
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-600 truncate leading-snug mt-0.5">
          {business.ownerName ? `${business.ownerName}` : 'Pemilik Usaha'}
          {business.phone ? ` • ${business.phone}` : ''}
        </p>
      </div>

      {/* Action Zone: Tombol Hijau (+) Tambah Toko Baru */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenStoreRegistration}
          aria-label="Tambah Toko Baru"
          title="Tambah Toko Baru (+)"
          className="h-10 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-950 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 active:scale-95 hover:scale-102 transition-all cursor-pointer border border-emerald-600"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span className="text-xs font-black tracking-wide hidden sm:inline">
            Toko Baru
          </span>
        </button>
      </div>
    </header>
  );
};
