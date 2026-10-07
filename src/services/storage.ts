import { AppState, Product, Store, Invoice, MarketingPlan, BusinessProfile, UserProfile, ThemeId } from '../types';

const STORAGE_KEY = 'collabqu_v1_20_store_data';
const AUTH_KEY = 'collabqu_v1_20_auth_user';
const THEME_KEY = 'collabqu_theme';

export const DEFAULT_LOGO = '/src/assets/images/collabqu_exact_logo_1791048642951.jpg';

export const DEFAULT_USER: UserProfile = {
  id: 'usr-google-hendri',
  name: 'Hendri Bageur',
  email: 'hendri.bageur20@gmail.com',
  avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
  role: 'owner',
  lastLogin: new Date().toISOString(),
};

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Berkah Snack Mandiri',
  ownerName: 'Hendri Bageur',
  phone: '08122334455',
  address: 'Jl. R.E. Martadinata No. 58, Citarum, Bandung, Jawa Barat',
  logoUrl: DEFAULT_LOGO,
  bankName: 'BCA (Bank Central Asia)',
  bankAccountNumber: '7720549210',
  bankAccountHolder: 'Hendri Bageur',
  invoiceNotes: 'Pembayaran dapat ditransfer atau disetor tunai saat jadwal penagihan sales. Barang rusak/bocor dapat diretur 100%.',
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    code: 'KRP-TMP-150',
    name: 'Keripik Tempe Renyah Gurih 150g',
    unit: 'pcs',
    costPrice: 8500,
    sellingPrice: 12000,
    warehouseStock: 140,
    category: 'Keripik',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'prod-002',
    code: 'KRP-SKG-200',
    name: 'Keripik Singkong Balado Pedas 200g',
    unit: 'pcs',
    costPrice: 7000,
    sellingPrice: 10000,
    warehouseStock: 210,
    category: 'Keripik',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'prod-003',
    code: 'BSR-STK-120',
    name: 'Basreng Stik Pedas Daun Jeruk 120g',
    unit: 'pcs',
    costPrice: 6000,
    sellingPrice: 9000,
    warehouseStock: 185,
    category: 'Snack Pedas',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'prod-004',
    code: 'MKR-KRK-100',
    name: 'Makaroni Kriuk Gurih Asin 100g',
    unit: 'pcs',
    costPrice: 4500,
    sellingPrice: 7000,
    warehouseStock: 320,
    category: 'Snack Pedas',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'prod-005',
    code: 'ROT-CKL-65',
    name: 'Roti Manis Cokelat Lumer 65g',
    unit: 'bks',
    costPrice: 3200,
    sellingPrice: 5000,
    warehouseStock: 95,
    category: 'Bakery',
    updatedAt: '2026-10-01T08:00:00Z',
  },
];

