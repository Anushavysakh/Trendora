import {
  createContext,
  useContext,
  useState,
} from "react";

const WishlistContext = createContext();

export const useWishlist = () =>
  useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] =
    useState([]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const alreadyExists = prev.some(
        (item) => item._id === product._id
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  const isInWishlist = (id) => {
    return wishlistItems.some(
      (item) => item._id === id
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}