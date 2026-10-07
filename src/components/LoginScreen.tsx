import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DEFAULT_LOGO } from '../services/storage';
import { User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherAccount, setShowOtherAccount] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleDefaultGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'usr-google-hendri',
        name: 'Hendri Bageur',
        email: 'hendri.bageur20@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        role: 'owner',
        lastLogin: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: `usr-google-${Date.now()}`,
        name: customName,
        email: customEmail,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customName)}&background=047857&color=fff&bold=true`,
        role: 'owner',
        lastLogin: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      {/* Container simulating high-end mobile experience */}
      <div className="w-full max-w-sm flex flex-col items-center justify-center space-y-8 py-10">
        
        {/* Brand Logo & Name Area */}
        <div className="flex flex-col items-center space-y-4">
          {/* Circular Q Handshake Logo - Exactly matching screenshot */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center transition-transform hover:scale-105 duration-200">
            <img
              src={DEFAULT_LOGO}
              alt="Collab Qu 1.20 Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* App Title */}
          <div className="space-y-1.5 pt-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0e2a47] tracking-tight leading-tight">
              Collab Qu 1.20
            </h1>
            <p className="text-sm sm:text-base font-semibold text-slate-600 tracking-normal">
              Solusi Modern Sistem Titip Jual
            </p>
          </div>
        </div>

        {/* Action Button: Masuk dengan Google */}
        <div className="w-full max-w-xs space-y-3 pt-2">
          <button
            type="button"
            onClick={handleDefaultGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 rounded-2xl border-2 border-slate-200/90 shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-75"
          >
            {/* Google 4-Color Icon */}
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

            <span className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              {isLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
            </span>
          </button>

          {/* Subtext under button */}
          <p className="text-xs text-slate-500 font-semibold tracking-tight">
            Aman, Cepat, Terhubung ke Profil Anda
          </p>

          {/* Switch/Custom Account Option */}
          <div className="pt-4">
            {!showOtherAccount ? (
              <button
                type="button"
                onClick={() => setShowOtherAccount(true)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
              >
                Gunakan email Google lain
              </button>
            ) : (
              <form
                onSubmit={handleCustomSubmit}
                className="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-md space-y-3 text-left animate-fadeIn mt-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Masuk Akun Google Kustom
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowOtherAccount(false)}
                    className="text-[11px] text-slate-500 hover:text-slate-800"
                  >
                    Batal
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Nama Pemilik / Sales
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Hendri Bageur"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Email Google
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="nama@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !customName || !customEmail}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Lanjutkan Masuk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-6 flex items-center justify-center gap-1.5 text-slate-400 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Keamanan Data & Privasi Terjamin</span>
        </div>
      </div>
    </div>
  );
};
