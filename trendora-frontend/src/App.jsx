import { Routes, Route } from "react-router-dom";

import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ProductDetails from "./pages/user/ProductDetails";
import CartPage from "./pages/user/CartPage";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Profile from "./pages/user/Profile";
import Checkout from "./pages/user/Checkout";
import Wishlist from "./pages/user/Wishlist";
import Search from "./pages/user/Search";
import MyOrders from "./pages/user/MyOrders";

function App() {
  return (
    <Routes>
      {/* User Website */}
      <Route path="/*" element={<UserRoutes />} />

      {/* Admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />
<Route path="/profile" element={<Profile />} />
<Route path="/checkout" element={<Checkout />} />
<Route
  path="/wishlist"
  element={<Wishlist />}

/>
<Route
  path="/search"
  element={<Search />}
/>
  <Route path="/orders" element={<MyOrders />} />


    </Routes>
  );
}

export default App;

