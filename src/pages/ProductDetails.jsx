import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../auth/CartContext";

// 💡 دالة للتحقق مما إذا كان المسار رابط URL كامل
const isFullUrl = (str) => {
  if (typeof str !== "string" || str.length === 0) return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

// 🛑 ثابت لمسار الصور الأساسي
const IMAGE_BASE_URL = "https://restaurant-backend-tawny.vercel.app/images/";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`https://restaurant-backend-tawny.vercel.app/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("🧩 Data from backend:", data);
        setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  // 💡 دالة لتحديد مسار الصورة الصحيح
  const getImageUrl = (imageName) => {
    if (!imageName)
      return "https://via.placeholder.com/450x450?text=No+Image";
    return isFullUrl(imageName)
      ? imageName
      : `${IMAGE_BASE_URL}${imageName}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-44">
        <div className="w-10 h-10 border-4 border-[#F86D72] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  // إذا لم يتم العثور على المنتج بعد التحميل
  if (!product) {
    return (
      <div className="text-center py-20 mt-44 text-xl text-red-600 font-medium">
        Product not found.
      </div>
    );
  }

  // 💰 حساب السعر بعد الخصم
  const discountedPrice =
    product.discountPercent && parseFloat(product.discountPercent) > 0
      ? product.price -
        (product.price * parseFloat(product.discountPercent)) / 100
      : null;

  return (
    <div className="mt-56 max-w-6xl mx-auto px-6 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-white shadow-xl rounded-lg p-8">
        {/* منطقة الصورة */}
        <div className="flex justify-center">
          <img
            className="w-full max-w-[450px] h-[450px] object-cover rounded-xl shadow-lg"
            src={getImageUrl(product.coverImage)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/450x450?text=No+Image";
            }}
            alt={product.name}
          />
        </div>

        {/* تفاصيل المنتج */}
        <div>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-5">
            {product.name}
          </h3>

          <div className="flex items-center gap-3 mb-4">
            {discountedPrice ? (
              <>
                <p className="text-2xl font-bold text-[#F86D72]">
                  ${discountedPrice.toFixed(2)}
                </p>
                <p className="text-lg font-medium text-gray-500 line-through">
                  ${product.price}
                </p>
                <span className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  -{product.discountPercent}% OFF
                </span>
              </>
            ) : (
              <p className="text-3xl font-bold text-[#F86D72]">
                ${product.price}
              </p>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed border-b pb-4">
            {product.description}
          </p>

          <p
            className={`font-semibold ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            } mb-4`}
          >
            {product.stock > 0
              ? `✅ In Stock: ${product.stock} Available`
              : "❌ Out of Stock"}
          </p>

          <div className="mt-2 mb-8">
            <span className="text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
              Category: {product.category?.name || "N/A"}
            </span>
          </div>

          <button
            onClick={() => {
              addToCart(product._id);
              // تقليل المخزون محليًا لتجربة فورية
              setProduct((prev) => ({
                ...prev,
                stock: (prev.stock || 0) - 1,
              }));
              setMessage("✅ Added To Cart Successfully");
              setTimeout(() => setMessage(""), 2000);
            }}
            disabled={product.stock === 0}
            className="mt-7 w-64 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          {message && (
            <div className="mb-4 p-3 mt-5 rounded bg-green-100 text-green-700 text-center font-medium w-64">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
