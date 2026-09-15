import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, Language } from '../types';
import { initialProducts } from '../data/initialProducts';
import { api } from '../services/api';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  products: Product[];
  isLoadingProducts: boolean;
  loadProducts: () => Promise<void>;
  cart: CartItem[];
  handleAddToCart: (product: Product, quantity: number) => void;
  handleUpdateQuantity: (productId: string, delta: number) => void;
  handleRemoveItem: (productId: string) => void;
  handleClearCart: () => void;
  totalCartCount: number;
  totalCartAmount: number;
  totalCartAdvance: number;
  latestOrder: Order | null;
  latestWhatsappMessage: string;
  latestWhatsappUrl: string;
  handleOrderSuccess: (order: Order, whatsappMessage: string, whatsappUrl: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isMyOrdersOpen: boolean;
  setIsMyOrdersOpen: (open: boolean) => void;
  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Cart State (stored in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('daddys_home_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Latest Order for confirmation/success
  const [latestOrder, setLatestOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('daddys_home_latest_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [latestWhatsappMessage, setLatestWhatsappMessage] = useState<string>(() => {
    return localStorage.getItem('daddys_home_latest_wa_msg') || '';
  });
  const [latestWhatsappUrl, setLatestWhatsappUrl] = useState<string>(() => {
    return localStorage.getItem('daddys_home_latest_wa_url') || '';
  });

  // Fetch products from server
  const loadProducts = async () => {
    try {
      const fetched = await api.getProducts();
      if (fetched && fetched.length > 0) {
        setProducts(fetched);
      }
    } catch (err) {
      console.warn('Could not load products from API, using fallback data', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('daddys_home_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(item.product.stock, newQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCartAdvance = Math.round(totalCartAmount * 0.5);

  const handleOrderSuccess = (order: Order, whatsappMessage: string, whatsappUrl: string) => {
    setLatestOrder(order);
    setLatestWhatsappMessage(whatsappMessage);
    setLatestWhatsappUrl(whatsappUrl);
    try {
      localStorage.setItem('daddys_home_latest_order', JSON.stringify(order));
      localStorage.setItem('daddys_home_latest_wa_msg', whatsappMessage);
      localStorage.setItem('daddys_home_latest_wa_url', whatsappUrl);
    } catch (e) {
      console.warn('Could not cache latest order', e);
    }
    setCart([]);
    // Reload products so inventory stock updates live
    loadProducts();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        products,
        isLoadingProducts,
        loadProducts,
        cart,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveItem,
        handleClearCart,
        totalCartCount,
        totalCartAmount,
        totalCartAdvance,
        latestOrder,
        latestWhatsappMessage,
        latestWhatsappUrl,
        handleOrderSuccess,
        isAdminOpen,
        setIsAdminOpen,
        isMyOrdersOpen,
        setIsMyOrdersOpen,
        isGuideOpen,
        setIsGuideOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
