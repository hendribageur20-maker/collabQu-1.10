import React from 'react';
import {
  Store as StoreIcon,
  TrendingUp,
  Coins,
  Boxes,
  ArrowRight,
  MessageCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppState, Store } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  cleanPhoneForWhatsApp,
  buildWhatsAppStoreGreetingUrl,
} from '../utils/formatters';

interface DashboardViewProps {
  appState: AppState;
  onOpenStoreRegistration: () => void;
  onSelectStore: (store: Store) => void;
  onNavigateTab: (tab: AppState['activeTab']) => void;
  onOpenMarketingScript: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appState,
  onSelectStore,
  onNavigateTab,
  onOpenMarketingScript,
}) => {
  const { stores, products } = appState;

  // Key KPI Calculations
  const totalStores = stores.length;
  const totalReceivables = stores.reduce(
    (acc, s) => acc + (s.totalReceivable || 0),
    0
  );
  const totalPaid = stores.reduce((acc, s) => acc + (s.totalPaid || 0), 0);
  const totalConsignedItemsCount = stores.reduce(
    (acc, s) =>
      acc + (s.currentConsignment?.reduce((sum, item) => sum + item.qty, 0) || 0),
    0
  );

  // Flatten latest activity logs
  const allLogs = stores
    .flatMap((s) =>
      (s.activityLogs || []).map((l) => ({
        ...l,
        storeName: s.name,
        storeId: s.id,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* GRID KARTU METRIK: High Outdoor Contrast & Ultra-Legibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: Total Mitra Toko */}
        <div
          onClick={() => onNavigateTab('stores')}
          className="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Total Mitra Toko
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <StoreIcon className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight">
            {totalStores}
            <span className="text-sm font-bold text-slate-700 ml-1.5 font-sans">
              toko aktif
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 font-extrabold pt-2 border-t-2 border-slate-100 flex items-center justify-between">
            <span>{totalConsignedItemsCount} pcs barang beredar</span>
            <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </p>
        </div>

        {/* Card 2: Tagihan Piutang Belum Setor */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm hover:border-rose-700 hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Piutang Toko Belum Disetor
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-700 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Coins className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-800 font-mono tracking-tight truncate">
            {formatRupiah(totalReceivables)}
          </div>
          <p className="text-xs sm:text-sm text-rose-800 font-extrabold pt-2 border-t-2 border-slate-100 flex items-center justify-between">
            <span>Tagihan berjalan di toko</span>
            <ArrowRight className="w-4 h-4 text-rose-800 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </p>
        </div>

        {/* Card 3: Setoran Omset Terkumpul */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Setoran Masuk (Kas Diterima)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono tracking-tight truncate">
            {formatRupiah(totalPaid)}
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 font-extrabold pt-2 border-t-2 border-slate-100 flex items-center justify-between">
            <span>Kas laku konsinyasi sukses</span>
            <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </p>
        </div>

        {/* Card 4: Stok Gudang Induk */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm hover:border-blue-700 hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Stok Gudang Induk
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-800 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Boxes className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-950 font-mono tracking-tight">
            {products.reduce((acc, p) => acc + (p.warehouseStock || 0), 0)}
            <span className="text-sm font-bold text-slate-700 ml-1.5 font-sans">
              pcs siap kirim
            </span>
          </div>
          <p className="text-xs sm:text-sm text-blue-800 font-extrabold pt-2 border-t-2 border-slate-100 flex items-center justify-between">
            <span>{products.length} varian produk terdaftar</span>
            <ArrowRight className="w-4 h-4 text-blue-800 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </p>
        </div>
      </div>

      {/* Quick Marketing Pitch Banner - High Visibility Gold */}
      <div
        onClick={onOpenMarketingScript}
        className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-all shadow-sm"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black truncate leading-tight text-amber-950">
              Script Penawaran Titip Jual (Canvassing Lapangan)
            </h4>
            <p className="text-xs font-bold text-amber-900 truncate mt-0.5">
              Klik untuk menyalin kalimat pitch penawaran tanpa modal & garansi retur 100%
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-amber-900 shrink-0 ml-2 stroke-[2.5]" />
      </div>

      {/* Recent Stores List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wider">
            Mitra Toko Terkini
          </h3>
          <button
            onClick={() => onNavigateTab('stores')}
            className="text-xs sm:text-sm font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            Lihat Semua ({totalStores})
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="space-y-3">
          {stores.slice(0, 3).map((store) => (
            <div
              key={store.id}
              onClick={() => onSelectStore(store)}
              className="p-4 bg-white rounded-2xl border-2 border-slate-300 shadow-sm hover:border-emerald-600 transition-all flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-300">
                  <img
                    src={store.photoUrl}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded shadow-2xs">
                      {store.code}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {formatDateIndo(store.registrationDate)}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-950 truncate mt-0.5">
                    {store.name}
                  </h4>
                  <p className="text-xs font-bold text-slate-700 truncate mt-0.5">
                    PJ: <strong className="text-slate-950">{store.ownerOrKeeper}</strong> · {store.address}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
                      {store.currentConsignment.reduce((s, c) => s + c.qty, 0)}{' '}
                      pcs dititipkan
                    </span>
                    {store.totalReceivable > 0 && (
                      <span className="text-xs font-mono font-black text-rose-800 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded">
                        Piutang: {formatRupiah(store.totalReceivable)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <a
                  href={buildWhatsAppStoreGreetingUrl(store, appState.businessProfile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Kirim Laporan WA"
                >
                  <MessageCircle className="w-5 h-5 stroke-[2.2]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Activity Logs Timeline */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wider">
          Aktivitas Titip Jual Terkini
        </h3>

        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm divide-y-2 divide-slate-100">
          {allLogs.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm font-bold text-slate-600">
              Belum ada riwayat aktivitas titip jual.
            </div>
          ) : (
            allLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-3 text-xs sm:text-sm">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    log.type === 'payment'
                      ? 'bg-emerald-800 text-white'
                      : log.type === 'delivery'
                      ? 'bg-blue-800 text-white'
                      : log.type === 'return'
                      ? 'bg-rose-800 text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  <Clock className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-950 truncate">
                      {log.storeName}
                    </span>
                    <span className="text-xs text-slate-600 font-mono font-bold shrink-0 ml-1">
                      {formatDateIndo(log.date)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-snug mt-0.5">
                    {log.description}
                  </p>
                  {log.amount !== undefined && (
                    <span className="text-xs sm:text-sm font-black font-mono text-emerald-800 block mt-1">
                      {formatRupiah(log.amount)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
