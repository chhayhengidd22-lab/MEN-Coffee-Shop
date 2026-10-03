import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { translations } from '../i18n/translations';
import { OrderStatus, TableStatus, UserRole, User, Product, ProductCategory, Order } from '../types';
import { PrintableReceiptModal } from './PrintableReceiptModal';
import {
  Shield,
  TrendingUp,
  Clock,
  Package,
  Users,
  Grid,
  Calendar,
  Ticket,
  ScrollText,
  KeyRound,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Settings,
  Image as ImageIcon,
  Edit,
  Search,
  Filter,
  DollarSign,
  Coffee,
  Sparkles,
  Phone,
  Mail,
  Check,
  Eye,
  Store,
  Sliders,
  Printer,
  ArrowDownRight,
  ArrowUpRight,
  History,
  Truck,
  Upload,
  Camera,
  MapPin,
  Copy,
  FileText,
  Utensils,
  ShoppingBag,
  ChefHat,
  CheckSquare,
  Square,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    user,
    users,
    logs,
    logout,
    addNewStaffMember,
    updateUser,
    updateUserRole,
    deleteUser,
    changePassword,
    isSuperAdmin,
  } = useAuth();

  const {
    orders,
    products,
    tables,
    reservations,
    coupons,
    reviews,
    storeSettings,
    updateStoreSettings,
    updateOrderStatus,
    updateTableStatus,
    updateProductStock,
    restockProduct,
    stockMovements,
    addNewProduct,
    updateProduct,
    deleteProduct,
    updateReservationStatus,
    deleteReservation,
    addNewCoupon,
    toggleCouponActive,
    approveReview,
    language,
    showToast,
  } = useStore();

  const t = translations[language];

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'settings' | 'users' | 'orders' | 'inventory' | 'tables' | 'reservations' | 'logs' | 'coupons' | 'password'
  >('analytics');

  // STORE SETTINGS STATE
  const [settingsForm, setSettingsForm] = useState({
    shopName: storeSettings.shopName,
    shopNameKh: storeSettings.shopNameKh,
    logo: storeSettings.logo,
    heroBackground: storeSettings.heroBackground,
    tagline: storeSettings.tagline,
    taglineKh: storeSettings.taglineKh,
    contactPhone: storeSettings.contactPhone,
    contactEmail: storeSettings.contactEmail,
    address: storeSettings.address,
    openingHours: storeSettings.openingHours,
    taxRate: storeSettings.taxRate,
    freeDeliveryThreshold: storeSettings.freeDeliveryThreshold,
    deliveryFee: storeSettings.deliveryFee,
  });

  // Preset images for hero background
  const heroBackgroundPresets = [
    {
      label: 'Artisanal Roastery Interior (AI Studio)',
      url: '/src/assets/images/hero_artisanal_cafe_1790122506662.jpg',
    },
    {
      label: 'Cafe Roastery Lounge (AI Studio)',
      url: '/src/assets/images/cafe_roastery_lounge_1790122546826.jpg',
    },
    {
      label: 'Minimal Roastery Bar',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=80',
    },
    {
      label: 'Warm Espresso Craft',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=80',
    },
    {
      label: 'Contemporary Cafe Counter',
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=80',
    },
    {
      label: 'Artisanal Pour-over Lab',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=2000&q=80',
    },
  ];

  const logoPresets = [
    {
      label: 'Default AURA Icon',
      url: '/coffee-icon.svg',
    },
    {
      label: 'Golden Bean Emblem',
      url: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=200&q=80',
    },
    {
      label: 'Organic Botanical Bean',
      url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=200&q=80',
    },
    {
      label: 'Minimalist Roaster Mark',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80',
    },
  ];

  // Handle Logo file upload (reads file to base64 Data URL)
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast(
        language === 'kh'
          ? 'សូមជ្រើសរើសឯកសារជារូបភាព (PNG, JPG, WEBP, SVG)'
          : 'Please select an image file',
        'error'
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(
        language === 'kh'
          ? 'ទំហំរូបភាពធំពេក សូមជ្រើសរូបតូចជាង 5MB'
          : 'Image file size too large (max 5MB)',
        'error'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSettingsForm((prev) => ({ ...prev, logo: dataUrl }));
        showToast(
          language === 'kh'
            ? 'បានបញ្ចូលរូប Logo ថ្មីជោគជ័យ! សូមចុច "រក្សាទុកការផ្លាស់ប្តូរ"'
            : 'Logo image loaded! Click "Save Changes" to apply.',
          'success'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Hero background file upload (reads file to base64 Data URL)
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast(
        language === 'kh'
          ? 'សូមជ្រើសរើសឯកសារជារូបភាព'
          : 'Please select an image file',
        'error'
      );
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast(
        language === 'kh'
          ? 'ទំហំរូបភាពធំពេក សូមជ្រើសរូបតូចជាង 8MB'
          : 'Background image too large (max 8MB)',
        'error'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSettingsForm((prev) => ({ ...prev, heroBackground: dataUrl }));
        showToast(
          language === 'kh'
            ? 'បានបញ្ចូលរូបភាពផ្ទៃខាងក្រោយថ្មីជោគជ័យ! សូមចុច "រក្សាទុកការផ្លាស់ប្តូរ"'
            : 'Background image loaded! Click "Save Changes" to apply.',
          'success'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(settingsForm);
  };

  // USERS MANAGEMENT STATE
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | UserRole>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New manager / staff creation form state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('admin'); // Default to Manager
  const [newStaffPassword, setNewStaffPassword] = useState('manager123');
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // INVENTORY & PRODUCT MANAGEMENT STATE
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Restock & Stock Movements state
  const [inventorySubTab, setInventorySubTab] = useState<'products' | 'movements'>('products');
  const [stockMovementFilter, setStockMovementFilter] = useState<'all' | 'IN' | 'OUT' | 'ADJUSTMENT'>('all');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockProductId, setRestockProductId] = useState('');
  const [restockQty, setRestockQty] = useState<number>(20);
  const [restockReason, setRestockReason] = useState('នាំចូលស្តុកថ្មីប្រចាំថ្ងៃ (Daily Restock)');
  const [isRestocking, setIsRestocking] = useState(false);

  // Receipt printing modal state
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameKh, setNewProdNameKh] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(4.5);
  const [newProdCat, setNewProdCat] = useState<ProductCategory>('signature');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdDescKh, setNewProdDescKh] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80');
  const [newProdStock, setNewProdStock] = useState<number>(50);
  const [newProdOrigin, setNewProdOrigin] = useState('Mondulkiri, Cambodia');
  const [newProdAltitude, setNewProdAltitude] = useState('1,250 MASL');
  const [newProdRoast, setNewProdRoast] = useState('Medium Roast');
  const [newProdCaffeine, setNewProdCaffeine] = useState<number>(145);
  const [newProdNotes, setNewProdNotes] = useState('Jasmine, Honey, Citrus');

  // Change password state
  const [adminCurrentPass, setAdminCurrentPass] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponTitle, setCouponTitle] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponVal, setCouponVal] = useState<number>(15);
  const [couponMin, setCouponMin] = useState<number>(10);

  // Orders Filter & Preparation States
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'dine_in' | 'takeaway' | 'delivery'>('all');
  const [orderViewMode, setOrderViewMode] = useState<'cards' | 'kitchen_prep'>('cards');
  const [checkedPrepItems, setCheckedPrepItems] = useState<Record<string, boolean>>({});

  const toggleItemChecked = (orderId: string, itemIdx: number) => {
    const key = `${orderId}-${itemIdx}`;
    setCheckedPrepItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const copyPhoneNumber = (phone: string) => {
    if (!phone) return;
    navigator.clipboard?.writeText(phone);
    showToast(
      language === 'kh'
        ? `បានចម្លងលេខទូរស័ព្ទ៖ ${phone}`
        : `Copied phone number: ${phone}`,
      'success'
    );
  };

  // Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;
  }, [orders]);

  const needsPrepOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'pending' || o.status === 'brewing');
  }, [orders]);

  const readyOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'ready' || o.status === 'delivering');
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'completed');
  }, [orders]);

  const occupiedTables = useMemo(() => {
    return tables.filter((t) => t.status === 'occupied').length;
  }, [tables]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stockCount <= 20).length;
  }, [products]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const q = userSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q));
      return matchesRole && matchesSearch;
    });
  }, [users, userRoleFilter, userSearch]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const q = productSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nameKh.toLowerCase().includes(q) ||
        (p.origin && p.origin.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [products, productCategoryFilter, productSearch]);

  // Filtered Orders (Search by customer, phone, order #, table #, notes, or products)
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status filter
      if (orderStatusFilter === 'needs_prep') {
        if (o.status !== 'pending' && o.status !== 'brewing') return false;
      } else if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }

      // Order type filter
      if (orderTypeFilter !== 'all' && o.orderType !== orderTypeFilter) {
        return false;
      }

      // Search query
      const q = orderSearch.toLowerCase().trim();
      if (q) {
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchPhone = (o.customerPhone || '').toLowerCase().includes(q);
        const matchEmail = (o.customerEmail || '').toLowerCase().includes(q);
        const matchTable = (o.tableNumber || '').toLowerCase().includes(q);
        const matchAddr = (o.deliveryAddress || '').toLowerCase().includes(q);
        const matchNotes = (o.notes || '').toLowerCase().includes(q);
        const matchItem = o.items.some(
          (it) =>
            it.product.name.toLowerCase().includes(q) ||
            (it.product.nameKh && it.product.nameKh.toLowerCase().includes(q))
        );
        if (!matchNum && !matchName && !matchPhone && !matchEmail && !matchTable && !matchAddr && !matchNotes && !matchItem) {
          return false;
        }
      }

      return true;
    });
  }, [orders, orderStatusFilter, orderTypeFilter, orderSearch]);

  // Filtered Stock Movements with exact dates
  const filteredStockMovements = useMemo(() => {
    return stockMovements.filter((m) => {
      if (stockMovementFilter === 'all') return true;
      return m.type === stockMovementFilter;
    });
  }, [stockMovements, stockMovementFilter]);

  // Restock handler
  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProductId) {
      showToast(language === 'kh' ? 'សូមជ្រើសរើសមុខទំនិញដែលត្រូវនាំចូល' : 'Please select a product to restock', 'error');
      return;
    }
    if (restockQty <= 0) {
      showToast(language === 'kh' ? 'ចំនួននាំចូលត្រូវតែធំជាង ០' : 'Quantity must be greater than 0', 'error');
      return;
    }

    setIsRestocking(true);
    try {
      const ok = await restockProduct(
        restockProductId,
        Number(restockQty),
        restockReason,
        user?.name || 'Administrator'
      );
      if (ok) {
        setShowRestockModal(false);
        setRestockProductId('');
        setRestockQty(20);
        setRestockReason('នាំចូលស្តុកថ្មីប្រចាំថ្ងៃ (Daily Restock)');
      }
    } finally {
      setIsRestocking(false);
    }
  };

  // Handlers
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingStaff(true);
    try {
      const res = await addNewStaffMember({
        name: newStaffName,
        email: newStaffEmail,
        phone: newStaffPhone,
        role: newStaffRole,
        password: newStaffPassword,
      });
      showToast(res.message, res.success ? 'success' : 'error');
      if (res.success) {
        setNewStaffName('');
        setNewStaffEmail('');
        setNewStaffPhone('');
        setNewStaffPassword('manager123');
        setShowAddStaffModal(false);
      }
    } finally {
      setIsAddingStaff(false);
    }
  };

  const handleUpdateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone,
      role: editingUser.role,
      status: editingUser.status,
    });
    setEditingUser(null);
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    addNewProduct({
      name: newProdName,
      nameKh: newProdNameKh || newProdName,
      description: newProdDesc || 'Artisanal micro-batch crafted offering.',
      descriptionKh: newProdDescKh || newProdDesc || 'កាហ្វេពិសេសកម្រិតខ្ពស់',
      basePrice: Number(newProdPrice),
      image: newProdImg,
      category: newProdCat,
      inStock: newProdStock > 0,
      stockCount: Number(newProdStock),
      isPopular: false,
      origin: newProdOrigin,
      altitude: newProdAltitude,
      roastLevel: newProdRoast,
      caffeineMg: Number(newProdCaffeine),
      tastingNotes: newProdNotes ? newProdNotes.split(',').map((n) => n.trim()) : ['Artisanal', 'Rich'],
      rating: 5.0,
      reviewsCount: 1,
    });
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdNameKh('');
    setNewProdDesc('');
    setNewProdDescKh('');
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      nameKh: editingProduct.nameKh,
      basePrice: Number(editingProduct.basePrice),
      category: editingProduct.category,
      stockCount: Number(editingProduct.stockCount),
      inStock: Number(editingProduct.stockCount) > 0,
      origin: editingProduct.origin,
      altitude: editingProduct.altitude,
      roastLevel: editingProduct.roastLevel,
      caffeineMg: Number(editingProduct.caffeineMg || 0),
      description: editingProduct.description,
      descriptionKh: editingProduct.descriptionKh,
      image: editingProduct.image,
    });
    setEditingProduct(null);
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminNewPass !== adminConfirmPass) {
      showToast(language === 'kh' ? 'ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ' : 'Passwords do not match', 'error');
      return;
    }
    setPassLoading(true);
    try {
      const res = await changePassword(adminCurrentPass, adminNewPass);
      showToast(res.message, res.success ? 'success' : 'error');
      if (res.success) {
        setAdminCurrentPass('');
        setAdminNewPass('');
        setAdminConfirmPass('');
      }
    } finally {
      setPassLoading(false);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    addNewCoupon({
      code: couponCode.trim().toUpperCase(),
      title: couponTitle || 'Special Roastery Promo',
      titleKh: 'ប្រូម៉ូសិនពិសេស',
      discountType: couponType,
      discountValue: Number(couponVal),
      minSpend: Number(couponMin),
      expiresAt: '2026-12-31',
      usageLimit: 500,
      isActive: true,
    });
    setCouponCode('');
    setCouponTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-[#140e0a] border border-[#38261b] rounded-3xl shadow-2xl text-[#f4efe9] overflow-hidden my-auto sm:my-4 flex flex-col max-h-[94vh]">
        
        {/* System Bar Header */}
        <div className="p-4 sm:p-5 bg-[#1a120d] border-b border-[#2d1e16] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d97706]/20 border border-[#d97706]/40 flex items-center justify-center text-[#d97706] shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold text-[#fcfaf7]">
                  {language === 'kh' ? 'ប្រព័ន្ធគ្រប់គ្រងហាង' : 'Aura Roastery Admin & Manager Console'}
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#d97706] text-[#120d0a] font-bold">
                  {user?.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-[#8c7461]">
                {user?.name} · {user?.email} {user?.phone && `· ${user?.phone}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#241710] hover:bg-[#38261b] text-[#d97706] hover:text-[#f4efe9] border border-[#38261b] text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.backToStore}</span>
              <span className="sm:hidden">{t.back}</span>
            </button>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#20150e] hover:bg-[#ef4444]/20 hover:text-[#ef4444] text-xs text-[#b8a796] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">{t.logout}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#20150e] hover:bg-[#2a1d15] text-[#a8988b] hover:text-[#f4efe9] transition-colors cursor-pointer"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 bg-[#17100b] border-b border-[#2d1e16] overflow-x-auto scrollbar-none text-xs shrink-0">
          {[
            { id: 'analytics' as const, label: t.tabOverview, icon: TrendingUp },
            { id: 'settings' as const, label: language === 'kh' ? 'ការកំណត់ហាង (Logo & Background)' : 'Store & Branding', icon: Settings },
            { id: 'users' as const, label: `${language === 'kh' ? 'អ្នកប្រើប្រាស់ & Manager' : 'Users & Managers'} (${users.length})`, icon: Users },
            { id: 'orders' as const, label: `${t.tabLiveOrders} (${activeOrdersCount})`, icon: Clock },
            { id: 'inventory' as const, label: `${t.tabInventory} (${products.length})`, icon: Package },
            { id: 'reservations' as const, label: `${t.tabReservations} (${reservations.length})`, icon: Calendar },
            { id: 'tables' as const, label: t.tabTables, icon: Grid },
            { id: 'logs' as const, label: `${t.tabLogs} (${logs.length})`, icon: ScrollText },
            { id: 'coupons' as const, label: t.tabCoupons, icon: Ticket },
            { id: 'password' as const, label: t.changePassword, icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 pb-3 px-3.5 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#d97706] text-[#d97706] font-bold'
                    : 'border-transparent text-[#a8988b] hover:text-[#f4efe9]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: Analytics & Reports */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#1a120d] border border-[#2d1e16]">
                  <div className="text-[11px] uppercase font-bold text-[#8c7461]">
                    {language === 'kh' ? 'ចំណូលលក់សរុប' : 'Total POS Sales'}
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#fcfaf7] mt-1 tabular-nums">
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Real-time POS revenue</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a120d] border border-[#2d1e16]">
                  <div className="text-[11px] uppercase font-bold text-[#8c7461]">
                    {language === 'kh' ? 'ការកុម្ម៉ង់កំពុងដំណើរការ' : 'Active Orders'}
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#f59e0b] mt-1 tabular-nums">
                    {activeOrdersCount}
                  </div>
                  <div className="text-[10px] text-[#8c7461] mt-1">
                    {orders.length} total lifetime orders
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a120d] border border-[#2d1e16]">
                  <div className="text-[11px] uppercase font-bold text-[#8c7461]">
                    {language === 'kh' ? 'តុមានភ្ញៀវអង្គុយ' : 'Table Seating'}
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#fcfaf7] mt-1 tabular-nums">
                    {occupiedTables} / {tables.length}
                  </div>
                  <div className="text-[10px] text-[#8c7461] mt-1">
                    {Math.round((occupiedTables / (tables.length || 1)) * 100)}% tables seated
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a120d] border border-[#2d1e16]">
                  <div className="text-[11px] uppercase font-bold text-[#8c7461]">Registered Users</div>
                  <div className="font-mono text-2xl font-bold text-[#38bdf8] mt-1 tabular-nums">
                    {users.length}
                  </div>
                  <div className="text-[10px] text-[#8c7461] mt-1">
                    {users.filter((u) => u.role === 'customer').length} customers, {users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length} managers
                  </div>
                </div>
              </div>

              {/* Quick Summary Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="p-5 rounded-2xl bg-[#1a120d] border border-[#2d1e16] space-y-3">
                  <h3 className="font-display font-bold text-sm text-[#fcfaf7] flex items-center justify-between">
                    <span>Recent Customer Orders</span>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-[#d97706] hover:underline cursor-pointer">
                      View all ({orders.length})
                    </button>
                  </h3>
                  <div className="divide-y divide-[#241710] text-xs">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#fcfaf7] flex items-center gap-2">
                            <span>{o.orderNumber}</span>
                            <span className="text-[#8c7461]">· {o.customerName}</span>
                          </div>
                          <div className="text-[11px] text-[#8c7461]">
                            {o.items.length} items · {o.customerPhone}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-[#d97706]">${o.total.toFixed(2)}</div>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#20150e] text-[#a8988b]">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Warning */}
                <div className="p-5 rounded-2xl bg-[#1a120d] border border-[#2d1e16] space-y-3">
                  <h3 className="font-display font-bold text-sm text-[#fcfaf7] flex items-center justify-between">
                    <span>Inventory Low Stock Alerts</span>
                    <button onClick={() => setActiveTab('inventory')} className="text-xs text-[#d97706] hover:underline cursor-pointer">
                      Manage Stock
                    </button>
                  </h3>
                  <div className="divide-y divide-[#241710] text-xs">
                    {products.slice(0, 5).map((p) => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <div className="font-semibold text-[#fcfaf7]">{p.name}</div>
                            <div className="text-[11px] text-[#8c7461]">${p.basePrice.toFixed(2)} · {p.origin}</div>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.stockCount <= 20 ? 'bg-red-500/20 text-red-400' : 'bg-[#20150e] text-white'
                          }`}>
                            {p.stockCount} in stock
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Store Branding & Settings (USER REQUIREMENT: Admin can edit logo, nameshop, background photo, etc.) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#d97706]/10 border border-[#d97706]/30 text-xs text-[#fcd34d] flex items-start gap-3">
                <Store className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {language === 'kh' ? 'ការកំណត់ម៉ាកយីហោ និងហាង (Admin Store Settings)' : 'Store Identity & Branding Management'}
                  </h4>
                  <p className="mt-0.5 text-[#d4c5b6]">
                    {language === 'kh'
                      ? 'Admin មានសិទ្ធិកែប្រែ Logo ហាង, ឈ្មោះហាង (Name Shop), រូបភាពផ្ទៃខាងក្រោយ (Photo Background), ពាក្យស្លោក និងព័ត៌មានទាក់ទងទាំងអស់។ ការផ្លាស់ប្តូរនឹងបង្ហាញភ្លាមៗលើទំព័រដើម!'
                      : 'Admin has full control to customize Shop Name, Brand Logo, Hero Background Photo, and operational parameters.'}
                  </p>
                </div>
              </div>

              {/* Real-time Preview Card */}
              <div className="p-5 rounded-2xl bg-[#1a120d] border border-[#2d1e16] space-y-3">
                <h4 className="text-xs uppercase font-bold text-[#8c7461] tracking-wider">
                  {language === 'kh' ? 'ទិដ្ឋភាពបង្ហាញជាក់ស្តែង (Live Preview)' : 'Live Storefront Branding Preview'}
                </h4>
                
                <div className="relative rounded-2xl overflow-hidden border border-[#38261b] h-48 sm:h-60 flex items-center p-6 sm:p-8">
                  <img
                    src={settingsForm.heroBackground || storeSettings.heroBackground}
                    alt="Hero Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

                  <div className="relative z-10 flex items-center gap-4">
                    {settingsForm.logo && (
                      <img
                        src={settingsForm.logo}
                        alt="Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-[#17100b] p-2 border-2 border-[#d97706] shadow-xl"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d97706] text-[#120d0a]">
                        SCA 88+ SPECIALTY
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {settingsForm.shopName || 'Aura Roastery'}
                      </h3>
                      {settingsForm.shopNameKh && (
                        <div className="text-sm font-semibold text-[#fcd34d]">
                          {settingsForm.shopNameKh}
                        </div>
                      )}
                      <p className="text-xs text-[#d4c5b6] mt-1 max-w-md line-clamp-2">
                        {settingsForm.tagline || storeSettings.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Form */}
              <form onSubmit={handleSaveStoreSettings} className="space-y-6">
                {/* 1. SHOP NAME MANAGEMENT */}
                <div className="p-5 rounded-2xl bg-[#1a120d] border border-[#2d1e16] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#241710] pb-3">
                    <h4 className="text-sm font-bold text-[#fcfaf7] flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#d97706]" />
                      <span>{language === 'kh' ? '១. ប្តូរឈ្មោះហាង (Change Store Name)' : '1. Shop Name & Title'}</span>
                    </h4>
                    <span className="text-[11px] font-mono text-[#8c7461]">
                      {language === 'kh' ? 'បង្ហាញលើ Navbar, Hero & វិក្កយបត្រ' : 'Reflected on Navbar, Hero & Receipts'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">
                        {language === 'kh' ? 'ឈ្មោះហាង (អក្សរឡាតាំង / English)' : 'Shop Name (English / Latin)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.shopName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                        required
                        placeholder="e.g. AURA Specialty Coffee & Roastery"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] font-medium focus:outline-none focus:border-[#d97706]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">
                        {language === 'kh' ? 'ឈ្មោះហាង (ជាភាសាខ្មែរ / Khmer)' : 'Shop Name (Khmer Translation)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.shopNameKh}
                        onChange={(e) => setSettingsForm({ ...settingsForm, shopNameKh: e.target.value })}
                        placeholder="ឧទាហរណ៍៖ AURA ហាងកាហ្វេពិសេស & រោងលីងកាហ្វេ"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] font-medium focus:outline-none focus:border-[#d97706]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. LOGO UPLOAD & MANAGEMENT */}
                <div className="p-5 rounded-2xl bg-[#1a120d] border border-[#2d1e16] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#241710] pb-3">
                    <h4 className="text-sm font-bold text-[#fcfaf7] flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#d97706]" />
                      <span>{language === 'kh' ? '២. បង្ហោះរូប Logo ហាង (Upload Brand Logo)' : '2. Upload Brand Logo'}</span>
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {language === 'kh' ? 'គាំទ្រ PNG, JPG, SVG, WEBP' : 'Supports PNG, JPG, SVG, WEBP'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Current Logo Preview */}
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 rounded-2xl bg-[#20150e] border-2 border-dashed border-[#442c1f] flex items-center justify-center p-2 overflow-hidden shadow-md">
                        {settingsForm.logo ? (
                          <img
                            src={settingsForm.logo}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Coffee className="w-8 h-8 text-[#8c7461]" />
                        )}
                      </div>
                      {settingsForm.logo && (
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logo: '' })}
                          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 shadow-sm cursor-pointer"
                          title="Remove logo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Upload button & file input */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-bold text-xs transition-colors cursor-pointer shadow-md">
                          <Upload className="w-4 h-4" />
                          <span>{language === 'kh' ? 'ជ្រើសរើសរូប Logo ពីទូរស័ព្ទ / កុំព្យូទ័រ' : 'Upload Logo from Device'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileUpload}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logo: '/coffee-icon.svg' })}
                          className="px-3 py-2 rounded-xl bg-[#20150e] hover:bg-[#2b1c13] text-[#a8988b] hover:text-white border border-[#2d1e16] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {language === 'kh' ? 'ប្រើរូបដើម' : 'Reset to Default'}
                        </button>
                      </div>

                      <div className="text-xs space-y-1">
                        <label className="text-[11px] text-[#8c7461] uppercase font-mono block">
                          {language === 'kh' ? 'ឬ បញ្ចូលតំណភ្ជាប់ Logo (Image URL):' : 'Or Paste Direct Logo URL:'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.logo}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] text-xs focus:outline-none focus:border-[#d97706]"
                        />
                      </div>

                      {/* Quick Logo Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-[#8c7461] uppercase font-mono mr-1">Presets:</span>
                        {logoPresets.map((p, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setSettingsForm({ ...settingsForm, logo: p.url })}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                              settingsForm.logo === p.url
                                ? 'bg-[#d97706]/20 border-[#d97706] text-[#d97706] font-bold'
                                : 'bg-[#20150e] hover:bg-[#2e1d13] border-[#38261b] text-[#c4b5a5] hover:text-white'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. HERO BACKGROUND PHOTO UPLOAD */}
                <div className="p-5 rounded-2xl bg-[#1a120d] border border-[#2d1e16] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#241710] pb-3">
                    <h4 className="text-sm font-bold text-[#fcfaf7] flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#d97706]" />
                      <span>{language === 'kh' ? '៣. រូបភាពផ្ទៃខាងក្រោយរបស់ App (App Hero Background Photo)' : '3. App Hero Background Photo'}</span>
                    </h4>
                    <span className="text-[11px] font-mono text-[#d97706]">
                      {language === 'kh' ? 'កម្រិតច្បាស់ HD / 4K' : 'HD / 4K Resolution'}
                    </span>
                  </div>

                  {/* Upload button & file input */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md">
                        <Upload className="w-4 h-4" />
                        <span>{language === 'kh' ? 'បង្ហោះរូបភាពផ្ទៃខាងក្រោយថ្មី (Upload Background Photo)' : 'Upload Background Photo from Device'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, heroBackground: '/src/assets/images/hero_artisanal_cafe_1790122506662.jpg' })}
                        className="px-3 py-2 rounded-xl bg-[#20150e] hover:bg-[#2b1c13] text-[#a8988b] hover:text-white border border-[#2d1e16] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {language === 'kh' ? 'ប្រើរូបផ្ទៃខាងក្រោយដើម' : 'Reset to AI Studio Master'}
                      </button>
                    </div>

                    <div className="text-xs space-y-1">
                      <label className="text-[11px] text-[#8c7461] uppercase font-mono block">
                        {language === 'kh' ? 'ឬ បញ្ចូលតំណភ្ជាប់រូបភាព (Image URL):' : 'Or Paste Background Image URL:'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.heroBackground}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroBackground: e.target.value })}
                        placeholder="https://example.com/roastery-background.jpg"
                        className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] text-xs focus:outline-none focus:border-[#d97706]"
                      />
                    </div>

                    {/* Presets Gallery with high quality visuals */}
                    <div className="pt-2">
                      <span className="text-[10px] text-[#8c7461] uppercase font-mono block mb-2 font-semibold">
                        {language === 'kh' ? 'ឬ ជ្រើសរើសរូបថតរចនាបថហាងកាហ្វេគំរូ (Curated Architectural Presets):' : 'Or Select Curated Architectural Presets:'}
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {heroBackgroundPresets.map((preset, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setSettingsForm({ ...settingsForm, heroBackground: preset.url })}
                            className={`group relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                              settingsForm.heroBackground === preset.url
                                ? 'border-[#d97706] ring-2 ring-[#d97706]/40 bg-[#251810]'
                                : 'border-[#38261b] hover:border-[#65432d] bg-[#1a120d]'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-20 object-cover rounded-lg" />
                            <div className="mt-1.5 px-1 pb-0.5 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-[#c4b5a5] truncate">
                                {preset.label}
                              </span>
                              {settingsForm.heroBackground === preset.url && (
                                <Check className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slogan & Contact Details */}
                <div className="p-5 rounded-2xl bg-[#1a120d] border border-[#2d1e16] space-y-4">
                  <h4 className="text-sm font-bold text-[#fcfaf7] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d97706]" />
                    <span>{language === 'kh' ? 'ពាក្យស្លោក & ព័ត៌មានទំនាក់ទំនង' : 'Tagline & Store Operations'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Tagline (English)</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Tagline (Khmer)</label>
                      <input
                        type="text"
                        value={settingsForm.taglineKh}
                        onChange={(e) => setSettingsForm({ ...settingsForm, taglineKh: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Contact Phone</label>
                      <input
                        type="text"
                        value={settingsForm.contactPhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Opening Hours</label>
                      <input
                        type="text"
                        value={settingsForm.openingHours}
                        onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'kh' ? 'រក្សាទុកការកំណត់ហាង' : 'Save Store Branding Settings'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: User & Manager Management (USER REQUIREMENT: Admin logs in, User logs in with email & phone, Admin manages/creates Managers, edits/deletes users) */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              {/* Header with Search and Create Manager */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#fcfaf7] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#d97706]" />
                    <span>{language === 'kh' ? 'ការគ្រប់គ្រងអ្នកប្រើប្រាស់ និង Manager' : 'User & Manager Account Management'}</span>
                  </h3>
                  <p className="text-xs text-[#8c7461] mt-0.5">
                    {language === 'kh'
                      ? 'រាល់គណនីទាំងអស់រក្សាទុកក្នុងប្រព័ន្ធ admin មានសិទ្ធិកែប្រែ ឬលុប។ សម្រាប់ Manager គឺ admin ជាអ្នកបង្កើត!'
                      : 'All user records with phone & email. Admin can create Managers, edit profiles, or delete accounts.'}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'kh' ? '+ បង្កើត Manager / បុគ្គលិកថ្មី' : '+ Create Manager / Staff'}</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#1a120d] border border-[#2d1e16]">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7461]" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={language === 'kh' ? 'ស្វែងរកតាមឈ្មោះ, email, ឬលេខទូរស័ព្ទ...' : 'Search by name, email, or phone...'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  <span className="text-xs text-[#8c7461] font-mono whitespace-nowrap">Filter:</span>
                  {(['all', 'super_admin', 'admin', 'staff', 'customer'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        userRoleFilter === r
                          ? 'bg-[#d97706] text-[#120d0a]'
                          : 'bg-[#20150e] text-[#a8988b] hover:text-white border border-[#2d1e16]'
                      }`}
                    >
                      {r === 'all' ? 'All Roles' : r === 'admin' ? 'Manager' : r.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="border border-[#2d1e16] rounded-2xl overflow-hidden bg-[#1a120d]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#20150e] text-[#8c7461] uppercase font-mono text-[10px] border-b border-[#2d1e16]">
                      <tr>
                        <th className="p-3.5">User Identity</th>
                        <th className="p-3.5">Contact (Phone & Email)</th>
                        <th className="p-3.5">Role / Permission</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Orders & Spend</th>
                        <th className="p-3.5 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#241710]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#20150e]/50 transition-colors">
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#2a1a11] border border-[#442c1e] flex items-center justify-center font-bold text-[#d97706]">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-[#fcfaf7]">{u.name}</div>
                                <div className="text-[10px] text-[#8c7461]">ID: {u.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-[#f4efe9]">
                                <Mail className="w-3.5 h-3.5 text-[#8c7461]" />
                                <span>{u.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono text-[#d97706]">
                                <Phone className="w-3.5 h-3.5 text-[#8c7461]" />
                                <span>{u.phone || 'No phone set'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              u.role === 'super_admin'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : u.role === 'admin'
                                ? 'bg-[#d97706]/20 text-[#fcd34d] border border-[#d97706]/30'
                                : u.role === 'staff'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {u.role === 'admin' ? 'Store Manager' : u.role.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.status === 'suspended'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {u.status || 'active'}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <div className="font-mono">
                              <div className="font-bold text-[#fcfaf7]">
                                ${u.totalSpent ? u.totalSpent.toFixed(2) : '0.00'}
                              </div>
                              <div className="text-[10px] text-[#8c7461]">
                                {u.ordersCount || 0} orders
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit User Button */}
                              <button
                                onClick={() => setEditingUser(u)}
                                className="p-1.5 rounded-lg bg-[#20150e] hover:bg-[#2f1f14] text-[#d97706] hover:text-[#fcd34d] border border-[#38261b] transition-colors cursor-pointer"
                                title="Edit user profile"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete User Button */}
                              {u.id !== user?.id && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(language === 'kh' ? `តើអ្នកប្រាកដថាចង់លុបគណនី "${u.name}" មែនទេ?` : `Are you sure you want to delete user "${u.name}"?`)) {
                                      deleteUser(u.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-[#20150e] hover:bg-red-500/20 text-[#8c7461] hover:text-red-400 border border-[#38261b] transition-colors cursor-pointer"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Manager / Staff Modal */}
              {showAddStaffModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="relative w-full max-w-lg bg-[#17100b] border border-[#38261b] rounded-2xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2d1e16] pb-3">
                      <h4 className="font-display text-base font-bold text-[#fcfaf7] flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#d97706]" />
                        <span>{language === 'kh' ? 'បង្កើតគណនី Manager ឬ បុគ្គលិកថ្មី' : 'Create New Manager or Staff Account'}</span>
                      </h4>
                      <button
                        onClick={() => setShowAddStaffModal(false)}
                        className="p-1 rounded-lg hover:bg-[#20150e] text-[#8c7461] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Full Name</label>
                        <input
                          type="text"
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          required
                          placeholder="e.g. Bunthoeun Seng"
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Email Address</label>
                        <input
                          type="email"
                          value={newStaffEmail}
                          onChange={(e) => setNewStaffEmail(e.target.value)}
                          required
                          placeholder="e.g. manager@auracafe.com"
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Phone Number (Required)</label>
                        <input
                          type="tel"
                          value={newStaffPhone}
                          onChange={(e) => setNewStaffPhone(e.target.value)}
                          required
                          placeholder="+855 12 345 678"
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] font-mono focus:outline-none focus:border-[#d97706]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Role</label>
                          <select
                            value={newStaffRole}
                            onChange={(e) => setNewStaffRole(e.target.value as UserRole)}
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none"
                          >
                            <option value="admin">Store Manager</option>
                            <option value="staff">Barista Staff</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Initial Password</label>
                          <input
                            type="text"
                            value={newStaffPassword}
                            onChange={(e) => setNewStaffPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddStaffModal(false)}
                          className="px-4 py-2 rounded-xl bg-[#20150e] text-[#a8988b] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isAddingStaff}
                          className="px-5 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-bold"
                        >
                          {isAddingStaff ? t.loading : 'Create Account'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit User Modal */}
              {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="relative w-full max-w-md bg-[#17100b] border border-[#38261b] rounded-2xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2d1e16] pb-3">
                      <h4 className="font-display text-base font-bold text-[#fcfaf7]">
                        Edit User: {editingUser.name}
                      </h4>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="p-1 rounded-lg hover:bg-[#20150e] text-[#8c7461] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateUserSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Full Name</label>
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Email</label>
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Phone Number</label>
                        <input
                          type="tel"
                          value={editingUser.phone || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                          placeholder="+855 12 345 678"
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Role</label>
                          <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Store Manager</option>
                            <option value="staff">Barista Staff</option>
                            <option value="customer">Customer</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Account Status</label>
                          <select
                            value={editingUser.status || 'active'}
                            onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 rounded-xl bg-[#20150e] text-[#a8988b] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-bold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: Live Orders Fulfillment */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-display text-base font-bold text-[#fcfaf7]">
                  {t.tabLiveOrders} ({orders.length})
                </h3>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {(['all', 'pending', 'brewing', 'delivering', 'ready', 'completed', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-[#d97706] text-[#120d0a] font-bold'
                          : 'bg-[#1a120d] text-[#8c7461] hover:text-white border border-[#2d1e16]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-[#1a120d] border border-[#2d1e16] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#d97706]">{ord.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ord.status === 'brewing'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-[#20150e] text-[#a8988b]'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="mt-2 text-xs">
                        <div className="font-bold text-[#fcfaf7]">{ord.customerName}</div>
                        <div className="font-mono text-[11px] text-[#8c7461]">{ord.customerPhone}</div>
                        <div className="text-[11px] text-[#8c7461] mt-0.5">
                          Type: {ord.orderType.toUpperCase()} {ord.tableNumber && `(Table ${ord.tableNumber})`}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mt-3 pt-2 border-t border-[#241710] space-y-1 text-xs text-[#d4c5b6]">
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{i.quantity}x {i.product.name} ({i.customization.size})</span>
                            <span className="font-mono text-[#8c7461]">${i.itemTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#241710] flex justify-between font-bold text-xs">
                        <span className="text-[#8c7461]">Total Amount</span>
                        <span className="font-mono text-[#d97706]">${ord.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Status updater */}
                    <div className="mt-4 pt-3 border-t border-[#2d1e16]">
                      <div className="text-[10px] text-[#8c7461] uppercase font-mono mb-1.5">Update Status:</div>
                      <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                        {(['pending', 'brewing', 'ready', 'completed'] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateOrderStatus(ord.id, st)}
                            className={`py-1 rounded font-bold uppercase transition-colors cursor-pointer ${
                              ord.status === st
                                ? 'bg-[#d97706] text-[#120d0a]'
                                : 'bg-[#20150e] text-[#a8988b] hover:text-white'
                            }`}
                          >
                            {st.slice(0, 4)}
                          </button>
                        ))}
                      </div>

                      {/* Print Receipt Button */}
                      <button
                        onClick={() => setSelectedReceiptOrder(ord)}
                        className="w-full mt-2.5 py-1.5 px-3 rounded-lg bg-[#20150e] hover:bg-[#2b1c13] border border-[#38261b] text-xs font-semibold text-[#f4efe9] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#d97706]" />
                        <span>{language === 'kh' ? 'បោះពុម្ពវិក្កយបត្រ (Print Receipt)' : 'Print Official Receipt'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Inventory & Products Management */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-[#fcfaf7]">
                    {language === 'kh' ? 'ការគ្រប់គ្រងស្តុក និងកាតាឡុកទំនិញ' : 'Inventory & Catalog Management'}
                  </h3>
                  <p className="text-xs text-[#8c7461]">
                    {language === 'kh'
                      ? 'តាមដានការនាំចូលស្តុក ការកាត់ស្តុកស្វ័យប្រវត្តពេលទិញ និងប្រវត្តិបន្លាស់ប្តូរតាមកាលបរិច្ឆេទ'
                      : 'Track stock imports, automated deductions upon purchase, and dated movement audits.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRestockModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>{language === 'kh' ? '+ នាំចូលស្តុកទំនិញ' : '+ Stock In (Restock)'}</span>
                  </button>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'kh' ? '+ បន្ថែមមុខទំនិញ' : '+ Add Product'}</span>
                  </button>
                </div>
              </div>

              {/* Subtabs for Inventory */}
              <div className="flex items-center gap-2 border-b border-[#2d1e16] pb-2">
                <button
                  onClick={() => setInventorySubTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                    inventorySubTab === 'products'
                      ? 'bg-[#d97706] text-[#120d0a]'
                      : 'bg-[#1a120d] text-[#a8988b] hover:text-white border border-[#2d1e16]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>{language === 'kh' ? 'កាតាឡុកមុខទំនិញ & ស្តុកបច្ចុប្បន្ន' : 'Catalog & Live Stock'}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20">
                    {products.length}
                  </span>
                </button>

                <button
                  onClick={() => setInventorySubTab('movements')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                    inventorySubTab === 'movements'
                      ? 'bg-[#d97706] text-[#120d0a]'
                      : 'bg-[#1a120d] text-[#a8988b] hover:text-white border border-[#2d1e16]'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>{language === 'kh' ? 'ប្រវត្តិបន្លាស់ប្តូរស្តុក (IN / OUT)' : 'Stock Movements Audit'}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20">
                    {stockMovements.length}
                  </span>
                </button>
              </div>

              {inventorySubTab === 'products' ? (
                <>
                  {/* Product search and filter */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#1a120d] border border-[#2d1e16]">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c7461]" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products, origin..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {(['all', 'signature', 'pour_over', 'espresso', 'cold_brew', 'bakery', 'burger', 'beans'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setProductCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            productCategoryFilter === cat
                              ? 'bg-[#d97706] text-[#120d0a]'
                              : 'bg-[#20150e] text-[#a8988b] hover:text-white border border-[#2d1e16]'
                          }`}
                        >
                          {cat === 'all' ? 'All' : cat === 'burger' ? 'Burgers' : cat.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="divide-y divide-[#241710] bg-[#1a120d] border border-[#2d1e16] rounded-2xl overflow-hidden text-xs">
                    {filteredProducts.map((p) => (
                      <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-[#120d0a] shrink-0 border border-[#2d1e16]" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[#fcfaf7] text-sm">{p.name}</h4>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#20150e] text-[#a8988b]">
                                {p.category.replace('_', ' ')}
                              </span>
                              {p.stockCount <= 5 ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  {language === 'kh' ? 'ជិតអស់ស្តុក' : 'Low Stock'}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-[11px] text-[#8c7461] mt-0.5">
                              {p.nameKh} · {p.origin || 'Artisanal'} · {p.altitude || 'Fresh Daily'}
                            </div>
                            <div className="font-mono text-[#d97706] font-bold mt-1">
                              ${p.basePrice.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Live Stock adjuster */}
                          <div className="flex items-center gap-1.5 bg-[#20150e] p-1.5 rounded-xl border border-[#2d1e16]">
                            <span className="text-[#8c7461] text-[11px] font-mono px-1">
                              {language === 'kh' ? 'ស្តុក៖' : 'Stock:'}
                            </span>
                            <input
                              type="number"
                              value={p.stockCount}
                              onChange={(e) => updateProductStock(p.id, Number(e.target.value) > 0, Number(e.target.value))}
                              className="w-16 px-2 py-1 text-center font-mono rounded-lg bg-[#140e0a] text-white border border-[#38261b] focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={() => {
                              setRestockProductId(p.id);
                              setShowRestockModal(true);
                            }}
                            className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/40 transition-colors cursor-pointer"
                            title={language === 'kh' ? 'នាំចូលស្តុក' : 'Stock In'}
                          >
                            <ArrowDownRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 rounded-xl bg-[#20150e] hover:bg-[#2b1c13] text-[#d97706] hover:text-[#fcd34d] border border-[#38261b] transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(language === 'kh' ? `តើអ្នកប្រាកដថាចង់លុបទំនិញ "${p.name}" មែនទេ?` : `Are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-[#20150e] hover:bg-red-500/20 text-[#8c7461] hover:text-red-400 border border-[#38261b] transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Stock Movements History Table (Specific User Request) */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#1a120d] border border-[#2d1e16]">
                    <div className="text-xs text-[#d4c5b6]">
                      <span className="font-bold text-[#fcfaf7]">
                        {language === 'kh' ? 'កំណត់ហេតុការនាំចូល និងដកស្តុកលម្អិត' : 'Detailed Stock Audit Trail'}
                      </span>
                      <span className="text-[#8c7461] block text-[11px] mt-0.5">
                        {language === 'kh' ? 'មានកាលបរិច្ឆេទ ម៉ោង និងប្រភពនៃការទិញ/នាំចូល' : 'Logged with chronological timestamps and reference IDs'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                      {(['all', 'IN', 'OUT', 'ADJUSTMENT'] as const).map((tp) => (
                        <button
                          key={tp}
                          onClick={() => setStockMovementFilter(tp)}
                          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                            stockMovementFilter === tp
                              ? 'bg-[#d97706] text-[#120d0a] font-bold'
                              : 'bg-[#20150e] text-[#8c7461] hover:text-white border border-[#2d1e16]'
                          }`}
                        >
                          {tp === 'all'
                            ? 'All'
                            : tp === 'IN'
                            ? (language === 'kh' ? 'នាំចូល (IN)' : 'Restock (IN)')
                            : tp === 'OUT'
                            ? (language === 'kh' ? 'លក់ចេញ (OUT)' : 'Sold (OUT)')
                            : 'Adjustments'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border border-[#2d1e16] rounded-2xl overflow-hidden bg-[#1a120d]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#20150e] text-[#8c7461] uppercase font-mono text-[10px] border-b border-[#2d1e16]">
                          <tr>
                            <th className="p-3.5">កាលបរិច្ឆេទ & ម៉ោង (Date & Time)</th>
                            <th className="p-3.5">ប្រភេទ (Type)</th>
                            <th className="p-3.5">មុខទំនិញ (Product)</th>
                            <th className="p-3.5 text-center">ចំនួន (Qty)</th>
                            <th className="p-3.5 text-center">ស្តុកមុន & ក្រោយ (Before → After)</th>
                            <th className="p-3.5">មូលហេតុ / ឯកសារយោង (Reason & Ref)</th>
                            <th className="p-3.5">ប្រតិបត្តិការដោយ (Performed By)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#241710]">
                          {filteredStockMovements.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-xs text-[#8c7461]">
                                {language === 'kh' ? 'មិនទាន់មានប្រវត្តិបន្លាស់ប្តូរស្តុកទេ' : 'No stock movements recorded yet.'}
                              </td>
                            </tr>
                          ) : (
                            filteredStockMovements.map((m) => (
                              <tr key={m.id} className="hover:bg-[#20150e]/50 transition-colors">
                                <td className="p-3.5 whitespace-nowrap font-mono text-[#a8988b]">
                                  <div className="text-[#fcfaf7] font-semibold">
                                    {new Date(m.createdAt).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </div>
                                  <div className="text-[10px] text-[#8c7461]">
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </div>
                                </td>

                                <td className="p-3.5 whitespace-nowrap">
                                  {m.type === 'IN' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                                      <ArrowDownRight className="w-3 h-3" />
                                      <span>{language === 'kh' ? 'នាំចូល (IN)' : 'Restock (IN)'}</span>
                                    </span>
                                  ) : m.type === 'OUT' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                                      <ArrowUpRight className="w-3 h-3" />
                                      <span>{language === 'kh' ? 'លក់ចេញ (OUT)' : 'Deducted (OUT)'}</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold text-[10px]">
                                      <Sliders className="w-3 h-3" />
                                      <span>{language === 'kh' ? 'កែសម្រួល' : 'Adjust'}</span>
                                    </span>
                                  )}
                                </td>

                                <td className="p-3.5 whitespace-nowrap font-medium text-[#fcfaf7]">
                                  <div>{m.productName}</div>
                                  <div className="text-[10px] text-[#8c7461] font-mono">ID: {m.productId}</div>
                                </td>

                                <td className="p-3.5 whitespace-nowrap text-center font-mono font-bold">
                                  <span className={m.type === 'IN' ? 'text-emerald-400' : 'text-amber-400'}>
                                    {m.type === 'IN' ? `+${m.quantity}` : `-${m.quantity}`}
                                  </span>
                                </td>

                                <td className="p-3.5 whitespace-nowrap text-center font-mono text-[11px] text-[#8c7461]">
                                  <span className="text-[#a8988b]">{m.previousStock}</span>
                                  <span className="mx-1 text-[#553c2b]">→</span>
                                  <span className="text-[#fcfaf7] font-bold">{m.newStock}</span>
                                </td>

                                <td className="p-3.5">
                                  <div className="text-[#d4c5b6] max-w-xs">{m.reason}</div>
                                  {m.referenceId && (
                                    <div className="text-[10px] font-mono text-[#d97706]">
                                      Ref: {m.referenceId}
                                    </div>
                                  )}
                                </td>

                                <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-[#a8988b]">
                                  {m.performedBy || 'System'}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Product Modal */}
              {showAddProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
                  <div className="relative w-full max-w-xl bg-[#17100b] border border-[#38261b] rounded-2xl p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#2d1e16] pb-3">
                      <h4 className="font-display text-base font-bold text-[#fcfaf7]">
                        {language === 'kh' ? 'បន្ថែមមុខទំនិញថ្មីទៅក្នុងម៉ឺនុយ' : 'Add New Artisanal Coffee Offering'}
                      </h4>
                      <button onClick={() => setShowAddProductModal(false)} className="p-1 text-[#8c7461] hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateProductSubmit} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Product Name (EN)</label>
                          <input
                            type="text"
                            value={newProdName}
                            onChange={(e) => setNewProdName(e.target.value)}
                            required
                            placeholder="e.g. Geisha Honey Reserve"
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Product Name (Khmer)</label>
                          <input
                            type="text"
                            value={newProdNameKh}
                            onChange={(e) => setNewProdNameKh(e.target.value)}
                            placeholder="ឧ. កាហ្វេហ្គីហ្សាទឹកឃ្មុំ"
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Base Price ($)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(Number(e.target.value))}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Category</label>
                          <select
                            value={newProdCat}
                            onChange={(e) => setNewProdCat(e.target.value as ProductCategory)}
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          >
                            <option value="signature">Signature</option>
                            <option value="pour_over">Pour-over</option>
                            <option value="espresso">Espresso</option>
                            <option value="cold_brew">Cold Brew</option>
                            <option value="bakery">Bakery</option>
                            <option value="beans">Whole Bean</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Stock Count</label>
                          <input
                            type="number"
                            value={newProdStock}
                            onChange={(e) => setNewProdStock(Number(e.target.value))}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Image URL</label>
                        <input
                          type="url"
                          value={newProdImg}
                          onChange={(e) => setNewProdImg(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Origin / Terroir</label>
                          <input
                            type="text"
                            value={newProdOrigin}
                            onChange={(e) => setNewProdOrigin(e.target.value)}
                            placeholder="Mondulkiri, Cambodia"
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Elevation (MASL)</label>
                          <input
                            type="text"
                            value={newProdAltitude}
                            onChange={(e) => setNewProdAltitude(e.target.value)}
                            placeholder="1,350 MASL"
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Roast Profile</label>
                          <input
                            type="text"
                            value={newProdRoast}
                            onChange={(e) => setNewProdRoast(e.target.value)}
                            placeholder="Light-Medium"
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Tasting Notes (comma-separated)</label>
                          <input
                            type="text"
                            value={newProdNotes}
                            onChange={(e) => setNewProdNotes(e.target.value)}
                            placeholder="Jasmine, Honey, Citrus"
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Description</label>
                        <textarea
                          rows={2}
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddProductModal(false)}
                          className="px-4 py-2 rounded-xl bg-[#20150e] text-[#a8988b] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-bold"
                        >
                          Create Offering
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Product Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
                  <div className="relative w-full max-w-xl bg-[#17100b] border border-[#38261b] rounded-2xl p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#2d1e16] pb-3">
                      <h4 className="font-display text-base font-bold text-[#fcfaf7]">
                        Edit: {editingProduct.name}
                      </h4>
                      <button onClick={() => setEditingProduct(null)} className="p-1 text-[#8c7461] hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleEditProductSubmit} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Product Name (EN)</label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Product Name (Khmer)</label>
                          <input
                            type="text"
                            value={editingProduct.nameKh || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, nameKh: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Base Price ($)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={editingProduct.basePrice}
                            onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Stock Count</label>
                          <input
                            type="number"
                            value={editingProduct.stockCount}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Category</label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          >
                            <option value="signature">Signature</option>
                            <option value="pour_over">Pour-over</option>
                            <option value="espresso">Espresso</option>
                            <option value="cold_brew">Cold Brew</option>
                            <option value="bakery">Bakery</option>
                            <option value="beans">Whole Bean</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Origin</label>
                          <input
                            type="text"
                            value={editingProduct.origin || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Elevation (MASL)</label>
                          <input
                            type="text"
                            value={editingProduct.altitude || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, altitude: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">Image URL</label>
                        <input
                          type="url"
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl bg-[#20150e] text-[#a8988b] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-bold"
                        >
                          Save Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: Table Reservations */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <h3 className="font-display text-base font-bold text-[#fcfaf7]">
                {language === 'kh' ? 'បញ្ជីការកក់តុរបស់អតិថិជន' : 'Customer Table Bookings'} ({reservations.length})
              </h3>

              {reservations.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#8c7461]">
                  No table bookings made yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.map((res) => (
                    <div key={res.id} className="p-4 rounded-2xl bg-[#1a120d] border border-[#2d1e16] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#fcfaf7]">{res.customerName}</span>
                          <span className="font-mono text-xs text-[#d97706]">({res.customerPhone})</span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : res.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300'
                              : res.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {res.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#a8988b] mt-1">
                          Date: {res.date} at {res.timeSlot} · Guests: {res.guestCount} · Zone: {res.section.replace('_', ' ')}
                        </div>
                        {res.specialRequest && (
                          <div className="text-[11px] text-[#d97706] italic mt-0.5">"{res.specialRequest}"</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={res.status}
                          onChange={(e) => updateReservationStatus(res.id, e.target.value as any)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#20150e] border border-[#2d1e16] text-xs text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => {
                            if (window.confirm('Delete reservation?')) {
                              deleteReservation(res.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-[#20150e] hover:bg-red-500/20 text-[#8c7461] hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Floor Plan & Tables */}
          {activeTab === 'tables' && (
            <div className="space-y-4">
              <h3 className="font-display text-base font-bold text-[#fcfaf7]">
                {language === 'kh' ? 'ប្លង់តុ និងស្ថានភាពតុក្នុងហាង' : 'Floor Plan & Seating Management'}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {tables.map((tbl) => (
                  <div
                    key={tbl.id}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      tbl.status === 'occupied'
                        ? 'bg-[#ef4444]/10 border-[#ef4444]/40 text-[#ef4444]'
                        : tbl.status === 'reserved'
                        ? 'bg-[#d97706]/10 border-[#d97706]/40 text-[#d97706]'
                        : 'bg-[#1a120d] border-[#2d1e16] text-[#f4efe9]'
                    }`}
                  >
                    <div className="font-mono text-lg font-bold">{tbl.number}</div>
                    <div className="text-[10px] text-[#8c7461] mt-0.5">
                      {tbl.capacity} seats · {tbl.section.replace('_', ' ')}
                    </div>
                    <div className="mt-2 text-[11px] font-semibold uppercase">{tbl.status}</div>

                    <div className="mt-3 flex items-center justify-center gap-1">
                      {(['available', 'occupied', 'reserved'] as TableStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateTableStatus(tbl.id, st)}
                          className={`w-6 h-6 rounded-lg text-[10px] font-mono uppercase flex items-center justify-center cursor-pointer ${
                            tbl.status === st ? 'bg-white text-black font-bold' : 'bg-[#20150e] text-[#8c7461]'
                          }`}
                          title={`Set ${st}`}
                        >
                          {st.charAt(0)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: Activity Logs & Login History (USER REQUIREMENT) */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-[#fcfaf7]">
                  {t.tabLogs} ({logs.length})
                </h3>
                <p className="text-xs text-[#8c7461]">
                  {language === 'kh'
                    ? 'រាល់ការចូលប្រើប្រាស់ ការចុះឈ្មោះ និងសកម្មភាពទាំងអស់ត្រូវបានកត់ត្រាទុកក្នុងប្រព័ន្ធ admin'
                    : 'Real-time auditing of user logins, role adjustments, orders, and store settings modifications.'}
                </p>
              </div>

              <div className="border border-[#2d1e16] rounded-2xl overflow-hidden bg-[#1a120d]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#20150e] text-[#8c7461] uppercase font-mono text-[10px] border-b border-[#2d1e16]">
                      <tr>
                        <th className="p-3">{t.logTime}</th>
                        <th className="p-3">{t.logUser}</th>
                        <th className="p-3">{t.logRole}</th>
                        <th className="p-3">{t.logAction}</th>
                        <th className="p-3">Details</th>
                        <th className="p-3">{t.logIp}</th>
                        <th className="p-3">{t.logDevice}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#241710] font-sans">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#20150e]/50 transition-colors">
                          <td className="p-3 font-mono text-[11px] text-[#8c7461] whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="font-semibold text-[#fcfaf7]">{log.userName}</div>
                            <div className="font-mono text-[10px] text-[#8c7461]">{log.userEmail}</div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#20150e] text-[#a8988b]">
                              {log.role}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap font-mono font-bold text-[11px] text-[#d97706]">
                            {log.action}
                          </td>
                          <td className="p-3 text-[#a8988b] max-w-xs text-xs">
                            {log.details}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-[#8c7461] whitespace-nowrap">
                            {log.ipAddress}
                          </td>
                          <td className="p-3 text-[11px] text-[#8c7461] whitespace-nowrap">
                            {log.device}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: Promotions & Coupons */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#1a120d] border border-[#2d1e16]">
                <h3 className="font-display text-base font-bold text-[#fcfaf7] mb-3">
                  Create Promotion Code
                </h3>
                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[#8c7461] mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SPECIAL20"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-[#20150e] border border-[#2d1e16] font-mono text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8c7461] mb-1">Type & Discount</label>
                    <div className="flex gap-2">
                      <select
                        value={couponType}
                        onChange={(e) => setCouponType(e.target.value as any)}
                        className="px-2 py-2 rounded-lg bg-[#20150e] border border-[#2d1e16] text-[#f4efe9]"
                      >
                        <option value="percentage">% Off</option>
                        <option value="fixed">$ Fixed</option>
                      </select>
                      <input
                        type="number"
                        value={couponVal}
                        onChange={(e) => setCouponVal(Number(e.target.value))}
                        className="w-20 px-2 py-2 rounded-lg bg-[#20150e] border border-[#2d1e16] font-mono text-[#f4efe9]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#8c7461] mb-1">Min Spend ($)</label>
                    <input
                      type="number"
                      value={couponMin}
                      onChange={(e) => setCouponMin(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[#20150e] border border-[#2d1e16] font-mono text-[#f4efe9]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 px-4 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-semibold cursor-pointer"
                    >
                      Add Promo
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons list */}
              <div className="divide-y divide-[#241710] bg-[#1a120d] border border-[#2d1e16] rounded-2xl overflow-hidden text-xs">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#d97706]">{c.code}</span>
                        <span className="text-[#a8988b]">({c.discountType === 'percentage' ? `${c.discountValue}% off` : `$${c.discountValue} off`})</span>
                      </div>
                      <div className="text-[11px] text-[#8c7461]">
                        Min spend: ${c.minSpend} · Redemptions: {c.usedCount}/{c.usageLimit}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCouponActive(c.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                        c.isActive ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-[#ef4444]/15 text-[#ef4444]'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: Change Password for Admin */}
          {activeTab === 'password' && (
            <div className="max-w-md mx-auto space-y-4 py-4">
              <div className="text-center mb-4">
                <KeyRound className="w-8 h-8 text-[#d97706] mx-auto mb-2" />
                <h3 className="font-display text-lg font-bold text-[#fcfaf7]">
                  {language === 'kh' ? 'ប្តូរពាក្យសម្ងាត់គណនី Admin' : 'Admin Security & Password Change'}
                </h3>
                <p className="text-xs text-[#8c7461]">
                  {language === 'kh'
                    ? 'admin អាច ដូរ Password log in ខ្លូនឯងបាន'
                    : 'Update your administrator authentication credentials.'}
                </p>
              </div>

              <form onSubmit={handleChangeAdminPassword} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">{t.currentPassword}</label>
                  <input
                    type="password"
                    value={adminCurrentPass}
                    onChange={(e) => setAdminCurrentPass(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">{t.newPassword}</label>
                  <input
                    type="password"
                    value={adminNewPass}
                    onChange={(e) => setAdminNewPass(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                  />
                </div>

                <div>
                  <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">{t.confirmNewPassword}</label>
                  <input
                    type="password"
                    value={adminConfirmPass}
                    onChange={(e) => setAdminConfirmPass(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-[#120d0a] font-semibold transition-colors cursor-pointer"
                >
                  {passLoading ? t.loading : t.savePassword}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Restock Modal (Stock In with dates and logs) */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#17100b] border border-[#38261b] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d1e16] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-[#fcfaf7]">
                    {language === 'kh' ? 'នាំចូលស្តុកទំនិញថ្មី (Stock In)' : 'Restock / Stock In'}
                  </h4>
                  <p className="text-[11px] text-[#8c7461]">
                    {language === 'kh' ? 'កត់ត្រានាំចូលស្តុកដោយមានកាលបរិច្ឆេទត្រឹមត្រូវ' : 'Record stock arrival with automated date & audit log'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRestockModal(false)}
                className="p-1 rounded-lg text-[#8c7461] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">
                  {language === 'kh' ? 'ជ្រើសរើសមុខទំនិញ (Select Product)' : 'Select Product'}
                </label>
                <select
                  value={restockProductId}
                  onChange={(e) => setRestockProductId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                >
                  <option value="">{language === 'kh' ? '-- សូមជ្រើសរើសមុខទំនិញ --' : '-- Choose Product --'}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.nameKh}) - ស្តុកបច្ចុប្បន្ន: {p.stockCount}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">
                  {language === 'kh' ? 'ចំនួនត្រូវនាំចូលបន្ថែម (Quantity to Add)' : 'Quantity to Add'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] font-mono focus:outline-none focus:border-[#d97706]"
                />
              </div>

              <div>
                <label className="block text-[#d4c5b6] mb-1 font-semibold uppercase">
                  {language === 'kh' ? 'មូលហេតុ ឬប្រភពនៃការនាំចូល (Reason / Batch Note)' : 'Reason / Restock Notes'}
                </label>
                <input
                  type="text"
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  placeholder="e.g. នាំចូលនំប៉័ងថ្មីពីឡ, សាច់ប៊ឺហ្គឺរ Wagyu ស្រស់, កាហ្វេគ្រាប់ Arabica"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#20150e] border border-[#2d1e16] text-[#f4efe9] focus:outline-none focus:border-[#d97706]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#20150e] text-[#a8988b] hover:text-white"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isRestocking}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{isRestocking ? t.loading : language === 'kh' ? 'បញ្ជាក់ការនាំចូល' : 'Confirm Restock'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal for Admin */}
      <PrintableReceiptModal
        order={selectedReceiptOrder}
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />
    </div>
  );
};
