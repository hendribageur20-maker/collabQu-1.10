import React, { useState } from 'react';
import {
  X,
  Printer,
  Share2,
  Copy,
  Check,
  Building2,
  MessageCircle,
  FileCheck,
} from 'lucide-react';
import { Invoice, BusinessProfile } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  buildWhatsAppInvoiceUrl,
} from '../utils/formatters';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  business: BusinessProfile;
  onUpdateStatus?: (
    invoiceId: string,
    status: 'unpaid' | 'partial' | 'paid',
    paidAmount: number
  ) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  business,
  onUpdateStatus,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const url = buildWhatsAppInvoiceUrl(invoice, business);
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const itemsText = invoice.items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.productName} (${it.qty} ${it.unit} x ${formatRupiah(it.unitPrice)}) = ${formatRupiah(it.totalPrice)}`
      )
      .join('\n');

    const raw = `FAKTUR TITIP JUAL / KONSINYASI
${business.name}
No. Faktur: ${invoice.invoiceNumber}
Tanggal: ${formatDateIndo(invoice.date)}
Toko: ${invoice.storeName} (${invoice.storeOwner})
Alamat: ${invoice.storeAddress}

Daftar Titipan:
${itemsText}

TOTAL: ${formatRupiah(invoice.total)}
Status: ${invoice.paymentStatus.toUpperCase()}

Transfer:
${business.bankName} - ${business.bankAccountNumber} (a.n ${business.bankAccountHolder})`;

    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Navigation / Action Top Bar */}
        <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800">
              Faktur Konsinyasi
            </span>
            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
              {invoice.invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              title="Print atau Simpan ke PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyText}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              title="Salin Rincian Teks"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-4 sm:p-6 overflow-y-auto invoice-printable space-y-4 bg-white text-slate-900">
          {/* Invoice Header */}
          <div className="border-b border-slate-200 pb-3 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-emerald-700" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {business.name}
                </h3>
                <p className="text-[11px] text-slate-500 max-w-xs leading-snug">
                  {business.address}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  WhatsApp: {business.phone}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                FAKTUR TITIP JUAL
              </span>
              <span className="text-xs font-bold font-mono text-emerald-800 block">
                {invoice.invoiceNumber}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {formatDateIndo(invoice.date)}
              </span>
            </div>
          </div>

          {/* Store Recipient Information */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Dititipkan Kepada:
              </span>
              <p className="font-bold text-slate-900 text-xs">
                {invoice.storeName}
              </p>
              <p className="text-[11px] text-slate-600">
                PJ: {invoice.storeOwner}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                WA: {invoice.storePhone}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Alamat Kunjungan:
              </span>
              <p className="text-[11px] text-slate-600 leading-tight">
                {invoice.storeAddress || '-'}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500">
                  Status:
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    invoice.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : invoice.paymentStatus === 'partial'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {invoice.paymentStatus === 'paid'
                    ? 'LUNAS'
                    : invoice.paymentStatus === 'partial'
                    ? 'DIBAYAR SEBAGIAN'
                    : 'BELUM LUNAS (KONSINYASI)'}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="py-2 pr-2">Barang</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Harga Satuan</th>
                  <th className="py-2 pl-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 pr-2 font-medium text-slate-900">
                      {item.productName}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600 font-mono">
                      {item.qty} {item.unit}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-600 font-mono">
                      {formatRupiah(item.unitPrice)}
                    </td>
                    <td className="py-2.5 pl-2 text-right font-bold text-slate-900 font-mono">
                      {formatRupiah(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Summary */}
          <div className="border-t border-slate-200 pt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">{formatRupiah(invoice.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-xs text-rose-600">
                <span>Potongan / Retur:</span>
                <span className="font-mono">
                  - {formatRupiah(invoice.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-1.5">
              <span>Total Tagihan Titipan:</span>
              <span className="font-mono text-emerald-700 text-base">
                {formatRupiah(invoice.total)}
              </span>
            </div>
            {invoice.paidAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-700">
                <span>Sudah Disetor:</span>
                <span className="font-mono">
                  {formatRupiah(invoice.paidAmount)}
                </span>
              </div>
            )}
            {invoice.total - invoice.paidAmount > 0 && (
              <div className="flex justify-between text-xs font-semibold text-rose-700">
                <span>Sisa Piutang:</span>
                <span className="font-mono">
                  {formatRupiah(invoice.total - invoice.paidAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Bank Payment Info */}
          {business.bankName && (
            <div className="p-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-[11px] space-y-0.5">
              <span className="font-bold text-slate-700 block">
                Info Rekening Pembayaran / Transfer:
              </span>
              <p className="text-slate-600">
                {business.bankName} - No. Rek:{' '}
                <strong className="text-slate-900 font-mono">
                  {business.bankAccountNumber}
                </strong>{' '}
                (a.n {business.bankAccountHolder})
              </p>
              {business.invoiceNotes && (
                <p className="text-slate-500 italic text-[10px] pt-1">
                  Catatan: {business.invoiceNotes}
                </p>
              )}
            </div>
          )}

          {/* Signatures for Print */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs text-slate-600">
            <div>
              <p className="text-[11px]">Toko Penerima Titipan,</p>
              <div className="h-12"></div>
              <p className="font-bold underline text-slate-800">
                ( {invoice.storeOwner} )
              </p>
            </div>
            <div>
              <p className="text-[11px]">Pengirim / Sales CollabQu,</p>
              <div className="h-12"></div>
              <p className="font-bold underline text-slate-800">
                ( {business.ownerName} )
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions for Screen / Mobile */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 no-print flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={handleSendWhatsApp}
            className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Kirim via WhatsApp
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto py-2.5 px-4 border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Cetak / Simpan PDF
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-3 text-slate-500 hover:text-slate-700 text-xs font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
