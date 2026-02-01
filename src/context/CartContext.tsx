import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";
import { useAuth } from "./AuthContext";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = "http://localhost:3000";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated, user, token } = useAuth();

  // Close login prompt if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginPrompt(false);
    }
  }, [isAuthenticated]);

  // Load cart from backend when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadCartFromBackend();
      // Close login prompt when user becomes authenticated
      setShowLoginPrompt(false);
    } else {
      // Clear cart when logged out
      setItems([]);
    }
  }, [isAuthenticated, user?.id]);

  const loadCartFromBackend = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${API_URL}/cart/${user.id}`);
      const data = await response.json();
      
      if (data.success && data.cart.items) {
        // Convert backend cart items to frontend format
        const cartItems = data.cart.items.map((item: any) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          description: "",
          inStock: true,
          quantity: item.quantity
        }));
        setItems(cartItems);
      }
    } catch (error) {
      console.error("Failed to load cart from backend:", error);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
    // Check if user is authenticated
    if (!isAuthenticated || !user?.id) {
      setShowLoginPrompt(true);
      return false;
    }

    // Update local state immediately
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });

    // Save to backend
    try {
      const response = await fetch(`${API_URL}/cart/${user.id}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to add to cart in backend:", error);
      // Revert local state on error
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem && existingItem.quantity > quantity) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity - quantity }
              : item
          );
        } else if (existingItem && existingItem.quantity === quantity) {
          return prevItems.filter((item) => item.id !== product.id);
        }
        return prevItems;
      });
      return false;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user?.id) return;
    
    // Update local state immediately
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));

    // Remove from backend
    try {
      await fetch(`${API_URL}/cart/${user.id}/item/${productId}`, {
        method: "DELETE"
      });
    } catch (error) {
      console.error("Failed to remove from cart in backend:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.id) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Update local state immediately
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    // Update in backend
    try {
      await fetch(`${API_URL}/cart/${user.id}/item/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      });
    } catch (error) {
      console.error("Failed to update quantity in backend:", error);
    }
  };

  const clearCart = async () => {
    // Always clear local state immediately
    setItems([]);

    // Only clear in backend if user is authenticated
    if (!user?.id) return;

    // Clear in backend
    try {
      await fetch(`${API_URL}/cart/${user.id}/clear`, {
        method: "DELETE"
      });
    } catch (error) {
      console.error("Failed to clear cart in backend:", error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        showLoginPrompt,
        setShowLoginPrompt,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
