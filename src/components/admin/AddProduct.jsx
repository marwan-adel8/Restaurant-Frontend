import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryName: "",
    discountPercent: "",
    isFeautred: false,
    isOnSale: false,
    coverImage: null,
  });

  // 🧮 دالة حساب السعر بعد الخصم
  const calculateDiscountedPrice = (price, discountPercent) => {
    if (!price || !discountPercent || discountPercent <= 0) return price;
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercent);
    return originalPrice - (originalPrice * discount) / 100;
  };

  // 🧩 تحميل التصنيفات من السيرفر
  const loadCats = useCallback(async () => {
    setLoadingCats(true);
    try {
      const res = await fetch("https://restaurant-backend-tawny.vercel.app/category/getCategories", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        console.error("Not authorized to fetch categories, redirecting...");
        navigate("/", { replace: true });
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch categories.");

      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCats(false);
    }
  }, [navigate]);

  // 🧭 التأكد من الصلاحية
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !isAdmin) {
      console.log("User not authenticated or not admin, redirecting...");
      navigate("/", { replace: true });
      return;
    }

    loadCats();
  }, [loading, navigate, isAuthenticated, isAdmin, loadCats]);

  // ✏️ تحديث القيم داخل الفورم
  const onChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;
      setForm((p) => ({ ...p, [name]: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
      return;
    }

    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }

    if (name === "categorySelect") {
      if (value === "createNew") {
        setIsCreatingNewCategory(true);
        setForm((p) => ({ ...p, categoryName: "" }));
      } else {
        setIsCreatingNewCategory(false);
        const selected = categories.find((c) => c._id === value);
        setForm((p) => ({
          ...p,
          categoryName: selected ? selected.name : "",
        }));
      }
      return;
    }

    if (name === "categoryNameInput") {
      setForm((p) => ({ ...p, categoryName: value }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  // 🚀 إرسال الفورم
  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!isAuthenticated || !isAdmin) {
      navigate("/", { replace: true });
      return;
    }

    const finalCategoryName = form.categoryName?.trim();

    if (!form.name || !form.description || !form.price || !form.stock || !finalCategoryName) {
      setMsg("❌ All fields (name, description, price, stock, and category name) are required.");
      return;
    }

    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);
    const discountPercent = parseInt(form.discountPercent, 10) || 0;

    if (
      isNaN(price) ||
      price < 0 ||
      isNaN(stock) ||
      stock < 0 ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      setMsg(
        "❌ Price and Stock must be valid non-negative numbers, and Discount must be between 0 and 100."
      );
      return;
    }

    const fd = new FormData();
    fd.append("isFormDataValid", "true");
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", String(price));
    fd.append("stock", String(stock));
    fd.append("discountPercent", String(discountPercent));
    fd.append("categoryName", finalCategoryName);
    fd.append("isFeautred", String(form.isFeautred));
    fd.append("isOnSale", String(form.isOnSale));
    if (form.coverImage) fd.append("coverImage", form.coverImage);

    try {
      setSubmitting(true);

      const res = await fetch("https://restaurant-backend-tawny.vercel.app/admin/addProduct", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403) {
        setMsg("❌ Not authorized");
        navigate("/", { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(data?.msg || data?.error || "Failed to add product");
      }

      setMsg("✅ Product added successfully! Reloading categories...");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryName: "",
        discountPercent: "",
        isFeautred: false,
        isOnSale: false,
        coverImage: null,
      });

      setPreview(null);
      setIsCreatingNewCategory(false);
      loadCats();
    } catch (err) {
      setMsg(`❌ ${err.message || "An unknown error occurred"}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ⏳ تحميل
  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );

  if (!isAuthenticated || !isAdmin) return null;

  // 🧾 واجهة الإضافة
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-2">Add New Product</h2>

      <form
        onSubmit={onSubmit}
        className="bg-white border border-slate-200 rounded-xl p-5 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* 🏷️ الاسم */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Name *
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Product name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 transition"
            />
          </div>

          {/* 💲 السعر */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
              Price *
            </label>
            <input
              id="price"
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={onChange}
              placeholder="e.g. 19.99"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 transition"
            />
          </div>

          {/* 🧾 الوصف */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={onChange}
              placeholder="Write a short description..."
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 transition"
            />
          </div>

          {/* 📦 المخزون */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
              Stock *
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              min="0"
              step="1"
              value={form.stock}
              onChange={onChange}
              placeholder="e.g. 20"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 transition"
            />
          </div>

          {/* 🎟️ الخصم */}
          <div>
            <label
              htmlFor="discountPercent"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Discount Percent
            </label>
            <input
              id="discountPercent"
              type="number"
              name="discountPercent"
              min="0"
              max="100"
              step="1"
              value={form.discountPercent}
              onChange={onChange}
              placeholder="e.g. 10"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 transition"
            />

            {form.price && form.discountPercent && parseFloat(form.discountPercent) > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Original Price:</span>
                  <span className="text-lg font-semibold text-gray-800">${form.price}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">After Discount:</span>
                  <span className="text-lg font-bold text-green-600">
                    $
                    {calculateDiscountedPrice(form.price, form.discountPercent).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">You Save:</span>
                  <span className="text-sm font-semibold text-red-600">
                    $
                    {(
                      parseFloat(form.price) -
                      calculateDiscountedPrice(form.price, form.discountPercent)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 🗂️ التصنيف */}
          <div className="md:col-span-2">
            <label htmlFor="categorySelect" className="block text-sm font-medium text-slate-700 mb-1">
              Category Name (Select or Create New) *
            </label>

            <select
              id="categorySelect"
              name="categorySelect"
              onChange={onChange}
              disabled={loadingCats || submitting}
              value={
                isCreatingNewCategory
                  ? "createNew"
                  : categories.find((c) => c.name === form.categoryName)?._id || ""
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer"
            >
              <option value="">
                {loadingCats
                  ? "Loading categories..."
                  : "Select existing category (Optional)"}
              </option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
              <option value="createNew" className="font-bold text-slate-900">
                + Create New Category
              </option>
            </select>

            {isCreatingNewCategory && (
              <div className="mt-4">
                <label
                  htmlFor="categoryNameInput"
                  className="block text-xs font-medium text-slate-500 mb-1"
                >
                  Enter New Category Name *
                </label>
                <input
                  id="categoryNameInput"
                  type="text"
                  name="categoryNameInput"
                  value={form.categoryName}
                  onChange={onChange}
                  placeholder="e.g. Desserts"
                  required
                  className="w-full rounded-lg border border-orange-500 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
              </div>
            )}
          </div>

          {/* ✅ الاختيارات */}
          <div className="flex items-center gap-6 md:col-span-2 pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeautred"
                checked={form.isFeautred}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-800"
              />
              <span className="text-sm font-medium text-slate-700">Featured</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isOnSale"
                checked={form.isOnSale}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-800"
              />
              <span className="text-sm font-medium text-slate-700">On Sale</span>
            </label>
          </div>

          {/* 🖼️ الصورة */}
          <div className="md:col-span-2">
            <label htmlFor="coverImage" className="block text-sm font-medium text-slate-700 mb-1">
              Cover Image
            </label>
            <input
              id="coverImage"
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={onChange}
              ref={fileInputRef}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition"
            />
            {preview && (
              <div className="mt-4">
                <p className="text-sm text-slate-500 mb-2">Image Preview:</p>
                <img
                  src={preview}
                  alt="Product cover preview"
                  className="h-40 w-40 object-cover rounded-lg border-4 border-slate-100 shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* 🧠 الرسائل */}
        {msg && (
          <p
            className={`text-sm font-semibold pt-4 ${
              msg.startsWith("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {msg}
          </p>
        )}

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={submitting}
          className="relative inline-flex items-center justify-center gap-3 w-[250px]
                    rounded-lg bg-slate-900 text-white px-8 py-3 text-lg font-bold
                    hover:bg-slate-700 disabled:opacity-50 transition-all duration-200
                    shadow-md whitespace-nowrap"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </span>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