export const DEFAULT_STORES: Store[] = [
  {
    id: 'store-001',
    code: 'TK-001',
    name: 'Toko Kelontong Bu Hj. Rohanah',
    ownerOrKeeper: 'Ibu Hj. Rohanah',
    phone: '081298765432',
    address: 'Jl. Sukajadi No. 142, Sukajadi, Kota Bandung',
    registrationDate: '2026-09-20T10:15:00Z',
    photoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
    location: {
      lat: -6.8872,
      lng: 107.5947,
      accuracy: 12,
      addressSnippet: 'Sukajadi, Bandung (-6.8872, 107.5947)',
      mapsUrl: 'https://maps.google.com/?q=-6.8872,107.5947',
    },
    status: 'active',
    totalReceivable: 470000,
    totalPaid: 320000,
    currentConsignment: [
      {
        productId: 'prod-002',
        productName: 'Keripik Singkong Balado Pedas 200g',
        unit: 'pcs',
        qty: 25,
        costPrice: 7000,
        unitPrice: 10000,
        totalPrice: 250000,
      },
      {
        productId: 'prod-003',
        productName: 'Basreng Stik Pedas Daun Jeruk 120g',
        unit: 'pcs',
        qty: 20,
        costPrice: 6000,
        unitPrice: 9000,
        totalPrice: 180000,
      },
    ],
    activityLogs: [
      {
        id: 'log-001',
        date: '2026-09-20T10:15:00Z',
        type: 'registration',
        title: 'Registrasi Toko Baru',
        description: 'Toko resmi bermitra titip jual dengan batch perdana 45 pcs produk snack.',
        amount: 430000,
      },
      {
        id: 'log-002',
        date: '2026-09-27T14:30:00Z',
        type: 'payment',
        title: 'Setoran Penjualan Mingguan',
        description: 'Penyetoran omset tunai untuk batch pertama (32 pcs terjual habis).',
        amount: 320000,
      },
      {
        id: 'log-003',
        date: '2026-10-01T11:00:00Z',
        type: 'delivery',
        title: 'Restock Titipan Baru',
        description: 'Penambahan stok 25 pcs Keripik Singkong & 20 pcs Basreng Stik.',
        amount: 430000,
      },
    ],
    notes: 'Posisi etalase paling depan dekat kasir. Penjualan basreng sangat cepat, restock tiap Kamis.',
  },
  {
    id: 'store-002',
    code: 'TK-002',
    name: 'Warung Berkah Mas Joko',
    ownerOrKeeper: 'Mas Joko Susilo',
    phone: '085611223344',
    address: 'Jl. Cihampelas No. 98, Cihampelas, Kota Bandung',
    registrationDate: '2026-09-24T13:40:00Z',
    photoUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&auto=format&fit=crop&q=80',
    location: {
      lat: -6.8984,
      lng: 107.6041,
      accuracy: 15,
      addressSnippet: 'Cihampelas, Bandung (-6.8984, 107.6041)',
      mapsUrl: 'https://maps.google.com/?q=-6.8984,107.6041',
    },
    status: 'active',
    totalReceivable: 450000,
    totalPaid: 210000,
    currentConsignment: [
      {
        productId: 'prod-001',
        productName: 'Keripik Tempe Renyah Gurih 150g',
        unit: 'pcs',
        qty: 20,
        costPrice: 8500,
        unitPrice: 12000,
        totalPrice: 240000,
      },
      {
        productId: 'prod-004',
        productName: 'Makaroni Kriuk Gurih Asin 100g',
        unit: 'pcs',
        qty: 30,
        costPrice: 4500,
        unitPrice: 7000,
        totalPrice: 210000,
      },
    ],
    activityLogs: [
      {
        id: 'log-004',
        date: '2026-09-24T13:40:00Z',
        type: 'registration',
        title: 'Registrasi & Titip Perdana',
        description: 'Kesepakatan titip jual 50 bungkus snack dengan margin toko Rp 2.000/pcs.',
        amount: 450000,
      },
      {
        id: 'log-005',
        date: '2026-10-02T16:00:00Z',
        type: 'payment',
        title: 'Pembayaran Sebagian',
        description: 'Setoran hasil laku Makaroni 30 pcs.',
        amount: 210000,
      },
    ],
    notes: 'Dekat kost mahasiswa, sering ramai sore menjelang malam.',
  },
  {
    id: 'store-003',
    code: 'TK-003',
    name: 'Minimarket Pojok Sari',
    ownerOrKeeper: 'Pak Hendra Pratama',
    phone: '087822334455',
    address: 'Jl. Dipati Ukur No. 45, Coblong, Kota Bandung',
    registrationDate: '2026-09-28T09:20:00Z',
    photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    location: {
      lat: -6.8925,
      lng: 107.6186,
      accuracy: 8,
      addressSnippet: 'Dipati Ukur, Bandung (-6.8925, 107.6186)',
      mapsUrl: 'https://maps.google.com/?q=-6.8925,107.6186',
    },
    status: 'active',
    totalReceivable: 590000,
    totalPaid: 0,
    currentConsignment: [
      {
        productId: 'prod-003',
        productName: 'Basreng Stik Pedas Daun Jeruk 120g',
        unit: 'pcs',
        qty: 40,
        costPrice: 6000,
        unitPrice: 9000,
        totalPrice: 360000,
      },
      {
        productId: 'prod-005',
        productName: 'Roti Manis Cokelat Lumer 65g',
        unit: 'bks',
        qty: 25,
        costPrice: 3200,
        unitPrice: 5000,
        totalPrice: 125000,
      },
    ],
    activityLogs: [
      {
        id: 'log-006',
        date: '2026-09-28T09:20:00Z',
        type: 'registration',
        title: 'Registrasi & Titipan Baru',
        description: 'Titip konsinyasi 65 pcs produk snack & bakery di rak gondola utama.',
        amount: 485000,
      },
    ],
    notes: 'Jatuh tempo pemeriksaan pertama tgl 05 Oktober 2026.',
  },
];

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV/CQ/202610/001',
    date: '2026-10-01T11:00:00Z',
    storeId: 'store-001',
    storeName: 'Toko Kelontong Bu Hj. Rohanah',
    storeOwner: 'Ibu Hj. Rohanah',
    storePhone: '081298765432',
    storeAddress: 'Jl. Sukajadi No. 142, Sukajadi, Kota Bandung',
    items: [
      {
        productId: 'prod-002',
        productName: 'Keripik Singkong Balado Pedas 200g',
        unit: 'pcs',
        qty: 25,
        costPrice: 7000,
        unitPrice: 10000,
        totalPrice: 250000,
      },
      {
        productId: 'prod-003',
        productName: 'Basreng Stik Pedas Daun Jeruk 120g',
        unit: 'pcs',
        qty: 20,
        costPrice: 6000,
        unitPrice: 9000,
        totalPrice: 180000,
      },
    ],
    subtotal: 430000,
    discount: 0,
    total: 430000,
    paymentStatus: 'unpaid',
    paidAmount: 0,
    notes: 'Faktur titip konsinyasi periode awal Oktober. Jadwal setor setiap hari Kamis.',
    createdAt: '2026-10-01T11:00:00Z',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV/CQ/202609/008',
    date: '2026-09-24T13:40:00Z',
    storeId: 'store-002',
    storeName: 'Warung Berkah Mas Joko',
    storeOwner: 'Mas Joko Susilo',
    storePhone: '085611223344',
    storeAddress: 'Jl. Cihampelas No. 98, Cihampelas, Kota Bandung',
    items: [
      {
        productId: 'prod-001',
        productName: 'Keripik Tempe Renyah Gurih 150g',
        unit: 'pcs',
        qty: 20,
        costPrice: 8500,
        unitPrice: 12000,
        totalPrice: 240000,
      },
      {
        productId: 'prod-004',
        productName: 'Makaroni Kriuk Gurih Asin 100g',
        unit: 'pcs',
        qty: 30,
        costPrice: 4500,
        unitPrice: 7000,
        totalPrice: 210000,
      },
    ],
    subtotal: 450000,
    discount: 0,
    total: 450000,
    paymentStatus: 'partial',
    paidAmount: 210000,
    notes: 'Faktur titip konsinyasi. Sudah setor Makaroni Rp 210.000.',
    createdAt: '2026-09-24T13:40:00Z',
  },
];

