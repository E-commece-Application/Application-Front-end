import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = "http://localhost:3000";
const USER_ID = "guest-user"; // You can replace this with actual user ID from auth

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from backend on mount
  useEffect(() => {
    loadCartFromBackend();
  }, []);

  const loadCartFromBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/${USER_ID}`);
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

  const addToCart = async (product: Product, quantity: number = 1) => {
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
      await fetch(`${API_URL}/cart/${USER_ID}/add`, {
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
    } catch (error) {
      console.error("Failed to add to cart in backend:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    // Update local state immediately
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));

    // Remove from backend
    try {
      await fetch(`${API_URL}/cart/${USER_ID}/item/${productId}`, {
        method: "DELETE"
      });
    } catch (error) {
      console.error("Failed to remove from cart in backend:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
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
      await fetch(`${API_URL}/cart/${USER_ID}/item/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      });
    } catch (error) {
      console.error("Failed to update quantity in backend:", error);
    }
  };

  const clearCart = async () => {
    // Update local state immediately
    setItems([]);

    // Clear in backend
    try {
      await fetch(`${API_URL}/cart/${USER_ID}/clear`, {
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
