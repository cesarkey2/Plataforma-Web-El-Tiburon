import type { Product } from "@/data/products";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "el-tiburon-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
    return {
      items,
      totalItems,
      subtotal,
      addItem: product => {
        setItems(current => {
          const existing = current.find(item => item.id === product.id);
          if (existing) {
            return current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...current, { ...product, quantity: 1 }];
        });
      },
      removeItem: productId => setItems(current => current.filter(item => item.id !== productId)),
      updateQuantity: (productId, quantity) => setItems(current => quantity <= 0 ? current.filter(item => item.id !== productId) : current.map(item => item.id === productId ? { ...item, quantity } : item)),
      clearCart: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
