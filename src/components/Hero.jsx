// src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";
import hero1 from "../assets/hero-1.png";
import hero2 from "../assets/dish-2 1.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const iconClass =
    "w-6 h-6 text-gray-800 hover:text-orange-500 cursor-pointer transition-colors border border-gray-300 rounded-full p-1";

  return (
    <section className="relative bg-gray-50 min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 overflow-hidden pt-24">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-30"></div>

      {/* الصور: تظهر أولاً على الموبايل (افتراضياً) وثانياً على الديسكتوب (md:order-2) */}
      <motion.div
        className="relative flex justify-center md:justify-end mt-10 md:mt-0 md:order-2"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2 }}
      >
        {/* خلفية مائلة: تصغير حجم الخلفية على الهاتف */}
        <div className="w-[300px] h-[380px] md:w-[400px] md:h-[500px] bg-gray-100 rounded-[2rem] shadow-2xl overflow-hidden transform rotate-[-5deg]">
          <img
            src={hero1}
            alt="Restaurant interior"
            className="w-full h-full object-cover transform rotate-[5deg] scale-105"
          />
        </div>

        {/* طبق الطعام: إخفاء على الشاشات الصغيرة */}
        <motion.img
          src={hero2}
          alt="Food Dish"
          className="absolute bottom-[-30px] left-[-100px] w-[220px] md:w-[260px] rotate-[-10deg] drop-shadow-2xl hidden md:block"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />
      </motion.div>

      {/* النصوص: تظهر ثانياً على الموبايل وأولاً على الديسكتوب (md:order-1) */}
      <motion.div
        className="space-y-6 max-w-xl z-10 text-center md:text-left md:order-1"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {/* العنوان */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] leading-tight font-[Poppins] mt-10 md:mt-0">
          Good vibes, great coffee, and amazing bites!
          <br />
        </h1>

        {/* الفقرة: 🔑 مخفية فقط على الشاشات الصغيرة (hidden) وظاهرة على الشاشات الكبيرة (md:block) */}
        <p className="hidden md:block text-gray-600 text-base max-w-lg mx-auto md:mx-0 leading-relaxed font-[Poppins]">
          Kick back, relax, and enjoy the perfect mix of cozy atmosphere and delicious food.
          <br />
          From freshly brewed coffee to mouthwatering dishes — we’ve got your cravings covered.
          <br />
        </p>

        {/* الأزرار */}
        <div className="flex justify-center md:justify-start space-x-4 pt-4">
          <motion.button
            onClick={() => navigate('/menu')}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1F2937] text-white font-semibold py-3 w-[150px] rounded-lg shadow-md hover:bg-gray-700 transition-colors font-[Poppins]"
          >
            Menu
          </motion.button>
          <motion.button
            onClick={() => navigate('/contact')}
            whileHover={{ scale: 1.05 }}
            className="bg-orange-600 text-white font-semibold py-3 w-[150px] rounded-lg shadow-md hover:bg-orange-700 transition-colors font-[Poppins]"
          >
            Book a table
          </motion.button>
        </div>

        {/* السوشيال ميديا */}
        <div className="flex justify-center md:justify-start space-x-3 pt-8">
          <Facebook className={iconClass} />
          <Instagram className={iconClass} />
          <Twitter className={iconClass} />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;