import React, { useState } from 'react';
import {
  X,
  Phone,
  MapPin,
  ExternalLink,
  MessageCircle,
  Plus,
  Coins,
  RotateCcw,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Store as StoreIcon,
  Copy,
  Check,
} from 'lucide-react';
import { Store, Product, ConsignmentItem, BusinessProfile } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  formatDateTimeIndo,
  cleanPhoneForWhatsApp,
  buildWhatsAppStoreGreetingUrl,
  buildWhatsAppStoreUpdateText,
} from '../utils/formatters';

interface StoreDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
  products: Product[];
  business: BusinessProfile;
  onAddDelivery: (storeId: string, items: ConsignmentItem[], notes: string) => void;
  onRecordPayment: (storeId: string, amount: number, notes: string) => void;
  onRecordReturn: (storeId: string, items: ConsignmentItem[], notes: string) => void;
  onViewInvoice: (storeId: string) => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({
  isOpen,
  onClose,
  store,
  products,
  business,
  onAddDelivery,
  onRecordPayment,
  onRecordReturn,
  onViewInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'consignment' | 'logs' | 'action'>(
    'consignment'
  );

  // Sub-action forms: 'payment' | 'restock' | 'return' | null
  const [actionType, setActionType] = useState<
    'payment' | 'restock' | 'return' | null
  >(null);

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payNotes, setPayNotes] = useState<string>('');

  // Restock form state
  const [restockProductId, setRestockProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [restockQty, setRestockQty] = useState<number>(10);
  const [restockNotes, setRestockNotes] = useState<string>('');

  // Return form state
  const [returnProductId, setReturnProductId] = useState<string>('');
  const [returnQty, setReturnQty] = useState<number>(1);
  const [returnNotes, setReturnNotes] = useState<string>('');
  const [copiedWa, setCopiedWa] = useState<boolean>(false);

  if (!isOpen || !store) return null;

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppStoreGreetingUrl(store, business);
    window.open(url, '_blank');
  };

  const handleCopyWhatsApp = () => {
    const text = buildWhatsAppStoreUpdateText(store, business);
    navigator.clipboard.writeText(text);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2000);
  };

  const handleOpenMaps = () => {
    if (store.location?.mapsUrl) {
      window.open(store.location.mapsUrl, '_blank');
    } else {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(
          store.address || store.name
        )}`,
        '_blank'
      );
    }
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      alert('Masukkan jumlah setoran pembayaran yang valid.');
      return;
    }
    onRecordPayment(store.id, payAmount, payNotes);
    setActionType(null);
    setPayAmount(0);
    setPayNotes('');
  };

  const submitRestock = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === restockProductId);
    if (!prod) return;

    const item: ConsignmentItem = {
      productId: prod.id,
      productName: prod.name,
      unit: prod.unit,
      qty: restockQty,
      costPrice: prod.costPrice,
      unitPrice: prod.sellingPrice,
      totalPrice: prod.sellingPrice * restockQty,
    };

    onAddDelivery(store.id, [item], restockNotes);
    setActionType(null);
    setRestockQty(10);
    setRestockNotes('');
  };

  const submitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedConsign = store.currentConsignment.find(
      (c) => c.productId === returnProductId
    );
    if (!selectedConsign) {
      alert('Pilih barang yang akan diretur.');
      return;
    }

    const returnItem: ConsignmentItem = {
      ...selectedConsign,
      qty: returnQty,
      totalPrice: returnQty * selectedConsign.unitPrice,
    };

    onRecordReturn(store.id, [returnItem], returnNotes);
    setActionType(null);
    setReturnQty(1);
    setReturnNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header / Hero Cover */}
        <div className="relative h-28 bg-gradient-to-r from-emerald-800 to-slate-900 overflow-hidden shrink-0">
          {store.photoUrl ? (
            <img
              src={store.photoUrl}
              alt={store.name}
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 flex flex-col justify-end text-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-300 font-mono">
                {store.code} · Terdaftar {formatDateIndo(store.registrationDate)}
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors -mr-1 -mt-6"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-base font-bold truncate leading-tight">
              {store.name}
            </h2>
            <p className="text-xs text-slate-300 truncate">
              PJ: {store.ownerOrKeeper} · WA: {store.phone}
            </p>
          </div>
        </div>

        {/* Quick Action Bar (WhatsApp, Maps, Invoice) */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleOpenWhatsApp}
              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Buka WhatsApp dengan Format Laporan Terupdate"
            >
              <MessageCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              Kirim WA
            </button>
            <button
              onClick={handleCopyWhatsApp}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              title="Salin Teks Format Laporan WA"
            >
              {copiedWa ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600 stroke-[2.2]" />
                  <span>Salin WA</span>
                </>
              )}
            </button>
            <button
              onClick={handleOpenMaps}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Maps
            </button>
          </div>

          <button
            onClick={() => onViewInvoice(store.id)}
            className="px-2.5 py-1.5 text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            Faktur
          </button>
        </div>

        {/* Segmented Control Tabs */}
        <div className="px-4 pt-3 pb-1 border-b border-slate-100 flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('consignment');
              setActionType(null);
            }}
            className={`pb-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'consignment' && !actionType
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Titipan Aktif ({store.currentConsignment.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('logs');
              setActionType(null);
            }}
            className={`pb-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'logs' && !actionType
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Riwayat Aktivitas ({store.activityLogs?.length || 0})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Sub-Action Modal Forms */}
          {actionType === 'payment' && (
            <form
              onSubmit={submitPayment}
              className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-3 animate-fadeIn"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-700" />
                  Catat Setoran / Pembayaran Toko
                </h4>
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Nominal Setoran (Rp)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  placeholder="Misal: 250000"
                  value={payAmount || ''}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono font-bold focus:border-emerald-600 outline-none"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Sisa piutang toko saat ini: {formatRupiah(store.totalReceivable)}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Catatan Pembayaran
                </label>
                <input
                  type="text"
                  placeholder="Misal: Setoran tunai hasil laku minggu ke-1"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Setoran
                </button>
              </div>
            </form>
          )}

          {actionType === 'restock' && (
            <form
              onSubmit={submitRestock}
              className="p-3.5 rounded-xl border border-blue-300 bg-blue-50/50 space-y-3 animate-fadeIn"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-blue-700" />
                  Tambah Titipan / Restock Produk
                </h4>
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Pilih Produk
                  </label>
                  <select
                    value={restockProductId}
                    onChange={(e) => setRestockProductId(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatRupiah(p.sellingPrice)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Jumlah Tambahan (Qty)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Catatan Kunjungan / Restock
                </label>
                <input
                  type="text"
                  placeholder="Misal: Tambahan stok karena stok di toples menipis"
                  value={restockNotes}
                  onChange={(e) => setRestockNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Titipan
                </button>
              </div>
            </form>
          )}

          {actionType === 'return' && (
            <form
              onSubmit={submitReturn}
              className="p-3.5 rounded-xl border border-rose-300 bg-rose-50/50 space-y-3 animate-fadeIn"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-rose-700" />
                  Catat Retur Barang Rusak / Kadaluarsa
                </h4>
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Produk yang Diretur
                  </label>
                  <select
                    value={returnProductId}
                    onChange={(e) => setReturnProductId(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                    required
                  >
                    <option value="">-- Pilih Barang Titip --</option>
                    {store.currentConsignment.map((c) => (
                      <option key={c.productId} value={c.productId}>
                        {c.productName} (Sisa: {c.qty} {c.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Jumlah Retur (Qty)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={returnQty}
                    onChange={(e) => setReturnQty(Number(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Alasan Retur
                </label>
                <input
                  type="text"
                  placeholder="Misal: Kemasan bocor / mendekati tanggal kadaluarsa"
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold"
                >
                  Proses Retur
                </button>
              </div>
            </form>
          )}

          {/* TAB 1: Consignment Products */}
          {activeTab === 'consignment' && !actionType && (
            <div className="space-y-3">
              {/* Financial Status Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Total Piutang Belum Setor
                  </span>
                  <span className="text-sm font-bold font-mono text-rose-600">
                    {formatRupiah(store.totalReceivable)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Total Sudah Dibayar
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-700">
                    {formatRupiah(store.totalPaid)}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Daftar Barang Dititipkan
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {store.currentConsignment.reduce((s, c) => s + c.qty, 0)}{' '}
                    pcs total
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {store.currentConsignment.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Belum ada barang aktif di toko ini.
                    </div>
                  ) : (
                    store.currentConsignment.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {item.qty} {item.unit} · @
                            {formatRupiah(item.unitPrice)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold font-mono text-slate-900 block">
                            {formatRupiah(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Log Action Triggers */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => setActionType('payment')}
                  className="p-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Coins className="w-4 h-4 text-emerald-700" />
                  <span>Catat Setor</span>
                </button>
                <button
                  onClick={() => setActionType('restock')}
                  className="p-2 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-700" />
                  <span>+ Restock</span>
                </button>
                <button
                  onClick={() => setActionType('return')}
                  className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-rose-700" />
                  <span>Retur</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Activity Logs */}
          {activeTab === 'logs' && !actionType && (
            <div className="space-y-3">
              {(!store.activityLogs || store.activityLogs.length === 0) ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada catatan aktivitas untuk toko ini.
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {store.activityLogs.map((log) => {
                    const isPayment = log.type === 'payment';
                    const isDelivery = log.type === 'delivery';
                    const isReturn = log.type === 'return';

                    return (
                      <div key={log.id} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                            isPayment
                              ? 'bg-emerald-600'
                              : isDelivery
                              ? 'bg-blue-600'
                              : isReturn
                              ? 'bg-rose-500'
                              : 'bg-slate-600'
                          }`}
                        />
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              {log.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {formatDateTimeIndo(log.date)}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {log.description}
                          </p>
                          {log.amount !== undefined && (
                            <div className="pt-1 flex items-center justify-between font-mono text-[11px]">
                              <span className="text-slate-400">Nominal:</span>
                              <span
                                className={`font-bold ${
                                  isPayment
                                    ? 'text-emerald-700'
                                    : 'text-slate-800'
                                }`}
                              >
                                {formatRupiah(log.amount)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
