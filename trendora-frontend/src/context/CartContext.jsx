import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () =>
  useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cartItems, setCartItems] =
    useState([]);

  /*
   * Load the cart whenever the logged-in user changes
   */
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const userId = user._id;

    const savedCart =
      localStorage.getItem(
        `cart_${userId}`
      );

    if (savedCart) {
      setCartItems(
        JSON.parse(savedCart)
      );
    } else {
      setCartItems([]);
    }
  }, [user]);


  /*
   * Save cart for the current user
   */
  useEffect(() => {
    if (!user) return;

    const userId = user._id;

    localStorage.setItem(
      `cart_${userId}`,
      JSON.stringify(cartItems)
    );
  }, [cartItems, user]);


  /*
   * Add product to cart
   */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item._id === product._id
      );

      if (existing) {
        if (
          existing.quantity >=
          product.count
        ) {
          alert(
            "Only " +
            product.count +
            " item(s) available in stock."
          );

          return prev;
        }

        return prev.map((item) =>
          item._id === product._id
            ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
            : item
        );
      }

      if (product.count <= 0) {
        alert(
          "This product is currently out of stock."
        );

        return prev;
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };


  /*
   * Remove product
   */
  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => item._id !== id
      )
    );
  };


  /*
   * Increase quantity
   */
  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== id) {
          return item;
        }

        if (
          item.quantity >=
          item.count
        ) {
          alert(
            "Maximum available stock reached."
          );

          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };


  /*
   * Decrease quantity
   */
  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };


  /*
   * Clear cart
   */
  const clearCart = () => {
    setCartItems([]);
  };


  /*
   * Total items
   */
  const totalItems =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


  /*
   * Total price
   */
  const totalPrice =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );

  const totalWeightGrams = cartItems.reduce(
    (sum, item) => sum + Number(item.weight || 0) * item.quantity,
    0
  );

  const totalWeightKg = totalWeightGrams / 1000;
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
            totalWeightGrams,
    totalWeightKg,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}