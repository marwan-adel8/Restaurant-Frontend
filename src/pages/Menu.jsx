import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useCart } from "../auth/CartContext";
import decorativeElement from "../assets/Vector (2).png";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ استيراد التوستر

const IMAGE_BASE_URL = "https://restaurant-backend-tawny.vercel.app/images/";

const isFullUrl = (str) => {
  if (typeof str !== "string" || str.length === 0) return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

const groupDishesByCategory = (dishes) => {
  return dishes.reduce((acc, dish) => {
    const categoryName = dish.category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(dish);
    return acc;
  }, {});
};

const calculateDiscountedPrice = (price, discountPercent) => {
  if (!price || !discountPercent || discountPercent <= 0) return price;
  const originalPrice = parseFloat(price);
  const discount = parseFloat(discountPercent);
  return originalPrice - (originalPrice * discount) / 100;
};

const Menu = () => {
  const [groupedDishes, setGroupedDishes] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ❌ تم حذف حالة 'message'
  // const [message, setMessage] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await axios.get(
          "https://restaurant-backend-tawny.vercel.app/products/getProducts"
        );
        const dishes = res.data.products || [];
        const grouped = groupDishesByCategory(dishes);
        setGroupedDishes(grouped);

        const allCategories = Object.keys(grouped);
        setCategories(allCategories);
        if (allCategories.length > 0) setActiveCategory(allCategories[0]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dishes:", err);
        setError("Failed to load menu items.");
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  const handleAddToCart = (dish) => {
    addToCart(dish._id);
    
    // ✅ الكود الجديد: استخدام toast.success
    toast.success(`✅ ${dish.name} added to cart!`, {
        duration: 2000, 
        style: {
          background: '#333',
          color: '#fff',
        },
    });
    // ❌ تم حذف الكود القديم:
    // setMessage("✅ Added To Cart Successfully");
    // setTimeout(() => setMessage(""), 2000);
  };

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-medium">
        Loading Menu...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-600 font-medium">
        {error}
      </div>
    );

  const currentDishes = activeCategory ? groupedDishes[activeCategory] : [];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const dishCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section className="py-[150px] bg-gray-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-4 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-serif font-extrabold text-[#111827] mb-3"
        >
          Our Special Dishes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600 max-w-lg mx-auto"
        >
          Taste the dishes everyone’s talking about! Fresh, flavorful, and made
          with love — our specials are here to impress.
        </motion.p>

        {/* ❌ تم إزالة عرض الرسالة المباشر */}
        {/* {message && (
          <p className="text-green-600 text-center mt-4 font-semibold">
            {message}
          </p>
        )} */}
      </div>

      <div className="max-w-6xl mx-auto px-4 mb-16 flex justify-center flex-wrap gap-4">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category)}
            className={`py-2 px-6 rounded-full font-medium transition-colors duration-300 shadow-md ${
              category === activeCategory
                ? "bg-orange-600 text-white shadow-orange-500/50"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeCategory}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
      >
        {currentDishes.map((dish) => (
          <motion.div
            key={dish._id}
            variants={dishCardVariants}
            className="group relative flex flex-col items-center bg-white rounded-3xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 p-4 pt-0"
            style={{ border: "1px solid #f0f0f0" }}
          >
            <div className="relative w-full h-48 flex justify-center items-center -mt-10">
              <Link
                to={`/productDetails/${dish._id}`}
                className="w-40 h-40 rounded-full shadow-lg bg-white overflow-hidden flex items-center justify-center border-4 border-white"
              >
                <img
                  src={
                    dish.coverImage && isFullUrl(dish.coverImage)
                      ? dish.coverImage
                      : `${IMAGE_BASE_URL}${
                          dish.coverImage || "placeholder.jpg"
                        }`
                  }
                  alt={dish.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/160x160?text=No+Image";
                  }}
                />
              </Link>

              <div className="absolute top-0 right-10 bg-gray-900 text-white text-xs font-bold w-auto h-10 rounded-full flex items-center justify-center shadow-lg px-3">
                {dish.discountPercent &&
                parseFloat(dish.discountPercent) > 0 ? (
                  <div className="text-center flex items-center gap-1">
                    <div className="text-xs line-through opacity-75">
                      ${dish.price}
                    </div>
                    <div className="text-sm font-bold">
                      $
                      {calculateDiscountedPrice(
                        dish.price,
                        dish.discountPercent
                      ).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  `$${dish.price}`
                )}
              </div>
            </div>

            <div className="text-center mt-2 flex flex-col flex-1 pb-4">
              <div className="hover:text-orange-500 transition">
                <h6 className="font-semibold text-lg text-gray-800 mb-2">
                  {dish.name}
                </h6>
              </div>
              <p className="text-gray-500 text-sm px-2 flex-1 line-clamp-3">
                {dish.description}
              </p>
            </div>

            <button
              onClick={() => handleAddToCart(dish)}
              disabled={dish.stock === 0}
              className="absolute bottom-0 left-0 w-full bg-orange-500 text-white font-semibold py-2 rounded-b-3xl opacity-0 group-hover:opacity-100 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {dish.stock === 0 ? "Out of stock" : "Quick Add"}
            </button>
          </motion.div>
        ))}

        {currentDishes.length === 0 && (
          <p className="col-span-4 text-center text-gray-500 text-lg">
            No dishes found in the {activeCategory} category.
          </p>
        )}
      </motion.div>

      <img
        src={decorativeElement}
        alt="Decorative"
        className="absolute bottom-5 right-5 w-40 h-auto opacity-10 hidden lg:block"
      />
    </section>
  );
};

export default Menu;
