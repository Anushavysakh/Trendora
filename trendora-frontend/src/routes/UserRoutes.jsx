import { Routes, Route } from "react-router-dom";

import Home from "../pages/user/home";
import Products from "../pages/user/Products";


function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}

export default UserRoutes;