import React from "react";
import { useCart } from "../auth/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ تم إضافة استيراد react-hot-toast

// 💡 دالة للتحقق مما إذا كان المسار رابط URL كامل
const isFullUrl = (str) => {
  if (typeof str !== "string" || str.length === 0) return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

// 🛑 ثابت لمسار الصور الأساسي
const IMAGE_BASE_URL = "https://restaurant-backend-tawny.vercel.app/images/";

function CartPage() {
  const { cart, updateCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-48">
        <p className="text-gray-500 text-lg">🛒 Your Cart Is Empty</p>
      </div>
    );
  }

  // 💰 حساب المجموع الكلي
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      let itemPrice = item.product.price;

      // تطبيق الخصم إن وجد
      if (
        item.product.discountPercent &&
        parseFloat(item.product.discountPercent) > 0
      ) {
        itemPrice =
          item.product.price -
          (item.product.price * parseFloat(item.product.discountPercent)) / 100;
      }

      return total + itemPrice * item.quantity;
    }, 0);
  };

  // 💡 تحديد مصدر الصورة الصحيح
  const getImageUrl = (imageName) => {
    if (!imageName) return "https://via.placeholder.com/96x128?text=No+Image";
    return isFullUrl(imageName) ? imageName : `${IMAGE_BASE_URL}${imageName}`;
  };

  // ✅ دالة الحذف الجديدة مع الإشعار
  const handleDeleteItem = (productId, productName) => {
    removeFromCart(productId);
    toast( `🗑️ ${productName} deleted Successfully` , {
        duration: 3000,
        style: {
            background: '#fef2f2',
            color: '#b91c1c',
            fontWeight: 'bold',
            border: '1px solid #fca5a5',
        },
    });
  };

  return (
    <div className="mt-44 min-h-screen p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-5 border-b pb-4">
        <h3 className="text-3xl font-bold text-gray-800">My Cart</h3>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition font-semibold w-[220px]"
        >
          Proceed to Checkout
        </button>
      </div>

      <div className="space-y-4">
        {cart?.items?.map((item) => (
          <div
            key={item.product._id}
            className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-4 shadow-sm bg-white"
          >
            <img
              src={getImageUrl(item?.product?.coverImage)}
              alt={item?.product?.name}
              className="rounded w-24 h-24 sm:h-32 object-cover flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/96x128?text=No+Image";
              }}
            />

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg truncate">
                {item?.product?.name}
              </h2>
              <p className="text-gray-500 text-sm line-clamp-2">
                {item?.product?.description}
              </p>
            </div>

            {/* السعر والكمية */}
            <div className="flex flex-col sm:flex-row items-center justify-between sm:w-auto w-full gap-4 sm:gap-8">
              {/* السعر */}
              <div className="flex flex-col items-center sm:items-start min-w-[100px]">
                <div className="flex items-center gap-2">
                  {item.product.discountPercent &&
                  parseFloat(item.product.discountPercent) > 0 ? (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ${item.product.price}
                      </span>
                      <span className="text-[#F86D72] font-bold">
                        $
                        {(
                          item.product.price -
                          (item.product.price *
                            parseFloat(item.product.discountPercent)) /
                            100
                        ).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#F86D72] font-bold">
                      ${item?.product.price}
                    </span>
                  )}
                </div>
                {item.product.discountPercent &&
                  parseFloat(item.product.discountPercent) > 0 && (
                    <span className="text-xs text-red-600 mt-1">
                      -{item.product.discountPercent}% OFF
                    </span>
                  )}
              </div>

              {/* التحكم في الكمية */}
              <div className="flex items-center border rounded-lg overflow-hidden divide-x text-lg">
                <button
                  className="px-3 py-1 bg-[#1F2937] hover:bg-[#171b20] disabled:opacity-50 transition"
                  disabled={item?.quantity <= 1}
                  onClick={() =>
                    updateCart(item?.product._id, item?.quantity - 1)
                  }
                >
                  -
                </button>

                <span className="px-4 text-base">{item?.quantity}</span>

                <button
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600  transition"
                  onClick={() =>
                    updateCart(item?.product._id, item?.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* المجموع الفرعي وحذف المنتج */}
            <div className="flex flex-col items-end sm:text-right min-w-[120px] pt-2 sm:pt-0">
              <p className="text-gray-700 text-sm">Item Subtotal:</p>
              <p className="text-xl font-bold text-[#F86D72]">
                $
                {(() => {
                  let itemPrice = item.product.price;
                  if (
                    item.product.discountPercent &&
                    parseFloat(item.product.discountPercent) > 0
                  ) {
                    itemPrice =
                      item.product.price -
                      (item.product.price *
                        parseFloat(item.product.discountPercent)) /
                        100;
                  }
                  return (itemPrice * item.quantity).toFixed(2);
                })()}
              </p>

              <button
                // ✅ استخدام دالة الحذف الجديدة مع الإشعار
                onClick={() => handleDeleteItem(item.product._id, item.product.name)}
                className="text-white text-sm mt-1 bg-[#1F2937] hover:bg-[#171b20]"
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* الإجمالي */}
      <div className="mt-12 p-6 bg-gray-100 rounded-xl shadow-inner max-w-sm ml-auto">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-800">
            Total Amount:
          </span>
          <span className="text-3xl font-extrabold text-orange-600">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
