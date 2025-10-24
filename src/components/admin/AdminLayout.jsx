import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Utensils,
  ClipboardList, // لم يتم استخدامها في الكود الأصلي، لكنها في القائمة
  PlusCircle,
  Home,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // حالة التحميل لمنع الوميض
  const navigate = useNavigate();

  // منطق التحقق من صلاحيات المشرف (محتفظ به كما هو)
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await fetch("https://restaurant-backend-tawny.vercel.app/admin/getProducts", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401 || res.status === 403) {
          navigate("/", { replace: true });
          return;
        }

        setLoading(false);
      } catch (error) {
        navigate("/", { replace: true });
        console.error("Not Admin:", error);
      }
    };
    checkAdminStatus();
  }, [navigate]);

  // عرض شاشة التحميل (محتفظ بها كما هي)
  if (loading) {
    return (
      // تم إضافة بعض التنسيقات لشاشة التحميل لتكون أجمل
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h4 className="font-extrabold text-2xl text-indigo-700 animate-pulse">Loading Admin Dashboard...</h4>
      </div>
    );
  }

  // التصميم الجديد
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* Header: شريط علوي ثابت وأكثر وضوحًا */}
      <header className="fixed w-full top-0 z-50 shadow-md h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center">
            <button
                className="md:hidden inline-flex items-center justify-center bg-transparent border-none text-indigo-600 rounded-lg p-2 mr-3 hover:bg-gray-100 transition-colors"
                aria-label="Open sidebar"
                onClick={() => setOpen(true)}
            >
                <Menu className="h-6 w-6" />
            </button>
            <h4 className="font-extrabold text-xl text-indigo-700 tracking-wider">
                🍕 Restaurant Admin Dashboard
            </h4>
        </div>
        {/* يمكن إضافة عناصر أخرى للـ Header هنا، مثل أيقونة المستخدم أو زر الخروج */}
      </header>

      {/* Main Content & Sidebar Container */}
      <div className="flex pt-16"> {/* إضافة padding-top ليناسب ارتفاع الـ fixed Header (h-16) */}
        
        {/* Sidebar: تصميم جانبي مميز بلون غامق */}
        {/* تمت إضافة fixed بدلاً من relative و top-0 و h-full لتثبيت الشريط الجانبي */}
        <aside
          className={` fixed top-16 left-0 h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 bg-gray-800 w-64 text-gray-50 z-40 ${
            open ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
          } md:shadow-none`}
        >
          {/* زر الإغلاق للشاشات الصغيرة */}
          <button
            className="md:hidden absolute top-3 right-3 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>

          <nav className="flex-1 space-y-2 p-4 mt-0">
            {/* NavLink Styling: تنسيقات جديدة للروابط */}
            {[
              { to: "/admin", icon: Utensils, text: "Manage Products" },
              { to: "/admin/add-product", icon: PlusCircle, text: "Add New Product" },
              { to: "/admin/orders", icon: ShoppingCart, text: "View Orders" },
              { to: "/", icon: Home, text: "Return To Home Page" },
            ].map((item, index) => (
              <NavLink 
                key={index}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-4 p-3 rounded-lg font-medium transition-colors duration-200 ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg" // لون التحديد النشط
                      : "text-gray-300 hover:bg-gray-700 hover:text-white" // لون الحالات غير النشطة
                  }`
                }
                onClick={() => setOpen(false)} // إغلاق السايدبار عند الضغط في شاشات الموبايل
              >
                <item.icon className="h-5 w-5" />
                <span>{item.text}</span>
              </NavLink>
            ))}
            
          </nav>
        </aside>

        {/* Main Content: تم إزاحة المحتوى ليظهر بشكل صحيح بجوار الشريط الجانبي الثابت */}
        <main className="w-full md:ml-64 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet /> {/* لعرض المكونات الخاصة بالـ Routes الفرعية */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;