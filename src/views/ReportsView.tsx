import React, { useState } from 'react';
import {
  TrendingUp,
  Coins,
  Boxes,
  Store as StoreIcon,
  Printer,
  Calendar,
  MessageCircle,
  FileText,
  DollarSign,
  Settings,
} from 'lucide-react';
import { AppState, Store } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  cleanPhoneForWhatsApp,
} from '../utils/formatters';

interface ReportsViewProps {
  appState: AppState;
  onSelectStore: (store: Store) => void;
  onOpenSettings?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  appState,
  onSelectStore,
  onOpenSettings,
}) => {
  const { stores, products, businessProfile, invoices } = appState;
  const [reportSubTab, setReportSubTab] = useState<
    'all' | 'omset' | 'tagihan' | 'modal'
  >('all');

  // Calculations
  const totalOmsetTerkumpul = stores.reduce(
    (sum, s) => sum + (s.totalPaid || 0),
    0
  );
  const totalTagihanPiutang = stores.reduce(
    (sum, s) => sum + (s.totalReceivable || 0),
    0
  );

  // Valuation of stock in warehouse
  const totalModalGudang = products.reduce(
    (sum, p) => sum + (p.warehouseStock || 0) * (p.costPrice || 0),
    0
  );

  // Valuation of stock currently placed in stores (at cost and at selling price)
  const totalModalTitipanDiToko = stores.reduce((sum, s) => {
    return (
      sum +
      s.currentConsignment.reduce((acc, c) => acc + c.qty * (c.costPrice || 0), 0)
    );
  }, 0);

  const totalNilaiJualTitipanDiToko = stores.reduce((sum, s) => {
    return (
      sum +
      s.currentConsignment.reduce(
        (acc, c) => acc + c.qty * (c.unitPrice || 0),
        0
      )
    );
  }, 0);

  const totalValuasiModalKeseluruhan =
    totalModalGudang + totalModalTitipanDiToko;

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Header & Print Action */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Laporan Usaha Titip Jual
          </h2>
          <p className="text-xs text-slate-500">
            Omset, tagihan piutang toko & valuasi modal
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-2.5 py-2 border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Buka Pengaturan"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Pengaturan</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl no-print text-xs font-semibold">
        <button
          onClick={() => setReportSubTab('all')}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            reportSubTab === 'all'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Ringkasan
        </button>
        <button
          onClick={() => setReportSubTab('omset')}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            reportSubTab === 'omset'
              ? 'bg-white text-emerald-800 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Omset
        </button>
        <button
          onClick={() => setReportSubTab('tagihan')}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            reportSubTab === 'tagihan'
              ? 'bg-white text-rose-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tagihan Toko
        </button>
        <button
          onClick={() => setReportSubTab('modal')}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            reportSubTab === 'modal'
              ? 'bg-white text-blue-800 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Modal / Stok
        </button>
      </div>

      {/* Section 1: 3 Big Pillars Summary - High Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Pillar 1: Omset */}
        <div className="p-4 bg-white border-2 border-emerald-600 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
              1. Omset (Pendapatan Masuk)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-950">
            {formatRupiah(totalOmsetTerkumpul)}
          </div>
          <p className="text-xs font-bold text-emerald-800">
            Total setoran uang kas hasil penjualan konsinyasi.
          </p>
        </div>

        {/* Pillar 2: Tagihan Piutang */}
        <div className="p-4 bg-white border-2 border-rose-600 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-black uppercase tracking-wider text-rose-950">
              2. Tagihan (Piutang Toko)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-700 text-white flex items-center justify-center">
              <Coins className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-900">
            {formatRupiah(totalTagihanPiutang)}
          </div>
          <p className="text-xs font-bold text-rose-800">
            Total barang titipan yang sedang beredar dan belum disetor.
          </p>
        </div>

        {/* Pillar 3: Modal / Stok */}
        <div className="p-4 bg-white border-2 border-blue-600 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-blue-800">
            <span className="text-xs font-black uppercase tracking-wider text-blue-950">
              3. Modal / Stok (Valuasi HPP)
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-800 text-white flex items-center justify-center">
              <Boxes className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-blue-950">
            {formatRupiah(totalValuasiModalKeseluruhan)}
          </div>
          <p className="text-xs font-bold text-blue-800">
            Total modal fisik (Gudang + Toko mitra).
          </p>
        </div>
      </div>

      {/* DETAILED VIEW: Tagihan Piutang per Toko */}
      {(reportSubTab === 'all' || reportSubTab === 'tagihan') && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daftar Tagihan Piutang per Toko
              </h3>
              <p className="text-[11px] text-slate-500">
                Toko dengan titipan yang belum disetor
              </p>
            </div>
            <span className="text-xs font-bold font-mono text-rose-600">
              Total: {formatRupiah(totalTagihanPiutang)}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {stores
              .filter((s) => s.totalReceivable > 0)
              .map((store) => (
                <div
                  key={store.id}
                  onClick={() => onSelectStore(store)}
                  className="py-3 flex items-center justify-between gap-2 hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">
                      {store.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      PJ: {store.ownerOrKeeper} · WA: {store.phone}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {store.currentConsignment.reduce((s, c) => s + c.qty, 0)}{' '}
                      pcs produk dititipkan
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-rose-600 block">
                      {formatRupiah(store.totalReceivable)}
                    </span>
                    <a
                      href={`https://wa.me/${cleanPhoneForWhatsApp(
                        store.phone
                      )}?text=${encodeURIComponent(
                        `Halo Bapak/Ibu ${store.ownerOrKeeper} (${store.name}), izin mengonfirmasi jadwal penagihan dan cek stok titipan produk ${businessProfile.name}. Terima kasih.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline mt-1"
                    >
                      <MessageCircle className="w-3 h-3" /> Ingatkan WA
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DETAILED VIEW: Valuasi Modal & Stok Fisik */}
      {(reportSubTab === 'all' || reportSubTab === 'modal') && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Rincian Modal & Valuasi Stok
              </h3>
              <p className="text-[11px] text-slate-500">
                Pemisahan modal di gudang vs modal di toko
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">
                Modal Gudang Induk
              </span>
              <span className="text-sm font-bold font-mono text-slate-900 block">
                {formatRupiah(totalModalGudang)}
              </span>
              <span className="text-[10px] text-slate-400">
                {products.reduce((s, p) => s + p.warehouseStock, 0)} pcs di gudang
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">
                Modal Tersebar di Toko
              </span>
              <span className="text-sm font-bold font-mono text-blue-700 block">
                {formatRupiah(totalModalTitipanDiToko)}
              </span>
              <span className="text-[10px] text-slate-400">
                {stores.reduce(
                  (s, st) =>
                    s + st.currentConsignment.reduce((a, b) => a + b.qty, 0),
                  0
                )}{' '}
                pcs di mitra
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                  <th className="p-2.5">Produk</th>
                  <th className="p-2.5 text-center">Gudang</th>
                  <th className="p-2.5 text-center">Di Toko</th>
                  <th className="p-2.5 text-right">Modal/Unit</th>
                  <th className="p-2.5 text-right">Total Modal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {products.map((prod) => {
                  const atStores = stores.reduce((sum, s) => {
                    const found = s.currentConsignment.find(
                      (c) => c.productId === prod.id
                    );
                    return sum + (found ? found.qty : 0);
                  }, 0);
                  const totalUnits = prod.warehouseStock + atStores;
                  const totalProdModal = totalUnits * prod.costPrice;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-sans font-medium text-slate-900">
                        {prod.name}
                      </td>
                      <td className="p-2.5 text-center text-slate-600">
                        {prod.warehouseStock}
                      </td>
                      <td className="p-2.5 text-center text-blue-700 font-bold">
                        {atStores}
                      </td>
                      <td className="p-2.5 text-right text-slate-600">
                        {formatRupiah(prod.costPrice)}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        {formatRupiah(totalProdModal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED VIEW: Log Penyetoran Kas (Omset) */}
      {(reportSubTab === 'all' || reportSubTab === 'omset') && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Riwayat Setoran Uang Penjualan (Omset)
              </h3>
              <p className="text-[11px] text-slate-500">
                Pencatatan uang tunai / transfer yang berhasil disetor
              </p>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-800">
              Total: {formatRupiah(totalOmsetTerkumpul)}
            </span>
          </div>

          <div className="space-y-2">
            {stores
              .flatMap((s) =>
                (s.activityLogs || [])
                  .filter((l) => l.type === 'payment')
                  .map((log) => ({
                    ...log,
                    storeName: s.name,
                  }))
              )
              .sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{log.storeName}</h4>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {log.description}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateIndo(log.date)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-emerald-700 text-sm">
                      +{formatRupiah(log.amount || 0)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
