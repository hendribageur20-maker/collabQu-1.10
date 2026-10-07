import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  AppState,
  Store,
  Product,
  Invoice,
  MarketingPlan,
  BusinessProfile,
  UserProfile,
  ConsignmentItem,
} from './types';
import {
  getInitialAppState,
  saveAppState,
  resetAllData,
} from './services/storage';
import { generateInvoiceNumber } from './utils/formatters';

// Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { StoreRegistrationModal } from './components/StoreRegistrationModal';
import { InvoiceModal } from './components/InvoiceModal';
import { StoreDetailModal } from './components/StoreDetailModal';
import { ProductModal } from './components/ProductModal';
import { MarketingModal } from './components/MarketingModal';
import { SettingsModal } from './components/SettingsModal';
import { LoginScreen } from './components/LoginScreen';

// Views
import { DashboardView } from './views/DashboardView';
import { StoresView } from './views/StoresView';
import { InventoryView } from './views/InventoryView';
import { MarketingView } from './views/MarketingView';
import { ReportsView } from './views/ReportsView';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => getInitialAppState());

  // Navigation State
  const [activeTab, setActiveTab] = useState<AppState['activeTab']>(
    appState.activeTab || 'dashboard'
  );

  // Modal States
  const [isStoreRegOpen, setIsStoreRegOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Synchronize activeTab with state and save on change
  useEffect(() => {
    saveAppState({ ...appState, activeTab });
  }, [appState, activeTab]);

  // Keep selectedStore in sync with latest store data
  useEffect(() => {
    if (selectedStore) {
      const fresh = appState.stores.find((s) => s.id === selectedStore.id);
      if (fresh) setSelectedStore(fresh);
    }
  }, [appState.stores]);

  // Handle Save New Store Registration
  const handleSaveStore = (newStore: Store, generateInvoice: boolean) => {
    // 1. Deduct consignment quantities from warehouse stocks
    const updatedProducts = appState.products.map((prod) => {
      const consigned = newStore.currentConsignment.find(
        (c) => c.productId === prod.id
      );
      if (consigned) {
        return {
          ...prod,
          warehouseStock: Math.max(0, prod.warehouseStock - consigned.qty),
        };
      }
      return prod;
    });

    // 2. Generate invoice if requested or default
    let createdInvoice: Invoice | null = null;
    const invNumber = generateInvoiceNumber(appState.invoices.length);

    createdInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      date: newStore.registrationDate,
      storeId: newStore.id,
      storeName: newStore.name,
      storeOwner: newStore.ownerOrKeeper,
      storePhone: newStore.phone,
      storeAddress: newStore.address,
      items: newStore.currentConsignment,
      subtotal: newStore.totalReceivable,
      discount: 0,
      total: newStore.totalReceivable,
      paymentStatus: 'unpaid',
      paidAmount: 0,
      notes: `Faktur kemitraan konsinyasi perdana. ${newStore.notes || ''}`,
      createdAt: new Date().toISOString(),
    };

    // Update store activity log with invoice number
    newStore.activityLogs[0].invoiceId = createdInvoice.id;

    // Save to AppState
    setAppState((prev) => ({
      ...prev,
      stores: [newStore, ...prev.stores],
      products: updatedProducts,
      invoices: createdInvoice
        ? [createdInvoice, ...prev.invoices]
        : prev.invoices,
    }));

    setIsStoreRegOpen(false);

    // Confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    if (generateInvoice && createdInvoice) {
      setActiveInvoice(createdInvoice);
    }
  };

  // Handle Record Payment
  const handleRecordPayment = (
    storeId: string,
    amount: number,
    notes: string
  ) => {
    setAppState((prev) => {
      const updatedStores = prev.stores.map((s) => {
        if (s.id !== storeId) return s;

        const newReceivable = Math.max(0, s.totalReceivable - amount);
        const newPaid = s.totalPaid + amount;

        const newLog = {
          id: `log-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'payment' as const,
          title: 'Setoran Uang Penjualan',
          description:
            notes || `Setoran pembayaran konsinyasi diterima sebesar Rp ${amount}.`,
          amount,
        };

        return {
          ...s,
          totalReceivable: newReceivable,
          totalPaid: newPaid,
          activityLogs: [newLog, ...(s.activityLogs || [])],
        };
      });

      return {
        ...prev,
        stores: updatedStores,
      };
    });

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  // Handle Add Delivery / Restock
  const handleAddDelivery = (
    storeId: string,
    newItems: ConsignmentItem[],
    notes: string
  ) => {
    const additionalTotal = newItems.reduce((s, i) => s + i.totalPrice, 0);

    setAppState((prev) => {
      // Deduct warehouse stocks
      const updatedProducts = prev.products.map((prod) => {
        const delivered = newItems.find((i) => i.productId === prod.id);
        if (delivered) {
          return {
            ...prod,
            warehouseStock: Math.max(0, prod.warehouseStock - delivered.qty),
          };
        }
        return prod;
      });

      const updatedStores = prev.stores.map((s) => {
        if (s.id !== storeId) return s;

        // Merge or append consignment items
        const merged = [...s.currentConsignment];
        for (const item of newItems) {
          const existingIdx = merged.findIndex(
            (m) => m.productId === item.productId
          );
          if (existingIdx >= 0) {
            merged[existingIdx] = {
              ...merged[existingIdx],
              qty: merged[existingIdx].qty + item.qty,
              totalPrice:
                merged[existingIdx].totalPrice + item.totalPrice,
            };
          } else {
            merged.push(item);
          }
        }

        const newLog = {
          id: `log-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'delivery' as const,
          title: 'Restock / Titip Baru',
          description:
            notes ||
            `Penambahan ${newItems.reduce(
              (acc, it) => acc + it.qty,
              0
            )} pcs barang titipan baru senilai Rp ${additionalTotal}.`,
          amount: additionalTotal,
          items: newItems,
        };

        return {
          ...s,
          currentConsignment: merged,
          totalReceivable: s.totalReceivable + additionalTotal,
          activityLogs: [newLog, ...(s.activityLogs || [])],
        };
      });

      // Generate invoice for this restock
      const storeTarget = prev.stores.find((st) => st.id === storeId);
      const newInv: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: generateInvoiceNumber(prev.invoices.length),
        date: new Date().toISOString(),
        storeId,
        storeName: storeTarget?.name || 'Toko Mitra',
        storeOwner: storeTarget?.ownerOrKeeper || 'PJ Toko',
        storePhone: storeTarget?.phone || '',
        storeAddress: storeTarget?.address || '',
        items: newItems,
        subtotal: additionalTotal,
        discount: 0,
        total: additionalTotal,
        paymentStatus: 'unpaid',
        paidAmount: 0,
        notes: `Restock barang titipan. ${notes || ''}`,
        createdAt: new Date().toISOString(),
      };

      return {
        ...prev,
        products: updatedProducts,
        stores: updatedStores,
        invoices: [newInv, ...prev.invoices],
      };
    });
  };

  // Handle Record Return
  const handleRecordReturn = (
    storeId: string,
    returnItems: ConsignmentItem[],
    notes: string
  ) => {
    const returnTotal = returnItems.reduce((s, i) => s + i.totalPrice, 0);

    setAppState((prev) => {
      // Put back to warehouse stock
      const updatedProducts = prev.products.map((prod) => {
        const ret = returnItems.find((r) => r.productId === prod.id);
        if (ret) {
          return {
            ...prod,
            warehouseStock: prod.warehouseStock + ret.qty,
          };
        }
        return prod;
      });

      const updatedStores = prev.stores.map((s) => {
        if (s.id !== storeId) return s;

        // Reduce from current consignment
        const updatedConsign = s.currentConsignment
          .map((item) => {
            const ret = returnItems.find((r) => r.productId === item.productId);
            if (ret) {
              const newQty = Math.max(0, item.qty - ret.qty);
              return {
                ...item,
                qty: newQty,
                totalPrice: newQty * item.unitPrice,
              };
            }
            return item;
          })
          .filter((item) => item.qty > 0);

        const newLog = {
          id: `log-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'return' as const,
          title: 'Retur Barang Titip',
          description:
            notes ||
            `Retur ${returnItems.reduce(
              (a, b) => a + b.qty,
              0
            )} pcs barang dari toko.`,
          amount: returnTotal,
          items: returnItems,
        };

        return {
          ...s,
          currentConsignment: updatedConsign,
          totalReceivable: Math.max(0, s.totalReceivable - returnTotal),
          activityLogs: [newLog, ...(s.activityLogs || [])],
        };
      });

      return {
        ...prev,
        products: updatedProducts,
        stores: updatedStores,
      };
    });
  };

  // View store invoice
  const handleViewStoreInvoice = (storeId: string) => {
    const inv = appState.invoices.find((i) => i.storeId === storeId);
    if (inv) {
      setActiveInvoice(inv);
    } else {
      // Create temporary invoice from current consignment
      const store = appState.stores.find((s) => s.id === storeId);
      if (!store) return;

      const dynamicInv: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: generateInvoiceNumber(appState.invoices.length),
        date: new Date().toISOString(),
        storeId: store.id,
        storeName: store.name,
        storeOwner: store.ownerOrKeeper,
        storePhone: store.phone,
        storeAddress: store.address,
        items: store.currentConsignment,
        subtotal: store.totalReceivable,
        discount: 0,
        total: store.totalReceivable,
        paymentStatus: store.totalReceivable === 0 ? 'paid' : 'unpaid',
        paidAmount: store.totalPaid,
        notes: 'Faktur rincian konsinyasi berjalan.',
        createdAt: new Date().toISOString(),
      };
      setActiveInvoice(dynamicInv);
    }
  };

  // Product Actions
  const handleSaveProduct = (product: Product) => {
    setAppState((prev) => {
      const exists = prev.products.some((p) => p.id === product.id);
      return {
        ...prev,
        products: exists
          ? prev.products.map((p) => (p.id === product.id ? product : p))
          : [...prev.products, product],
      };
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setAppState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  // Marketing Actions
  const handleSaveMarketingPlan = (plan: MarketingPlan) => {
    setAppState((prev) => ({
      ...prev,
      marketingPlans: [plan, ...prev.marketingPlans],
    }));
  };

  const handleDeleteMarketingPlan = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      marketingPlans: prev.marketingPlans.filter((p) => p.id !== id),
    }));
  };

  // Settings Actions
  const handleUpdateBusiness = (updated: BusinessProfile) => {
    setAppState((prev) => ({
      ...prev,
      businessProfile: updated,
    }));
  };

  const handleRestoreState = (restored: Partial<AppState>) => {
    setAppState((prev) => ({
      ...prev,
      ...restored,
    }));
  };

  const handleResetApp = () => {
    const clean = resetAllData();
    setAppState(clean);
    setActiveTab('dashboard');
  };

  // If user is not logged in, show the pristine Collab Qu 1.20 Google Login Screen
  if (!appState.user) {
    return (
      <div data-theme={appState.theme || 'bright'}>
        <LoginScreen
          onLogin={(usr) => {
            setAppState((prev) => ({ ...prev, user: usr }));
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col items-center">
      {/* Expanded Container with dynamic data-theme */}
      <div
        data-theme={appState.theme || 'bright'}
        className="w-full max-w-3xl min-h-screen bg-slate-50/50 shadow-2xl flex flex-col relative border-x border-slate-200 transition-colors duration-200"
      >
        {/* Top App Header */}
        <Header
          business={appState.businessProfile}
          user={appState.user}
          onOpenStoreRegistration={() => setIsStoreRegOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Main View Area with generous paddings */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              appState={appState}
              onOpenStoreRegistration={() => setIsStoreRegOpen(true)}
              onSelectStore={(st) => setSelectedStore(st)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenMarketingScript={() => setActiveTab('marketing')}
            />
          )}

          {activeTab === 'stores' && (
            <StoresView
              stores={appState.stores}
              business={appState.businessProfile}
              onSelectStore={(st) => setSelectedStore(st)}
              onOpenStoreRegistration={() => setIsStoreRegOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={appState.products}
              stores={appState.stores}
              onOpenAddProduct={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              onEditProduct={(p) => {
                setProductToEdit(p);
                setIsProductModalOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'marketing' && (
            <MarketingView
              plans={appState.marketingPlans}
              onOpenAddPlan={() => setIsMarketingModalOpen(true)}
              onDeletePlan={handleDeleteMarketingPlan}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              appState={appState}
              onSelectStore={(st) => setSelectedStore(st)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
        </main>

        {/* Fixed Mobile Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          storeCount={appState.stores.length}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* MODALS */}
        {/* 1. Store Registration Modal */}
        <StoreRegistrationModal
          isOpen={isStoreRegOpen}
          onClose={() => setIsStoreRegOpen(false)}
          products={appState.products}
          onSaveStore={handleSaveStore}
        />

        {/* 2. Invoice Modal */}
        <InvoiceModal
          isOpen={Boolean(activeInvoice)}
          onClose={() => setActiveInvoice(null)}
          invoice={activeInvoice}
          business={appState.businessProfile}
        />

        {/* 3. Store Detail & Activity History Modal */}
        <StoreDetailModal
          isOpen={Boolean(selectedStore)}
          onClose={() => setSelectedStore(null)}
          store={selectedStore}
          products={appState.products}
          business={appState.businessProfile}
          onAddDelivery={handleAddDelivery}
          onRecordPayment={handleRecordPayment}
          onRecordReturn={handleRecordReturn}
          onViewInvoice={handleViewStoreInvoice}
        />

        {/* 4. Product Modal (Add/Edit) */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setProductToEdit(null);
          }}
          productToEdit={productToEdit}
          onSaveProduct={handleSaveProduct}
        />

        {/* 5. Marketing Modal */}
        <MarketingModal
          isOpen={isMarketingModalOpen}
          onClose={() => setIsMarketingModalOpen(false)}
          onSavePlan={handleSaveMarketingPlan}
        />

        {/* 6. Settings & Backup/Restore Modal with Theme Switcher */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          business={appState.businessProfile}
          appState={appState}
          currentTheme={appState.theme || 'bright'}
          onSelectTheme={(theme) =>
            setAppState((prev) => ({ ...prev, theme }))
          }
          onUpdateBusiness={handleUpdateBusiness}
          onRestoreState={handleRestoreState}
          onResetApp={handleResetApp}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* 7. Google Auth Modal */}
        <GoogleAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={appState.user}
          onLogin={(usr) => {
            setAppState((prev) => ({ ...prev, user: usr }));
            setIsAuthModalOpen(false);
          }}
          onLogout={() => {
            setAppState((prev) => ({ ...prev, user: null }));
          }}
        />
      </div>
    </div>
  );
}
