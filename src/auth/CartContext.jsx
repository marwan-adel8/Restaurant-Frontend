import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context
const CartContext = createContext();

// Provider Component
export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalItems: 0 });

  // 🧩 Fetch the user's cart when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("https://restaurant-backend-tawny.vercel.app/carts", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.cart) {
          const totalItems = data.cart.items?.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCart({ ...data.cart, totalItems });
        } else {
          setCart({ items: [], totalItems: 0 });
        }
      } catch (error) {
        console.error("❌ Failed to fetch cart:", error);
        setCart({ items: [], totalItems: 0 });
      }
    };

    fetchCart();
  }, []);

  // ✅ Recalculate total items whenever cart.items changes
  useEffect(() => {
    if (cart && Array.isArray(cart.items)) {
      const totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCart((prev) => ({ ...prev, totalItems }));
    }
  }, [cart.items]);

  // 🛒 Add a product to the cart
  const addToCart = async (productId) => {
    try {
      const res = await fetch("https://restaurant-backend-tawny.vercel.app/carts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Add to cart failed:", data.message);
        return {
          success: false,
          message: data.message || "Failed to add product",
        };
      }

      const totalItems = data.cart.items?.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCart({ ...data.cart, totalItems });
      return { success: true };
    } catch (error) {
      console.error("⚠️ Network error during addToCart:", error);
      return { success: false, message: "Network error occurred" };
    }
  };

  // ✏️ Update quantity of a product
  const updateCart = async (productId, quantity) => {
    try {
      const res = await fetch("https://restaurant-backend-tawny.vercel.app/carts/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error updating Cart");
        return { success: false };
      }

      const totalItems = data.cart.items?.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCart({ ...data.cart, totalItems });
      return { success: true };
    } catch (error) {
      console.error("⚠️ Network error during updateCart:", error);
      return { success: false };
    }
  };

  // ❌ Remove a product from the cart
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(
        `https://restaurant-backend-tawny.vercel.app/carts/remove/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Remove from cart failed:", data.message);
        return { success: false };
      }

      if (data.cart) {
        const totalItems = data.cart.items?.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCart({ ...data.cart, totalItems });
      } else {
        // fallback لو السيرفر مرجعش cart
        setCart((prev) => {
          const updatedItems =
            prev.items?.filter((item) => item.product._id !== productId) || [];
          const totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          return { ...prev, items: updatedItems, totalItems };
        });
      }

      return { success: true };
    } catch (error) {
      console.error("⚠️ Network error during removeFromCart:", error);
      return { success: false };
    }
  };

  // 🗑️ Clear the entire cart
  const clearCart = () => {
    setCart({ items: [], totalItems: 0 });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook to use the cart context
export const useCart = () => useContext(CartContext);
