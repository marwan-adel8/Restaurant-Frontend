import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // ✅ استدعاء الـ context

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { refreshAuth } = useAuth(); // ✅ هنستخدمها لتحديث المستخدم بعد الـ login

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("https://restaurant-backend-tawny.vercel.app/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Login failed");

      const role = data?.role || "user";
      const redirect = data?.redirect || (role === "admin" ? "/admin/products" : "/");

      // ✅ بعد تسجيل الدخول الناجح حدّث بيانات المستخدم في الـ context
      await refreshAuth();

      // ✅ ندي فرصة بسيطة لتحديث الـ state قبل الانتقال
      setTimeout(() => {
        navigate(redirect, { replace: true });
      }, 100);
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // التعديل هنا:
    // تم تغيير 'max-w-md' إلى 'max-w-sm' ليصبح أصغر على الشاشات الصغيرة (افتراضي).
    // وتم إضافة 'md:max-w-md' لإعادة العرض الأكبر على الشاشات المتوسطة والكبيرة.
    <div className="max-w-sm md:max-w-md mx-auto py-10 mt-40 px-4 sm:px-6"> 
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      <form className="mt-50" onSubmit={onSubmit}>
        <input
          // التعديل هنا: 
          // تم تقليل الـ padding من 'p-2' إلى 'p-1.5' على الشاشات الصغيرة لجعل الحقل أصغر قليلاً.
          className="w-full border p-1.5 md:p-2 rounded mb-6"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
        />

        <input
          // التعديل هنا:
          // تم تقليل الـ padding من 'p-2' إلى 'p-1.5' على الشاشات الصغيرة لجعل الحقل أصغر قليلاً.
          className="w-full border p-1.5 md:p-2 rounded mb-6"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
        />

        {err && <p className="text-red-500 text-sm">{err}</p>}

        <button
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;