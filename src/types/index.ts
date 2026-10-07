export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'sales_agent' | 'admin';
  lastLogin: string;
}

export interface BusinessProfile {
  name: string;
  ownerName: string;
  phone: string;
  address: string;
  logoUrl: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  invoiceNotes: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  unit: string; // e.g. "pcs", "pack", "box", "bks", "renceng"
  costPrice: number; // Harga Modal (HPP)
  sellingPrice: number; // Harga Jual Konsinyasi
  warehouseStock: number; // Qty Stok di Gudang Utama
  category: string;
  updatedAt: string;
}

export interface ConsignmentItem {
  productId: string;
  productName: string;
  unit: string;
  qty: number;
  costPrice: number;
  unitPrice: number;
  totalPrice: number;
}

export type ActivityLogType =
  | 'registration'
  | 'delivery'
  | 'payment'
  | 'return'
  | 'visit';

export interface ActivityLog {
  id: string;
  date: string;
  type: ActivityLogType;
  title: string;
  description: string;
  amount?: number;
  items?: ConsignmentItem[];
  invoiceId?: string;
  recordedBy?: string;
}

export interface StoreLocation {
  lat?: number;
  lng?: number;
  accuracy?: number;
  addressSnippet?: string;
  mapsUrl?: string;
}

export interface Store {
  id: string;
  code: string;
  name: string;
  ownerOrKeeper: string;
  phone: string;
  address: string;
  registrationDate: string;
  photoUrl: string;
  location: StoreLocation;
  status: 'active' | 'pending' | 'inactive';
  currentConsignment: ConsignmentItem[];
  totalReceivable: number; // Piutang / tagihan berjalan
  totalPaid: number; // Total sudah dibayar
  activityLogs: ActivityLog[];
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  storeId: string;
  storeName: string;
  storeOwner: string;
  storePhone: string;
  storeAddress: string;
  items: ConsignmentItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paidAmount: number;
  notes: string;
  createdAt: string;
}

export interface MarketingPlan {
  id: string;
  title: string;
  targetArea: string;
  type: 'canvassing' | 'margin_sharing' | 'pitch_script' | 'competitor_analysis' | 'follow_up';
  content: string;
  status: 'planned' | 'in_progress' | 'completed';
  date: string;
  tags: string[];
}

export type ThemeId = 'bright' | 'emerald' | 'dark' | 'neon' | 'blue' | 'red';

export interface AppState {
  user: UserProfile | null;
  businessProfile: BusinessProfile;
  products: Product[];
  stores: Store[];
  invoices: Invoice[];
  marketingPlans: MarketingPlan[];
  activeTab: 'dashboard' | 'stores' | 'inventory' | 'marketing' | 'reports';
  theme: ThemeId;
}
