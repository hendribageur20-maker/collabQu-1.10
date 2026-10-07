import { Invoice, Store, BusinessProfile } from '../types';

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat('id-ID').format(val);
}

export function formatDateIndo(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTimeIndo(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d) + ' WIB';
  } catch {
    return dateString;
  }
}

export function cleanPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function generateInvoiceNumber(existingCount: number = 0): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const rand = String(existingCount + 1).padStart(3, '0');
  return `INV/CQ/${year}${month}/${rand}`;
}

export function buildWhatsAppInvoiceUrl(invoice: Invoice, business: BusinessProfile): string {
  const phone = cleanPhoneForWhatsApp(invoice.storePhone);
  
  const itemsText = invoice.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}*\n   ${item.qty} ${item.unit} x ${formatRupiah(item.unitPrice)} = *${formatRupiah(item.totalPrice)}*`
    )
    .join('\n');

  const totalRestokQty = invoice.items.reduce((s, it) => s + it.qty, 0);
  const totalSetor = invoice.paidAmount || (invoice.paymentStatus === 'paid' ? invoice.total : 0);
  const tglUpdate = formatDateTimeIndo(invoice.createdAt || invoice.date);

  const statusText =
    invoice.paymentStatus === 'paid'
      ? '✅ LUNAS'
      : invoice.paymentStatus === 'partial'
      ? `🟡 SEBAGIAN (Sisa: ${formatRupiah(invoice.total - invoice.paidAmount)})`
      : '⏳ BELUM LUNAS (TITIP KONSINYASI)';

  const text = `*FAKTUR TITIP JUAL / KONSINYASI*
*${business.name.toUpperCase()}*
No. Faktur: *${invoice.invoiceNumber}*

Kepada Yth:
*${invoice.storeName}* (${invoice.storeOwner})
Alamat: ${invoice.storeAddress}

---------------------------------------
*Total terjual/setor:* ${formatRupiah(totalSetor)}
*Total retur:* 0 pcs (Faktur Baru)
*Total restok:* ${totalRestokQty} pcs (${formatRupiah(invoice.total)})
*Tgl update:* ${tglUpdate}
---------------------------------------

📦 *DAFTAR PRODUK DITITIPKAN:*
${itemsText}

💰 *TOTAL NILAI TITIPAN: ${formatRupiah(invoice.total)}*
*Status Pembayaran:* ${statusText}

${business.bankName ? `💳 *Rekening Pembayaran / Transfer:*\n${business.bankName}\nNo. Rek: *${business.bankAccountNumber}*\na.n: *${business.bankAccountHolder}*\n` : ''}
${invoice.notes ? `📝 *Catatan:*\n_${invoice.notes}_\n` : ''}
Terima kasih atas kerja samanya! 🙏
_Dibuat otomatis via Collab Qu 1.20_`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppStoreUpdateText(store: Store, business: BusinessProfile): string {
  // 1. Total terjual / setor
  const totalTerjualSetorNominal = store.totalPaid || 0;

  // 2. Total retur (dari riwayat aktivitas)
  const returnLogs = (store.activityLogs || []).filter((l) => l.type === 'return');
  const totalReturQty = returnLogs.reduce((acc, log) => {
    if (log.items && log.items.length > 0) {
      return acc + log.items.reduce((sum, item) => sum + item.qty, 0);
    }
    return acc;
  }, 0);
  const totalReturNominal = returnLogs.reduce((acc, log) => {
    if (log.items && log.items.length > 0) {
      return acc + log.items.reduce((sum, item) => sum + (item.totalPrice || item.qty * item.unitPrice), 0);
    }
    return acc + (log.amount || 0);
  }, 0);

  // 3. Total restok (dari delivery / registration)
  const restockLogs = (store.activityLogs || []).filter(
    (l) => l.type === 'delivery' || l.type === 'registration'
  );
  const totalRestokQty = restockLogs.reduce((acc, log) => {
    if (log.items && log.items.length > 0) {
      return acc + log.items.reduce((sum, item) => sum + item.qty, 0);
    }
    return acc;
  }, 0);
  const totalRestokNominal = restockLogs.reduce((acc, log) => {
    if (log.items && log.items.length > 0) {
      return acc + log.items.reduce((sum, item) => sum + (item.totalPrice || item.qty * item.unitPrice), 0);
    }
    return acc + (log.amount || 0);
  }, 0);

  // 4. Tgl update (tanggal aktivitas terakhir atau saat ini)
  const lastLogDate = store.activityLogs?.[0]?.date || new Date().toISOString();
  const tglUpdate = formatDateTimeIndo(lastLogDate);

  // Rincian stok titipan aktif saat ini
  const itemsText = store.currentConsignment.length > 0
    ? store.currentConsignment
        .map((item, idx) => `   ${idx + 1}. *${item.productName}*: ${item.qty} ${item.unit} (@ ${formatRupiah(item.unitPrice)}) = ${formatRupiah(item.totalPrice)}`)
        .join('\n')
    : '   - (Tidak ada sisa titipan aktif)';

  return `*UPDATE KONSINYASI / TITIP JUAL*
*${business.name.toUpperCase()}*

Kepada Yth:
Toko: *${store.name}*
Pemilik/PJ: ${store.ownerOrKeeper}
Alamat: ${store.address || '-'}

---------------------------------------
*Total terjual/setor:* ${formatRupiah(totalTerjualSetorNominal)}
*Total retur:* ${totalReturQty} pcs ${totalReturNominal > 0 ? `(${formatRupiah(totalReturNominal)})` : ''}
*Total restok:* ${totalRestokQty} pcs ${totalRestokNominal > 0 ? `(${formatRupiah(totalRestokNominal)})` : ''}
*Tgl update:* ${tglUpdate}
---------------------------------------

📦 *SISA STOK TITIPAN AKTIF:*
${itemsText}

💰 *Sisa Tagihan/Piutang:* *${formatRupiah(store.totalReceivable)}*

${business.bankName ? `💳 *Rekening Pembayaran / Transfer:*\n${business.bankName}\nNo. Rek: *${business.bankAccountNumber}*\na.n: *${business.bankAccountHolder}*\n` : ''}
${business.phone ? `📞 Kontak: ${business.phone}\n` : ''}Terima kasih atas kerja samanya! 🙏
_Update otomatis via Collab Qu 1.20_`;
}

export function buildWhatsAppStoreGreetingUrl(store: Store, business: BusinessProfile): string {
  const phone = cleanPhoneForWhatsApp(store.phone);
  const text = buildWhatsAppStoreUpdateText(store, business);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Compress an image file to base64 for lightweight LocalStorage persistence
 */
export async function compressImageFile(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
