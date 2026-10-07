import React, { useState, useRef } from 'react';
import {
  X,
  MapPin,
  Camera,
  Upload,
  Plus,
  Trash2,
  FileText,
  Navigation,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Product, Store, ConsignmentItem, StoreLocation } from '../types';
import { formatRupiah, compressImageFile } from '../utils/formatters';

interface StoreRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveStore: (store: Store, generateInvoice: boolean) => void;
}

export const StoreRegistrationModal: React.FC<StoreRegistrationModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveStore,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [storeName, setStoreName] = useState('');
  const [ownerOrKeeper, setOwnerOrKeeper] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [registrationDate, setRegistrationDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  });

  // Location / GPS State
  const [location, setLocation] = useState<StoreLocation>({});
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Photo State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  // Consignment Items State
  const [items, setItems] = useState<
    Array<{
      productId: string;
      productName: string;
      unit: string;
      qty: number;
      unitPrice: number;
      costPrice: number;
    }>
  >([
    {
      productId: products[0]?.id || 'custom-1',
      productName: products[0]?.name || 'Keripik Singkong Balado Pedas 200g',
      unit: products[0]?.unit || 'pcs',
      qty: 15,
      unitPrice: products[0]?.sellingPrice || 10000,
      costPrice: products[0]?.costPrice || 7000,
    },
  ]);

  if (!isOpen) return null;

  // Handle GPS detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Perangkat Anda tidak mendukung fitur GPS Geolocation.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const accuracy = Math.round(pos.coords.accuracy);
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

        setLocation({
          lat,
          lng,
          accuracy,
          addressSnippet: `GPS Koordinat: ${lat}, ${lng} (Akurasi ±${accuracy}m)`,
          mapsUrl,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setLocationError(
          err.code === 1
            ? 'Izin GPS ditolak oleh browser. Anda dapat menyetel izin lokasi atau mengisi manual.'
            : 'Gagal mendeteksi koordinat GPS. Pastikan GPS HP aktif.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle Photo selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      const compressed = await compressImageFile(file, 800, 0.7);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error('Photo compression error:', err);
      alert('Gagal memproses foto. Silakan coba lagi.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Preset sample store photo option
  const handlePickSamplePhoto = () => {
    setPhotoUrl(
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80'
    );
  };

  // Handle product dropdown change
  const handleProductSelect = (index: number, selectedId: string) => {
    const prod = products.find((p) => p.id === selectedId);
    setItems((prev) => {
      const copy = [...prev];
      if (prod) {
        copy[index] = {
          productId: prod.id,
          productName: prod.name,
          unit: prod.unit,
          qty: copy[index]?.qty || 10,
          unitPrice: prod.sellingPrice,
          costPrice: prod.costPrice,
        };
      } else {
        copy[index] = {
          productId: `custom-${Date.now()}`,
          productName: '',
          unit: 'pcs',
          qty: copy[index]?.qty || 10,
          unitPrice: 0,
          costPrice: 0,
        };
      }
      return copy;
    });
  };

  // Handle item change
  const handleUpdateItem = (
    index: number,
    field: 'productName' | 'unit' | 'qty' | 'unitPrice',
    val: string | number
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      const cur = { ...copy[index] };
      if (field === 'qty') cur.qty = Math.max(1, Number(val) || 1);
      else if (field === 'unitPrice') cur.unitPrice = Math.max(0, Number(val) || 0);
      else if (field === 'unit') cur.unit = String(val);
      else if (field === 'productName') cur.productName = String(val);

      copy[index] = cur;
      return copy;
    });
  };

  const handleAddItem = () => {
    const firstUnused =
      products.find((p) => !items.some((i) => i.productId === p.id)) || products[0];

    setItems((prev) => [
      ...prev,
      {
        productId: firstUnused?.id || `custom-${Date.now()}`,
        productName: firstUnused?.name || 'Produk Baru',
        unit: firstUnused?.unit || 'pcs',
        qty: 10,
        unitPrice: firstUnused?.sellingPrice || 10000,
        costPrice: firstUnused?.costPrice || 7000,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Total Calculation
  const totalAmount = items.reduce(
    (sum, it) => sum + (it.qty || 0) * (it.unitPrice || 0),
    0
  );

  const handleSubmit = (generateInvoice: boolean) => {
    if (!storeName.trim()) {
      alert('Mohon masukkan Nama Toko.');
      return;
    }
    if (!ownerOrKeeper.trim()) {
      alert('Mohon masukkan Nama Pemilik / Penjaga Toko.');
      return;
    }
    if (!phone.trim()) {
      alert('Mohon masukkan Nomor WhatsApp Toko.');
      return;
    }

    const consignmentItems: ConsignmentItem[] = items.map((it) => ({
      productId: it.productId,
      productName: it.productName || 'Produk Titipan',
      unit: it.unit || 'pcs',
      qty: it.qty,
      unitPrice: it.unitPrice,
      costPrice: it.costPrice,
      totalPrice: it.qty * it.unitPrice,
    }));

    const newStore: Store = {
      id: `store-${Date.now()}`,
      code: `TK-${Math.floor(100 + Math.random() * 900)}`,
      name: storeName.trim(),
      ownerOrKeeper: ownerOrKeeper.trim(),
      phone: phone.trim(),
      address: address.trim() || 'Alamat belum diisi',
      registrationDate: new Date(registrationDate).toISOString(),
      photoUrl:
        photoUrl ||
        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
      location: location.lat
        ? location
        : {
            lat: -6.9147,
            lng: 107.6098,
            addressSnippet: address || 'Bandung',
            mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(address || storeName)}`,
          },
      status: 'active',
      totalReceivable: totalAmount,
      totalPaid: 0,
      currentConsignment: consignmentItems,
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          date: new Date(registrationDate).toISOString(),
          type: 'registration',
          title: 'Registrasi Toko Baru & Titip Perdana',
          description: `Registrasi berhasil dengan titipan perdana ${consignmentItems.reduce(
            (s, c) => s + c.qty,
            0
          )} barang senilai ${formatRupiah(totalAmount)}.`,
          amount: totalAmount,
          items: consignmentItems,
        },
      ],
      notes: notes.trim(),
    };

    onSaveStore(newStore, generateInvoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Registrasi Toko Baru & Titipan
            </h2>
            <p className="text-[11px] text-slate-500">
              Formulir kemitraan konsinyasi & pembuatan faktur
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {/* Section 1: Tanggal & Lokasi GPS */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tanggal Otomatis */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanggal & Waktu
                </label>
                <input
                  type="datetime-local"
                  value={registrationDate}
                  onChange={(e) => setRegistrationDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-slate-50"
                />
              </div>

              {/* Sharelok GPS */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sharelok (GPS / Maps)
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isLocating}
                    className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <Navigation
                      className={`w-3.5 h-3.5 text-emerald-600 ${
                        isLocating ? 'animate-spin' : ''
                      }`}
                    />
                    {isLocating ? 'Mendeteksi...' : 'Ambil GPS Sekarang'}
                  </button>
                </div>
              </div>
            </div>

            {/* GPS Feedback & Link */}
            {location.lat && location.lng ? (
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    GPS Terkunci: {location.lat}, {location.lng}{' '}
                    {location.accuracy ? `(±${location.accuracy}m)` : ''}
                  </span>
                </div>
                <a
                  href={location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline ml-2"
                >
                  Buka Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : locationError ? (
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>{locationError}</span>
              </div>
            ) : null}
          </div>

          {/* Section 2: Foto Toko */}
          <div className="pt-3 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Foto Toko / Etalase
            </label>
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Foto Toko"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-1 text-slate-400">
                    <Camera className="w-6 h-6 mx-auto mb-0.5" />
                    <span className="text-[9px]">Belum ada</span>
                  </div>
                )}
                {isProcessingPhoto && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] font-semibold text-emerald-700">
                    Loading...
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    Ambil / Upload Foto
                  </button>
                  {!photoUrl && (
                    <button
                      type="button"
                      onClick={handlePickSamplePhoto}
                      className="px-2.5 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-medium transition-colors"
                    >
                      Gunakan Foto Contoh
                    </button>
                  )}
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="px-2 py-1 rounded text-rose-600 hover:bg-rose-50 text-[11px]"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  Dapat langsung mengambil foto etalase warung menggunakan kamera smartphone.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Data Pemilik, Alamat, WhatsApp */}
          <div className="pt-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Toko / Warung <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Misal: Toko Berkah Jaya"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Pemilik / Penjaga <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Misal: Ibu Hj. Maryam"
                  value={ownerOrKeeper}
                  onChange={(e) => setOwnerOrKeeper(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alamat Lengkap Toko
                </label>
                <input
                  type="text"
                  placeholder="Jl. Sukajadi No. 45..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Data Barang Dititipkan (Qty, Harga, Total) */}
          <div className="pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Barang / Produk Dititipkan
                </label>
                <p className="text-[10px] text-slate-400">
                  Pilih produk dari katalog atau ketik produk baru
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Produk
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => {
                const rowTotal = (item.qty || 0) * (item.unitPrice || 0);

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-500">
                        Item #{idx + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded"
                          title="Hapus item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Pilih Produk */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                          Nama Produk
                        </label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-emerald-600"
                        >
                          {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name} ({formatRupiah(prod.sellingPrice)}/{prod.unit})
                            </option>
                          ))}
                          <option value="custom">-- Ketik Produk Kustom --</option>
                        </select>
                      </div>

                      {item.productId.startsWith('custom') && (
                        <div>
                          <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                            Nama Produk Kustom
                          </label>
                          <input
                            type="text"
                            placeholder="Nama produk..."
                            value={item.productName}
                            onChange={(e) =>
                              handleUpdateItem(idx, 'productName', e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* Qty & Harga Satuan & Subtotal */}
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                          Qty ({item.unit})
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'qty', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                          Harga Satuan (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'unitPrice', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                          Subtotal
                        </label>
                        <div className="px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200/60 font-mono truncate">
                          {formatRupiah(rowTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Ringkasan */}
            <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-300 block">
                  Total Nilai Titipan Awal
                </span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
              <span className="text-xs text-slate-300">
                {items.reduce((s, i) => s + (Number(i.qty) || 0), 0)} pcs total
              </span>
            </div>
          </div>

          {/* Section 5: Catatan Tambahan */}
          <div className="pt-3">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan Khusus Toko (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Titip di etalase depan, jadwal setor tiap Kamis"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-2.5 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="w-full sm:w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold active:scale-98 transition-all"
          >
            Simpan Saja
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="w-full sm:w-2/3 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Simpan & Generate Invoice PDF
          </button>
        </div>
      </div>
    </div>
  );
};