export const DEFAULT_MARKETING_PLANS: MarketingPlan[] = [
  {
    id: 'mkt-001',
    title: 'Script Penawaran Titip Jual ke Warung Baru',
    targetArea: 'Kecamatan Coblong & Sukajadi',
    type: 'pitch_script',
    content: `Assalamu'alaikum / Selamat siang Bapak/Ibu pemilik toko.
Perkenalkan saya Hendri dari Berkah Snack Mandiri (CollabQu).

Kami mau menawarkan kerja sama titip jual (konsinyasi) aneka snack best seller (Keripik Singkong Balado & Basreng Daun Jeruk):
1. Bapak/Ibu TIDAK PERLU MODAL sepeserpun di awal.
2. Kami sediakan toples/display rak gratis.
3. Margin keuntungan toko Rp 2.000 s/d Rp 3.500 per bungkus.
4. Kami ganti 100% jika ada barang melempem atau expired (garansi retur).
5. Pembayaran HANYA untuk barang yang laku terjual saat kunjungan mingguan kami.

Boleh kami titip 10-15 bungkus terlebih dahulu untuk tes pasar di etalase depan?`,
    status: 'in_progress',
    date: '2026-10-01',
    tags: ['Script', 'Pitching', 'Garansi Retur', 'No Modal'],
  },
  {
    id: 'mkt-002',
    title: 'Skema Margin Bagi Hasil Konsinyasi 20% & Bonus Penjualan',
    targetArea: 'Seluruh Mitra Toko',
    type: 'margin_sharing',
    content: `Panduan penetapan margin titip jual:
- Harga Titip dari Supplier: Rp 7.000
- Harga Jual ke Konsumen: Rp 9.000 - Rp 10.000 (Margin toko: 22 - 30%)
- Program Bonus: Toko yang berhasil menjual >100 pcs per bulan mendapatkan insentif tunai ekstra Rp 50.000 atau tambahan free produk 5 pcs.
- Display Hook: Letakkan sejajar mata (eye-level) di sebelah meja kasir untuk impuls purchase.`,
    status: 'completed',
    date: '2026-09-25',
    tags: ['Bagi Hasil', 'Insentif', 'Display Toko'],
  },
  {
    id: 'mkt-003',
    title: 'Target Canvassing 20 Toko & Kantin Area Kampus',
    targetArea: 'Jl. Dipati Ukur - Tamansari',
    type: 'canvassing',
    content: `Targeting toko kelontong, warmindo, dan kantin mahasiswa:
1. Target: 20 toko baru dalam bulan Oktober 2026.
2. Kriteria: Toko yang buka sampai jam 21.00 malam dan berada di jalan ramai mahasiswa.
3. Produk prioritas: Basreng Daun Jeruk dan Makaroni Pedas.
4. Jadwal canvassing: Setiap Selasa & Kamis pukul 09.30 - 13.00 WIB.`,
    status: 'in_progress',
    date: '2026-10-02',
    tags: ['Canvassing', 'Kampus', 'Target Toko'],
  },
];

