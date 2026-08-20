import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Categories from "../pages/admin/Categories";
import Users from "../pages/admin/Users";
import ProductForm from "../components/admin/ProductForm";
import CategoryForm from "../components/admin/CategoryForm";
import Orders from "../pages/admin/Orders";
import Reviews from "../pages/admin/Reviews";
import Login from "../pages/admin/Login";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import Banner from "../pages/admin/Banner";

function AdminRoutes() {
  return (
    <Routes>

      {/* PROTECTED ADMIN AREA */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<Dashboard />} />

        <Route path="products" element={<Products />} />
        <Route
          path="products/add"
          element={<ProductForm />}
        />
        <Route
          path="products/edit/:id"
          element={<ProductForm />}
        />

        <Route path="categories" element={<Categories />} />
        <Route
          path="categories/add"
          element={<CategoryForm />}
        />
        <Route
          path="categories/edit/:id"
          element={<CategoryForm />}
        />

        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="reviews" element={<Reviews />} />

        {/* BANNERS */}
        <Route
          path="banners"
          element={<Banner />}
        />
      </Route>

      {/* ADMIN LOGIN */}
      <Route
        path="login"
        element={<Login />}
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to="" replace />}
      />

    </Routes>
  );
}

export default AdminRoutes;