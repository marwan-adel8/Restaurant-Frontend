import React, { useEffect, useState } from "react";
import { useCart } from "../auth/CartContext";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast'; // ✅ استيراد مكتبة الـ toast

// ✅ Helper function to check full URL
const isFullUrl = (str) => {
  if (typeof str !== "string" || str.length === 0) return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

// 🛑 Base image URL for backend
const IMAGE_BASE_URL = "https://restaurant-backend-tawny.vercel.app/images/";

// 🔑 Helper function to calculate discounted price
const calculateDiscountedPrice = (price, discountPercent) => {
  const p = parseFloat(price);
  const d = parseFloat(discountPercent);
  if (isNaN(p) || isNaN(d) || d <= 0) return p;
  return p - (p * d) / 100;
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  // ❌ تم إزالة حالة 'message' لأننا سنستخدم الـ toast
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetch("https://restaurant-backend-tawny.vercel.app/products/getProducts")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = Array.isArray(data.products) ? data.products : [];

        // 🔑 Filter by specific category (e.g., "Special Dishes")
        const SPECIFIC_CATEGORY_NAME = "Special Dishes";

        const categoryProducts = allProducts.filter(
          (p) => p.category && p.category.name === SPECIFIC_CATEGORY_NAME
        );

        // 💡 Fallback: use all products if none match the category
        const productsSource =
          categoryProducts.length > 0 ? categoryProducts : allProducts;

        setProducts(productsSource);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const displayedProducts = products.slice(0, 4);

  const getImageUrl = (imageName) => {
    if (!imageName)
      return "https://via.placeholder.com/160x160?text=No+Image";
    return isFullUrl(imageName)
      ? imageName
      : `${IMAGE_BASE_URL}${imageName}`;
  };

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 text-center">
      <h3 className="text-4xl font-serif font-extrabold text-gray-800 mb-4">
        Our Special Dishes
      </h3>
      <p className="text-gray-600 max-w-lg mx-auto mb-16">
        The most requested and loved dishes by our customers.
      </p>

      {/* ❌ تم إزالة عرض الرسالة المباشر */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div
              key={product._id}
              className="group relative flex flex-col items-center bg-white rounded-3xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 p-4 pt-0"
              style={{ border: "1px solid #f0f0f0" }}
            >
              {/* 🖼️ Image Section */}
              <div className="relative w-full h-48 flex justify-center items-center -mt-10">
                <Link
                  to={`/productDetails/${product._id}`}
                  className="w-40 h-40 rounded-full shadow-lg bg-white overflow-hidden flex items-center justify-center border-4 border-white"
                >
                  <img
                    src={getImageUrl(product.coverImage)}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/160x160?text=No+Image";
                    }}
                  />
                </Link>

                {/* 💰 Price Tag */}
                <div className="absolute top-0 right-10 bg-gray-900 text-white text-xs font-bold w-auto h-10 rounded-full flex items-center justify-center shadow-lg px-3 z-10">
                  {product.discountPercent &&
                  parseFloat(product.discountPercent) > 0 ? (
                    <div className="text-center flex items-center gap-1">
                      <div className="text-xs line-through opacity-75">
                        ${parseFloat(product.price).toFixed(2)}
                      </div>
                      <div className="text-sm font-bold">
                        $
                        {calculateDiscountedPrice(
                          product.price,
                          product.discountPercent
                        ).toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm font-bold">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* 📝 Product Info */}
              <div className="text-center mt-2 flex flex-col flex-1 pb-4">
                <Link
                  to={`/productDetails/${product._id}`}
                  className="hover:text-orange-500 transition"
                >
                  <h6 className="font-semibold text-xl text-gray-800 mb-2 mt-4">
                    {product.name}
                  </h6>
                </Link>

                <p className="text-gray-500 text-sm px-2 flex-1 line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* 🛒 Add to Cart Button */}
              <button
                onClick={() => {
                  addToCart(product._id);
                  setProducts((prev) =>
                    prev.map((p) =>
                      p._id === product._id
                        ? { ...p, stock: (p.stock || 0) - 1 }
                        : p
                    )
                  );
                  
                  // ✅ الكود الجديد: استخدام toast.success
                  toast.success(`✅ ${product.name} added to cart!`, {
                    duration: 2000, 
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                  }); 
                }}
                disabled={product.stock === 0}
                className="absolute bottom-0 left-0 w-full bg-orange-500 text-white font-semibold py-2 rounded-b-3xl opacity-0 group-hover:opacity-100 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? "Out of stock" : "Quick Add"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-4">
            No special dishes available right now.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