export function getInitialAppState(): AppState {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    const rawAuth = localStorage.getItem(AUTH_KEY);
    const savedTheme = (localStorage.getItem(THEME_KEY) as ThemeId) || 'bright';

    let user: UserProfile | null = DEFAULT_USER;
    if (rawAuth) {
      user = JSON.parse(rawAuth);
    } else {
      // Auto login as requested
      localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_USER));
    }

    if (rawData) {
      const parsed = JSON.parse(rawData);
      return {
        user,
        businessProfile: {
          ...DEFAULT_BUSINESS_PROFILE,
          ...(parsed.businessProfile || {}),
          logoUrl: DEFAULT_LOGO,
        },
        products: parsed.products || DEFAULT_PRODUCTS,
        stores: parsed.stores || DEFAULT_STORES,
        invoices: parsed.invoices || DEFAULT_INVOICES,
        marketingPlans: parsed.marketingPlans || DEFAULT_MARKETING_PLANS,
        activeTab: parsed.activeTab || 'dashboard',
        theme: savedTheme || parsed.theme || 'bright',
      };
    }
  } catch (err) {
    console.error('Error loading CollabQu data from localStorage:', err);
  }

  return {
    user: DEFAULT_USER,
    businessProfile: DEFAULT_BUSINESS_PROFILE,
    products: DEFAULT_PRODUCTS,
    stores: DEFAULT_STORES,
    invoices: DEFAULT_INVOICES,
    marketingPlans: DEFAULT_MARKETING_PLANS,
    activeTab: 'dashboard',
    theme: 'bright',
  };
}

export function saveAppState(state: AppState): void {
  try {
    const payload = {
      businessProfile: state.businessProfile,
      products: state.products,
      stores: state.stores,
      invoices: state.invoices,
      marketingPlans: state.marketingPlans,
      activeTab: state.activeTab,
      theme: state.theme,
      lastSaved: new Date().toISOString(),
      appVersion: 'CollabQu 1.20',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (state.theme) {
      localStorage.setItem(THEME_KEY, state.theme);
    }
    if (state.user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (err) {
    console.error('Error saving CollabQu data to localStorage:', err);
  }
}

export function exportAppStateJson(state: AppState): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: 'CollabQu 1.20',
    businessProfile: state.businessProfile,
    products: state.products,
    stores: state.stores,
    invoices: state.invoices,
    marketingPlans: state.marketingPlans,
  };
  return JSON.stringify(exportData, null, 2);
}

export function parseAndValidateImport(jsonString: string): Partial<AppState> {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Format file JSON tidak valid.');
  }

  const result: Partial<AppState> = {};

  if (parsed.businessProfile && typeof parsed.businessProfile === 'object') {
    result.businessProfile = parsed.businessProfile;
  }
  if (Array.isArray(parsed.products)) {
    result.products = parsed.products;
  }
  if (Array.isArray(parsed.stores)) {
    result.stores = parsed.stores;
  }
  if (Array.isArray(parsed.invoices)) {
    result.invoices = parsed.invoices;
  }
  if (Array.isArray(parsed.marketingPlans)) {
    result.marketingPlans = parsed.marketingPlans;
  }

  return result;
}

export function resetAllData(): AppState {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_USER));
  localStorage.setItem(THEME_KEY, 'bright');
  return {
    user: DEFAULT_USER,
    businessProfile: DEFAULT_BUSINESS_PROFILE,
    products: DEFAULT_PRODUCTS,
    stores: DEFAULT_STORES,
    invoices: DEFAULT_INVOICES,
    marketingPlans: DEFAULT_MARKETING_PLANS,
    activeTab: 'dashboard',
    theme: 'bright',
  };
}
