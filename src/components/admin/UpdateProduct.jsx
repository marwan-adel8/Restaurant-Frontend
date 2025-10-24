import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const isFullUrl = (str) => {
  if (typeof str !== "string" || str.length === 0) return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catsRes] = await Promise.all([
          fetch(`https://restaurant-backend-tawny.vercel.app/products/${id}`, {
            credentials: "include",
          }),
          fetch("https://restaurant-backend-tawny.vercel.app/category/getCategories", {
            credentials: "include",
          }),
        ]);

        const prodData = await prodRes.json();
        const catsData = await catsRes.json();

        setProduct(prodData.product);
        setCategories(
          Array.isArray(catsData?.categories) ? catsData.categories : []
        );
      } catch (err) {
        console.error("Error loading data:", err);
        setMsg("Failed to load product or categories");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && isAdmin) load();
  }, [id, isAuthenticated, isAdmin]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProduct((prev) => ({
      ...prev,
      coverImage: file || prev.coverImage,
    }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const selectedCategoryId = useMemo(() => {
    return product?.category?._id || product?.category || "";
  }, [product]);

  const handleUpdate = async () => {
    if (!product) return;
    setMsg("");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", product.name || "");
      fd.append("description", product.description || "");
      fd.append("price", String(product.price ?? ""));
      fd.append("stock", String(product.stock ?? ""));
      fd.append("discountPercent", String(product.discountPercent ?? 0));
      fd.append(
        "isFeautred",
        String(product.isFeatured || product.isFeautred || false)
      );
      fd.append("isOnSale", String(product.isOnSale || false));
      if (selectedCategoryId) fd.append("category", selectedCategoryId);

      if (product.coverImage instanceof File) {
        fd.append("coverImage", product.coverImage);
      } else if (product.coverImage) {
        fd.append("coverImage", product.coverImage);
      }

      const res = await fetch(
        `https://restaurant-backend-tawny.vercel.app/admin/updateProduct/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body: fd,
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.msg || data?.error || "Failed to update");

      setMsg("✅ Product updated successfully");
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Error updating product:", error);
      setMsg(`❌ ${error.message || "Error updating product"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "isFeautred" || name === "isFeatured") {
        setProduct((prev) => ({
          ...prev,
          isFeautred: checked,
          isFeatured: checked,
        }));
      } else {
        setProduct((prev) => ({ ...prev, [name]: checked }));
      }
      return;
    }

    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!window.confirm("are you sure you want to delete this product")) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `https://restaurant-backend-tawny.vercel.app/admin/deleteProduct/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      alert(data.message);
      navigate("/admin");
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || loading || !product)
    return (
      <p className="mt-44 text-center text-xl text-gray-700">
        Loading Product Data...
      </p>
    );

  return (
    <div className="max-w-lg mx-auto mt-44 p-6 bg-white shadow rounded">
      <h3 className="mb-5 text-2xl font-bold text-gray-800">
        Update Product: {product.name}
      </h3>

      {msg && (
        <p
          className={`mb-4 text-sm font-semibold ${
            msg.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      )}

      <input
        className="border p-2 w-full mb-3 rounded"
        type="text"
        name="name"
        value={product.name || ""}
        onChange={handleChange}
        placeholder="Name"
      />

      <textarea
        className="border p-2 w-full mb-3 rounded"
        name="description"
        value={product.description || ""}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        className="border p-2 w-full mb-3 rounded"
        type="number"
        name="price"
        value={product.price || ""}
        onChange={handleChange}
        placeholder="Price"
      />

      <input
        className="border p-2 w-full mb-3 rounded"
        type="number"
        name="stock"
        value={product.stock || ""}
        onChange={handleChange}
        placeholder="Stock"
      />

      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">Category</label>
        <select
          className="border p-2 w-full rounded bg-white"
          value={selectedCategoryId}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex items-center gap-4">
        <label className="inline-flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            name="isFeautred"
            checked={Boolean(product.isFeatured || product.isFeautred)}
            onChange={handleChange}
            className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
          />
          <span>Featured</span>
        </label>

        <label className="inline-flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            name="isOnSale"
            checked={Boolean(product.isOnSale)}
            onChange={handleChange}
            className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
          />
          <span>On Sale</span>
        </label>
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">
          Discount Percent
        </label>
        <input
          className="border p-2 w-full rounded"
          type="number"
          name="discountPercent"
          min="0"
          max="100"
          value={product.discountPercent || 0}
          onChange={handleChange}
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm text-gray-600 mb-1">Cover Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div className="mt-3 flex items-center gap-4">
          {(preview || product.coverImage) && (
            <img
              className="w-32 h-32 object-cover rounded border border-gray-200 shadow-md"
              src={
                preview ||
                (isFullUrl(product.coverImage)
                  ? product.coverImage
                  : `https://restaurant-backend-tawny.vercel.app/images/${product.coverImage}`)
              }
              alt="Product image preview"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/128x128?text=Image+Error";
              }}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          disabled={saving || deleting}
          onClick={handleUpdate}
          className="px-6 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Product"}
        </button>

        <button
          disabled={deleting || saving}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:opacity-50"
          onClick={handleDelete}
        >
          {deleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>
    </div>
  );
}

export default UpdateProduct;
