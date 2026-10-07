import React, { useState, useEffect } from 'react';
import { X, Package, Calculator, Check } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSaveProduct: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSaveProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Snack');
  const [unit, setUnit] = useState('pcs');
  const [warehouseStock, setWarehouseStock] = useState<number>(50);
  const [costPrice, setCostPrice] = useState<number>(6000);
  const [sellingPrice, setSellingPrice] = useState<number>(9000);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category || 'Snack');
      setUnit(productToEdit.unit || 'pcs');
      setWarehouseStock(productToEdit.warehouseStock || 0);
      setCostPrice(productToEdit.costPrice || 0);
      setSellingPrice(productToEdit.sellingPrice || 0);
    } else {
      setName('');
      setCategory('Snack');
      setUnit('pcs');
      setWarehouseStock(50);
      setCostPrice(6000);
      setSellingPrice(9000);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const profitMargin = sellingPrice - costPrice;
  const profitPercentage =
    sellingPrice > 0 ? Math.round((profitMargin / sellingPrice) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Mohon masukkan Nama Produk.');
      return;
    }

    const saved: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      code: productToEdit ? productToEdit.code : `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      category: category.trim() || 'Umum',
      unit: unit.trim() || 'pcs',
      warehouseStock: Math.max(0, warehouseStock),
      costPrice: Math.max(0, costPrice),
      sellingPrice: Math.max(0, sellingPrice),
      updatedAt: new Date().toISOString(),
    };

    onSaveProduct(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {productToEdit ? 'Edit Data Produk' : 'Tambah Produk Baru'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Manajemen stok induk & penetapan harga konsinyasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Produk Titipan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Misal: Keripik Singkong Balado 200g"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <input
                type="text"
                placeholder="Snack / Kue / Minuman"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Satuan (Unit)
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 outline-none"
              >
                <option value="pcs">pcs (Bungkus)</option>
                <option value="pack">pack</option>
                <option value="box">box / dus</option>
                <option value="bks">bks</option>
                <option value="toples">toples</option>
                <option value="renceng">renceng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Stok di Gudang Induk ({unit})
            </label>
            <input
              type="number"
              min="0"
              value={warehouseStock}
              onChange={(e) => setWarehouseStock(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 font-mono font-bold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Harga Modal (HPP)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold focus:border-emerald-600 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Harga Jual Titip
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold focus:border-emerald-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Real-time Profit Calculation */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Estimasi Margin Keuntungan
              </span>
              <span className="text-sm font-bold font-mono text-emerald-700">
                {formatRupiah(profitMargin)} / {unit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Persentase</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                {profitPercentage}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
            >
              <Check className="w-4 h-4" />
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
