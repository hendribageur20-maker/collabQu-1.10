import React, { useState } from 'react';
import {
  Search,
  Plus,
  MapPin,
  MessageCircle,
  Phone,
  ChevronRight,
  Store as StoreIcon,
  Filter,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Store, BusinessProfile } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  cleanPhoneForWhatsApp,
  buildWhatsAppStoreGreetingUrl,
} from '../utils/formatters';

interface StoresViewProps {
  stores: Store[];
  business: BusinessProfile;
  onSelectStore: (store: Store) => void;
  onOpenStoreRegistration: () => void;
}

export const StoresView: React.FC<StoresViewProps> = ({
  stores,
  business,
  onSelectStore,
  onOpenStoreRegistration,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'with_receivable' | 'settled'>('all');

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.ownerOrKeeper.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.phone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterType === 'with_receivable') {
      return store.totalReceivable > 0;
    }
    if (filterType === 'settled') {
      return store.totalReceivable === 0;
    }
    return true;
  });

  const totalReceivables = stores.reduce((sum, s) => sum + s.totalReceivable, 0);

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header & Quick Add */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-950">
            Daftar Toko Mitra ({stores.length})
          </h2>
          <p className="text-xs font-bold text-slate-700">
            Total Piutang Berjalan: <strong className="text-rose-800 font-mono font-black">{formatRupiah(totalReceivables)}</strong>
          </p>
        </div>
        <button
          onClick={onOpenStoreRegistration}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-950 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.8]" />
          + Toko Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3 stroke-[2.5]" />
        <input
          type="text"
          placeholder="Cari toko, pemilik, alamat, no. WA..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 text-xs font-semibold rounded-xl border-2 border-slate-300 bg-white shadow-2xs text-slate-900 focus:border-emerald-700 outline-none"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200 rounded-xl">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-colors ${
            filterType === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-800 hover:text-slate-950'
          }`}
        >
          Semua ({stores.length})
        </button>
        <button
          onClick={() => setFilterType('with_receivable')}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-colors ${
            filterType === 'with_receivable'
              ? 'bg-rose-800 text-white shadow-xs'
              : 'text-rose-800 hover:text-rose-950'
          }`}
        >
          Ada Piutang ({stores.filter((s) => s.totalReceivable > 0).length})
        </button>
        <button
          onClick={() => setFilterType('settled')}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-colors ${
            filterType === 'settled'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-emerald-800 hover:text-emerald-950'
          }`}
        >
          Lunas ({stores.filter((s) => s.totalReceivable === 0).length})
        </button>
      </div>

      {/* Store Cards List */}
      <div className="space-y-3">
        {filteredStores.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
            <StoreIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <p>Tidak ada toko yang sesuai dengan pencarian.</p>
          </div>
        ) : (
          filteredStores.map((store) => {
            const totalItems = store.currentConsignment.reduce(
              (sum, item) => sum + item.qty,
              0
            );

            return (
              <div
                key={store.id}
                onClick={() => onSelectStore(store)}
                className="p-4 bg-white rounded-2xl border-2 border-slate-300 shadow-sm hover:border-emerald-600 transition-all cursor-pointer space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-300">
                      <img
                        src={store.photoUrl}
                        alt={store.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded shadow-2xs">
                          {store.code}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {formatDateIndo(store.registrationDate)}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-950 truncate mt-0.5">
                        {store.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-700 truncate">
                        PJ: <strong className="text-slate-950">{store.ownerOrKeeper}</strong> · {store.phone}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0 mt-2 stroke-[2.5]" />
                </div>

                {/* Address & GPS */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 border-t-2 border-slate-100 pt-2">
                  <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                    <MapPin className="w-4 h-4 text-slate-600 shrink-0 stroke-[2.2]" />
                    <span className="truncate">{store.address}</span>
                  </div>

                  {store.location?.lat && (
                    <span className="text-[10px] font-black text-emerald-950 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-mono shrink-0">
                      GPS Aktif
                    </span>
                  )}
                </div>

                {/* Financial & Titipan Snapshot */}
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                      Titipan Berjalan
                    </span>
                    <span className="font-black text-slate-950 font-mono text-xs sm:text-sm">
                      {totalItems} pcs ({store.currentConsignment.length} produk)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                      Tagihan Piutang
                    </span>
                    <span
                      className={`font-black font-mono text-xs sm:text-sm ${
                        store.totalReceivable > 0
                          ? 'text-rose-800'
                          : 'text-emerald-800'
                      }`}
                    >
                      {formatRupiah(store.totalReceivable)}
                    </span>
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 stroke-[2.2]" />
                    {store.activityLogs?.length || 0} riwayat aktivitas
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={buildWhatsAppStoreGreetingUrl(store, business)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors"
                      title="Kirim Laporan WA"
                    >
                      <MessageCircle className="w-4 h-4 stroke-[2.2]" />
                      Chat WA
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
