import React, { useState } from "react";
import { useCart } from "../auth/CartContext";
import { useNavigate } from "react-router-dom";

// ✅ دالة للتحقق إذا كان المسار URL كامل
const isFullUrl = (str) => {
  if (typeof str !== "string" || str.length === 0) return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

// 🖼️ ثابت لمسار الصور من السيرفر
const IMAGE_BASE_URL = "https://restaurant-backend-tawny.vercel.app/images/";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
  });

  // 📋 تغيير القيم في الفورم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ حساب الإجمالي
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      let price = item.product.price;

      if (item.product.discountPercent && parseFloat(item.product.discountPercent) > 0) {
        price =
          item.product.price -
          (item.product.price * parseFloat(item.product.discountPercent)) / 100;
      }

      return total + price * item.quantity;
    }, 0);
  };

  // 🖼️ دالة لتحديد مصدر الصورة الصحيح
  const getImageUrl = (imageName) => {
    if (!imageName) return "https://via.placeholder.com/64x64?text=No+Image";
    return isFullUrl(imageName) ? imageName : `${IMAGE_BASE_URL}${imageName}`;
  };

  // 🧾 عند إرسال الفورم
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    if (!form.customerName || !form.customerPhone || !form.customerAddress) {
      setMsg("❌ Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        notes: form.notes,
        items: cart.items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("https://restaurant-backend-tawny.vercel.app/orders/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Failed to create order");

      setMsg("✅ Order placed successfully! Your order ID is: " + data.orderId);
      clearCart();

      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      setMsg("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔸 لو السلة فاضية
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-44">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">🛒 Your Cart Is Empty</p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
          Finalize Your Order
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 🧾 بيانات العميل */}
          <div className="bg-white rounded-xl shadow-2xl p-6 h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              Delivery Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="customerAddress"
                  value={form.customerAddress}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Enter your delivery address"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Any special instructions..."
                />
              </div>

              {/* Message */}
              {msg && (
                <div
                  className={`p-3 rounded-lg font-medium text-center ${
                    msg.startsWith("✅")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {msg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 transition"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 
                        0 5.373 0 12h4zm2 5.291A7.962 7.962 
                        0 014 12H0c0 3.042 1.135 5.824 
                        3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Confirm & Place Order"
                )}
              </button>
            </form>
          </div>

          {/* 🛒 ملخص الطلب */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {cart.items.map((item) => {
                let price = item.product.price;

                if (
                  item.product.discountPercent &&
                  parseFloat(item.product.discountPercent) > 0
                ) {
                  price =
                    item.product.price -
                    (item.product.price *
                      parseFloat(item.product.discountPercent)) /
                      100;
                }

                return (
                  <div
                    key={item.product._id}
                    className="flex items-start gap-4 p-3 border rounded-lg bg-gray-50 hover:bg-white transition"
                  >
                    <img
                      src={getImageUrl(item.product.coverImage)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/64x64?text=No+Image";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity:{" "}
                        <span className="font-bold">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {item.product.discountPercent &&
                      parseFloat(item.product.discountPercent) > 0 ? (
                        <p className="text-sm text-gray-500 line-through">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      ) : null}
                      <p className="font-bold text-lg text-orange-600">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* الإجمالي */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="flex justify-between text-lg text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span>Delivery Fee:</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold text-gray-800 mt-3 p-2 bg-orange-100 rounded-lg">
                <span>Total Amount:</span>
                <span className="text-orange-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
