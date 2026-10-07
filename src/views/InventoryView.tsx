import React, { useState } from 'react';
import { Plus, Boxes, Edit2, Trash2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Product, Store } from '../types';
import { formatRupiah } from '../utils/formatters';

interface InventoryViewProps {
  products: Product[];
  stores: Store[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  stores,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  // Calculations
  const totalWarehouseStock = products.reduce(
    (sum, p) => sum + (p.warehouseStock || 0),
    0
  );
  const totalValuationCost = products.reduce(
    (sum, p) => sum + (p.warehouseStock || 0) * (p.costPrice || 0),
    0
  );
  const totalValuationSales = products.reduce(
    (sum, p) => sum + (p.warehouseStock || 0) * (p.sellingPrice || 0),
    0
  );
  const potentialWarehouseProfit = totalValuationSales - totalValuationCost;

  // Calculate stock currently placed across stores
  const getDistributedQty = (productId: string) => {
    return stores.reduce((acc, s) => {
      const match = s.currentConsignment.find((c) => c.productId === productId);
      return acc + (match ? match.qty : 0);
    }, 0);
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Stok & Modal Barang
          </h2>
          <p className="text-xs text-slate-500">
            Katalog produk konsinyasi & valuasi persediaan
          </p>
        </div>
        <button
          onClick={onOpenAddProduct}
          className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          + Produk Baru
        </button>
      </div>

      {/* Valuation Summary Card */}
      <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-md space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold">Valuasi Stok Gudang Utama</span>
          <span className="font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded">
            {totalWarehouseStock} unit total
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-700/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Total Modal (HPP)
            </span>
            <span className="text-sm font-bold font-mono text-slate-100">
              {formatRupiah(totalValuationCost)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Estimasi Nilai Jual
            </span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {formatRupiah(totalValuationSales)}
            </span>
          </div>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-300 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Potensi Laba Gudang:
          </span>
          <span className="font-bold font-mono text-emerald-400">
            +{formatRupiah(potentialWarehouseProfit)}
          </span>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wider">
          Daftar Produk ({products.length})
        </h3>

        {products.map((product) => {
          const distributedQty = getDistributedQty(product.id);
          const margin = product.sellingPrice - product.costPrice;
          const marginPercent =
            product.sellingPrice > 0
              ? Math.round((margin / product.sellingPrice) * 100)
              : 0;

          return (
            <div
              key={product.id}
              className="p-4 bg-white rounded-2xl border-2 border-slate-300 shadow-sm space-y-3"
            >
              {/* Top Row: Name, Unit, and Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded shadow-2xs">
                      {product.code}
                    </span>
                    <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-950 truncate mt-1">
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="p-2 border-2 border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
                    title="Edit Produk"
                  >
                    <Edit2 className="w-4 h-4 stroke-[2.2]" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Yakin ingin menghapus produk "${product.name}"?`
                        )
                      ) {
                        onDeleteProduct(product.id);
                      }
                    }}
                    className="p-2 border-2 border-rose-200 text-rose-700 hover:text-rose-950 hover:bg-rose-50 rounded-xl transition-colors shadow-2xs"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {/* Price & Margins Grid - High Contrast */}
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-3 rounded-xl border border-slate-300 text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-600 block">
                    Modal (HPP)
                  </span>
                  <span className="font-black text-slate-800 font-mono text-xs sm:text-sm">
                    {formatRupiah(product.costPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-600 block">
                    Harga Jual
                  </span>
                  <span className="font-black text-slate-950 font-mono text-xs sm:text-sm">
                    {formatRupiah(product.sellingPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-600 block">
                    Margin Profit
                  </span>
                  <span className="font-black text-emerald-800 font-mono text-xs sm:text-sm">
                    +{formatRupiah(margin)} ({marginPercent}%)
                  </span>
                </div>
              </div>

              {/* Inventory Position */}
              <div className="flex items-center justify-between text-xs pt-1 border-t-2 border-slate-100 font-bold">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Boxes className="w-4 h-4 text-slate-600 stroke-[2.2]" />
                  <span>Stok Gudang Induk:</span>
                  <strong className="text-slate-950 font-black font-mono">
                    {product.warehouseStock} {product.unit}
                  </strong>
                </div>

                <div className="text-xs text-slate-700 font-mono">
                  Tersebar di Toko:{' '}
                  <strong className="text-emerald-800 font-black">
                    {distributedQty} {product.unit}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
