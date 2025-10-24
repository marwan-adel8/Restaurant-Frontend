import React, { useEffect } from "react";
// 💡 استيراد Toaster من المكتبة
import { Toaster } from "react-hot-toast"; 
// ✅ تأكد من أن أسماء المجلدات والملفات صحيحة (components/Header)
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import AddProduct from "./components/admin/AddProduct";
import AllProducts from "./components/admin/AllProducts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./auth/CartContext";
import CartPages from "./pages/CartPages";
import UpdateProduct from "./components/admin/UpdateProduct";
import ProductDetails from "./pages/ProductDetails";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import ViewOrders from "./components/admin/ViewOrders";
import Contact from "./pages/Contact";
import About from "./pages/About";

const App = () => {
  const location = useLocation();

  // 1. التمرير للأعلى عند تغيير المسار
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideHeader = /^\/admin(\/|$)/.test(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        {/* 2. وضع Toaster هنا ليكون متاحاً في جميع أنحاء التطبيق */}
        <Toaster 
            position="top-right" 
            toastOptions={{
                success: {
                    duration: 3000,
                },
            }}
        />

        {!hideHeader && <Header />}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/cart" element={<CartPages />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/productDetails/:id" element={<ProductDetails />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<ViewOrders />} />
            <Route index element={<AllProducts />} />
            <Route
              path="/admin/update-product/:id"
              element={<UpdateProduct />}
            />
          </Route>
        </Routes>

        {!hideHeader && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
