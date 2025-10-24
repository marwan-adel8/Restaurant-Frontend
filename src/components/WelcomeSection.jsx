import React from "react";
import { motion } from "framer-motion";
import heroDish from "../assets/dish-2 2.png";
import vector from "../assets/Vector.png";
import verctorOne from "../assets/Vector (1).png";
import { useNavigate } from "react-router-dom";

const WelcomeSection = () => {
  const navigate = useNavigate();
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const dishVariants = {
    initial: { opacity: 0, x: -100, rotate: -15 },
    animate: {
      opacity: 1,
      x: 0,
      rotate: -10,
      transition: { duration: 1, type: "spring", stiffness: 60, delay: 0.3 },
    },
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center relative bg-gray-50 overflow-hidden py-20 px-4">
      <img
        src={vector}
        alt="Rosemary"
        className="absolute top-1/4 right-0 w-80 h-auto opacity-20 hidden lg:block"
      />
      <img
        src={verctorOne}
        alt="Garlic"
        className="absolute bottom-10 left-1/2 w-40 h-auto opacity-10 hidden lg:block"
        style={{ transform: "translateX(-150%)" }}
      />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16 md:gap-32 lg:gap-40 xl:gap-52 z-10">
        <motion.div
          variants={dishVariants}
          initial="initial"
          animate="animate"
          className="relative flex justify-center md:justify-end"
        >
          <img
            src={heroDish}
            alt="Special Dish"
            className="w-full max-w-lg drop-shadow-2xl"
            style={{ maxWidth: "500px", transform: "rotate(-10deg)" }}
          />
        </motion.div>
        <div className="text-center md:text-left space-y-6">
          <motion.h2
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl lg:text-5xl font-serif font-extrabold text-[#111827] leading-snug"
          >
            Welcome to Our <br />
            Restaurant
          </motion.h2>
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-md mx-auto md:mx-0 text-base hidden md:block" // 🔑 التعديل هنا: إخفاء على الموبايل (hidden) وإظهار على الديسكتوب (md:block)
          >
            Indulge in a world of rich flavors and warm hospitality.
            <br />
            At our restaurant, every dish is crafted with passion,
            <br />
            fresh ingredients, and a touch of love — because you deserve the best dining experience.
          </motion.p>
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="flex justify-center md:justify-start space-x-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/menu')}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1F2937] text-white font-semibold py-3 w-[150px] rounded-lg shadow-md hover:bg-gray-700 transition-colors"
            >
              Menu
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;