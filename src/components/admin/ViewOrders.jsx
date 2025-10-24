import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const isFullUrl = (str) => {
  if (typeof str !== "string" || str.length === 0) return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/", { replace: true });
      return;
    }
    fetchOrders();
  }, [navigate, isAuthenticated, isAdmin]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://restaurant-backend-tawny.vercel.app/orders/getOrders", {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        setError("Not authorized");
        navigate("/", { replace: true });
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(
        `https://restaurant-backend-tawny.vercel.app/orders/updateOrderStatus/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update order status");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(
        `https://restaurant-backend-tawny.vercel.app/orders/deleteOrder/${orderId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete order");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  if (loading)
    return (
      <div className="p-8 text-center text-xl text-gray-700">
        Loading orders...
      </div>
    );

  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Orders Management ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Customer Information
                  </h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Name:</strong> {order.customerName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.customerPhone}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.customerAddress}
                    </p>
                    {order.notes && (
                      <p>
                        <strong>Notes:</strong> {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                      >
                        <img
                          src={
                            item.product?.coverImage &&
                            isFullUrl(item.product.coverImage)
                              ? item.product.coverImage
                              : `https://restaurant-backend-tawny.vercel.app/images/${
                                  item.product?.coverImage || "placeholder.jpg"
                                }`
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/48x48/CCCCCC/333333?text=No+Image";
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-sm text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-lg font-bold text-gray-800">
                      Total: ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pending",
                    "confirmed",
                    "preparing",
                    "ready",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order._id, status)}
                      disabled={updating === order._id || order.status === status}
                      className={`px-3 py-1 rounded text-sm font-medium transition ${
                        order.status === status
                          ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {updating === order._id
                        ? "Updating..."
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
