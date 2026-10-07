import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DEFAULT_LOGO } from '../services/storage';
import { X, CheckCircle2, LogOut, ShieldCheck, Mail, User, ArrowRight } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleInstantGoogleLogin = (email: string, name: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const updated: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name,
        email,
        avatar: `https://lh3.googleusercontent.com/a/default-user=s96-c`,
        role: 'owner',
        lastLogin: new Date().toISOString(),
      };
      onLogin(updated);
      setIsLoading(false);
      setIsSwitching(false);
      onClose();
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    handleInstantGoogleLogin(customEmail, customName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border-2 border-slate-300 overflow-hidden relative">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Content */}
        <div className="p-6">
          {currentUser && !isSwitching ? (
            /* Logged in state */
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-300">
                  <img
                    src={DEFAULT_LOGO}
                    alt="Collab Qu"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-none">
                    Collab Qu 1.20
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Profil Akun Terhubung
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-950 truncate">
                      {currentUser.name}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 stroke-[2.5]" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 truncate">
                    {currentUser.email}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-800 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.2]" />
                    Terverifikasi Google
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-100 p-3 rounded-xl border border-slate-200">
                Data toko mitra, riwayat setoran, faktur, dan catatan aman tersimpan di profil ini.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSwitching(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl border-2 border-slate-300 text-slate-800 text-xs font-black hover:bg-slate-100 active:scale-98 transition-all"
                >
                  Ganti Akun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-800 text-xs font-black hover:bg-rose-100 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  Keluar
                </button>
              </div>
            </div>
          ) : (
            /* Login Screen: Matching exact user request & screenshot */
            <div className="flex flex-col items-center text-center space-y-6 pt-2">
              {/* Circular Logo matching screenshot */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                <img
                  src={DEFAULT_LOGO}
                  alt="Collab Qu 1.20 Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0e2a47] tracking-tight leading-tight">
                  Collab Qu 1.20
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-600">
                  Solusi Modern Sistem Titip Jual
                </p>
              </div>

              {/* Google Button */}
              <div className="w-full space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    handleInstantGoogleLogin(
                      'hendri.bageur20@gmail.com',
                      'Hendri Bageur'
                    )
                  }
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-98 disabled:opacity-75"
                >
                  {/* Google Icon */}
                  <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-sm font-bold text-slate-800">
                    {isLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
                  </span>
                </button>

                <p className="text-[11px] text-slate-500 font-semibold">
                  Aman, Cepat, Terhubung ke Profil Anda
                </p>

                {/* Alternate Email Button */}
                <div className="pt-2">
                  {!showManualForm ? (
                    <button
                      type="button"
                      onClick={() => setShowManualForm(true)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Masuk dengan email Google lain
                    </button>
                  ) : (
                    <form
                      onSubmit={handleCustomSubmit}
                      className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-300 text-left space-y-2.5 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800">
                          Email Google Kustom
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowManualForm(false)}
                          className="text-[10px] text-slate-500"
                        >
                          Batal
                        </button>
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Nama Pengguna"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          required
                        />
                      </div>

                      <div>
                        <input
                          type="email"
                          placeholder="email@gmail.com"
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || !customName || !customEmail}
                        className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <span>Masuk Sekarang</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
