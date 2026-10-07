import React, { useState, useRef } from 'react';
import {
  X,
  Building2,
  Download,
  Upload,
  RotateCcw,
  Check,
  Palette,
  FileCheck,
  ShieldAlert,
  Image as ImageIcon,
} from 'lucide-react';
import { BusinessProfile, AppState, ThemeId } from '../types';
import {
  exportAppStateJson,
  parseAndValidateImport,
  DEFAULT_LOGO,
} from '../services/storage';
import { THEME_OPTIONS } from '../utils/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  appState: AppState;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  onUpdateBusiness: (updated: BusinessProfile) => void;
  onRestoreState: (restored: Partial<AppState>) => void;
  onResetApp: () => void;
  onOpenAuth?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  business,
  appState,
  currentTheme,
  onSelectTheme,
  onUpdateBusiness,
  onRestoreState,
  onResetApp,
  onOpenAuth,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [profile, setProfile] = useState<BusinessProfile>(business);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBusiness(profile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleBackupDownload = () => {
    const jsonStr = exportAppStateJson(appState);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CollabQu_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseAndValidateImport(text);
        onRestoreState(parsed);
        setRestoreMessage('Data berhasil dipulihkan (Restore Sukses)!');
        setTimeout(() => setRestoreMessage(null), 3000);
      } catch (err: any) {
        alert(err.message || 'Gagal membaca file JSON backup.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b-2 border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-950">
                Pengaturan Usaha & Tema
              </h2>
              <p className="text-[11px] font-bold text-slate-600">
                Ganti tema tampilan, profil usaha & backup data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 text-xs">
          {/* AKUN GOOGLE TERHUBUNG */}
          {appState.user && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  {appState.user.avatar ? (
                    <img
                      src={appState.user.avatar}
                      alt={appState.user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    appState.user.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-slate-900 truncate block">
                    {appState.user.name}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 truncate block">
                    {appState.user.email}
                  </span>
                </div>
              </div>

              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-emerald-400 bg-white hover:bg-emerald-50 text-emerald-800 text-[11px] font-black shrink-0 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  Kelola Akun
                </button>
              )}
            </div>
          )}

          {/* SECTION 1: KARTU GANTI TEMA TAMPILAN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
                  <Palette className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
                    1. Pilih Tema Tampilan
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Ganti gaya warna sesuai kenyamanan mata & kondisi cahaya
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {THEME_OPTIONS.map((th) => {
                const isSelected = (currentTheme || 'bright') === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => onSelectTheme(th.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between h-28 shadow-xs cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-[1.02]'
                        : 'border-slate-300 hover:border-slate-400 opacity-90 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: th.previewCard }}
                  >
                    {/* Header: Color Swatches & Selected Badge */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                          style={{ backgroundColor: th.previewPrimary }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                          style={{ backgroundColor: th.previewBg }}
                        />
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    {/* Name & Desc */}
                    <div>
                      <h4
                        className="text-xs font-black leading-tight"
                        style={{ color: th.textColor }}
                      >
                        {th.name}
                      </h4>
                      <p
                        className="text-[10px] line-clamp-2 mt-0.5 opacity-80 font-bold"
                        style={{ color: th.textColor }}
                      >
                        {th.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: PROFIL USAHA */}
          <form onSubmit={handleProfileSubmit} className="space-y-3 pt-3 border-t-2 border-slate-200">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1.5">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
                2. Profil Usaha Titip Jual
              </h3>
              {saveSuccess && (
                <span className="text-xs font-black text-emerald-800 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Tersimpan
                </span>
              )}
            </div>

            {/* Logo Usaha & Tampilan Header */}
            <div className="p-3 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src={profile.logoUrl || DEFAULT_LOGO}
                    alt="Logo Usaha"
                    className="w-full h-full object-contain p-0.5"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    Logo Usaha (Kop Faktur)
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500">
                    Tampil pada cetak faktur & nota konsinyasi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <label className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-[11px] font-bold hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs">
                  Ganti
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setProfile((prev) => ({
                          ...prev,
                          logoUrl: (ev.target?.result as string) || DEFAULT_LOGO,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                {profile.logoUrl && profile.logoUrl !== DEFAULT_LOGO && (
                  <button
                    type="button"
                    onClick={() =>
                      setProfile((prev) => ({ ...prev, logoUrl: DEFAULT_LOGO }))
                    }
                    className="px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-bold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                Nama Usaha / Brand
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-emerald-700 outline-none text-slate-900 bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                  Nama Pemilik
                </label>
                <input
                  type="text"
                  value={profile.ownerName}
                  onChange={(e) =>
                    setProfile({ ...profile, ownerName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-emerald-700 outline-none text-slate-900 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-emerald-700 outline-none font-mono text-slate-900 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                Alamat Usaha / Workshop
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-emerald-700 outline-none text-slate-900 bg-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border-2 border-slate-300 space-y-2">
              <span className="text-[11px] font-black text-slate-900 uppercase block">
                Rekening Pembayaran (Tampil di Faktur)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nama Bank (e.g. BCA)"
                  value={profile.bankName}
                  onChange={(e) =>
                    setProfile({ ...profile, bankName: e.target.value })
                  }
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-slate-300 bg-white outline-none text-slate-900"
                />
                <input
                  type="text"
                  placeholder="No. Rekening"
                  value={profile.bankAccountNumber}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-slate-300 bg-white font-mono outline-none text-slate-900"
                />
              </div>
              <input
                type="text"
                placeholder="Atas Nama Pemilik Rekening"
                value={profile.bankAccountHolder}
                onChange={(e) =>
                  setProfile({ ...profile, bankAccountHolder: e.target.value })
                }
                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 border-slate-300 bg-white outline-none text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-black shadow-sm transition-colors"
            >
              Simpan Profil Usaha
            </button>
          </form>

          {/* SECTION 3: BACKUP & RESTORE */}
          <div className="space-y-3 pt-3 border-t-2 border-slate-200">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
              3. Backup & Restore Data
            </h3>
            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
              Ekspor seluruh data toko, produk, faktur, dan catatan ke file cadangan JSON untuk disimpan di Google Drive atau dipindahkan ke HP lain.
            </p>

            {restoreMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{restoreMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleBackupDownload}
                className="p-3.5 rounded-2xl border-2 border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50 text-slate-900 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-black text-center shadow-xs cursor-pointer"
              >
                <Download className="w-5 h-5 text-emerald-800 stroke-[2.5]" />
                <span>Backup Data (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 rounded-2xl border-2 border-slate-300 hover:border-blue-600 bg-slate-50 hover:bg-blue-50 text-slate-900 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-black text-center shadow-xs cursor-pointer"
              >
                <Upload className="w-5 h-5 text-blue-800 stroke-[2.5]" />
                <span>Restore Data</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileRestore}
                className="hidden"
              />
            </div>
          </div>

          {/* SECTION 4: RESET APLIKASI */}
          <div className="space-y-2 pt-3 border-t-2 border-slate-200">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-rose-800">
              4. Reset Aplikasi
            </h3>
            <p className="text-[11px] font-semibold text-slate-600">
              Kembalikan data ke pengaturan bawaan awal. Pastikan Anda sudah membuat backup jika ingin menyimpan catatan penting.
            </p>

            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 px-3 rounded-xl border-2 border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                Reset ke Data Awal
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-rose-950 font-black text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-700 stroke-[2.5]" />
                  Konfirmasi Reset Aplikasi?
                </div>
                <p className="text-[11px] font-bold text-rose-800">
                  Tindakan ini akan mengosongkan perubahan lokal Anda dan mengembalikan sampel data awal.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-lg border-2 border-slate-300 bg-white text-slate-800 text-xs font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetApp();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="flex-1 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-black"
                  >
                    Ya, Reset Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t-2 border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-black transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
