import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// ✅ دالة للتحقق مما إذا كان الرابط كامل (Cloudinary أو أي URL مباشر)
const isFullUrl = (str) => {
  if (typeof str !== "string" || str.length === 0) return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      console.log("Not authenticated or not admin, redirecting...");
      navigate("/", { replace: true });
      return;
    }

    // 📦 جلب جميع المنتجات
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://restaurant-backend-tawny.vercel.app/admin/getProducts", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401 || res.status === 403) {
          setError("Not authorized or session expired.");
          navigate("/", { replace: true });
          return;
        }

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const fetchedProducts = data?.products || data;
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate, isAuthenticated, isAdmin]);

  // 📂 تجميع المنتجات حسب التصنيف
  const groupProductsByCategory = (items) => {
    return items.reduce((acc, product) => {
      const categoryName = product?.category?.name || "Uncategorized";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(product);
      return acc;
    }, {});
  };

  const grouped = groupProductsByCategory(products);
  const categoryNames = Object.keys(grouped);

  // 💰 حساب السعر بعد الخصم
  const calculateDiscountedPrice = (price, discountPercent) => {
    if (!price || !discountPercent || discountPercent <= 0) return price;
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercent);
    return originalPrice - (originalPrice * discount) / 100;
  };

  if (loading)
    return (
      <div className="p-8 text-center text-xl text-gray-700">Loading...</div>
    );

  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        All Products ({products.length})
      </h2>

      {categoryNames.length === 0 && (
        <p className="text-gray-500 text-lg text-center py-12">
          No products available in the database.
        </p>
      )}

      {categoryNames.map((category) => (
        <div key={category} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
            <span className="text-sm text-gray-500">
              {grouped[category]?.length || 0} item(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {grouped[category].map((product) => (
              <a
                key={product._id}
                href={`/admin/update-product/${product._id}`}
                className="flex flex-col border border-gray-200 bg-white shadow-lg p-4 rounded-xl hover:shadow-xl transition duration-300"
              >
                {/* 🖼️ عرض الصورة من Cloudinary أو من السيرفر المحلي */}
                <img
                  src={
                    isFullUrl(product.coverImage)
                      ? product.coverImage // Cloudinary URL
                      : `https://restaurant-backend-tawny.vercel.app/images/${product.coverImage}` // Local
                  }
                  alt={product.name}
                  className="rounded-lg object-cover w-full h-48 mb-4 border border-gray-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/CCCCCC/333333?text=No+Image";
                  }}
                />

                <h4 className="font-bold text-lg text-gray-900 mb-1">
                  {product.name}
                </h4>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    {product.discountPercent &&
                    parseFloat(product.discountPercent) > 0 ? (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.price}
                        </span>
                        <strong className="text-[#F86D72] text-xl font-extrabold">
                          $
                          {calculateDiscountedPrice(
                            product.price,
                            product.discountPercent
                          ).toFixed(2)}
                        </strong>
                        <span className="text-xs text-red-600 font-semibold">
                          -{product.discountPercent}% OFF
                        </span>
                      </>
                    ) : (
                      <strong className="text-[#F86D72] text-xl font-extrabold">
                        ${product.price}
                      </strong>
                    )}
                  </div>

                  {product?.isOnSale && (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                      On Sale
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllProducts;
