import React from "react";
import { motion } from "framer-motion";
import { Star, UserCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// يجب استبدال هذا المسار بمسار الرسم الزخرفي للمقلاة
import panGraphic from "../assets/Group.png";
import person from "../assets/person-1.png";

// دالة مساعدة للتحقق من أن المسار هو Placeholder وليس صورة حقيقية
const isImageAvailable = (path) => {
  // يفترض أن الصور الحقيقية لا تحتوي على "/path/to/"
  return path && !path.includes("/path/to/");
};

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Food Critic & Blogger",
    image: person,
    rating: 5,
    text: "Absolutely amazing! Every dish was bursting with flavor, and the presentation was stunning. The staff were friendly and attentive — definitely one of the best dining experiences I’ve ever had!",
  },
  {
    id: 2,
    name: "Michael Lee",
    title: "Entrepreneur",
    image: "/path/to/customer2.png",
    rating: 5,
    text: "From the warm ambiance to the delicious food, everything was perfect. You can really taste the freshness in every bite. I’ll be coming back again and again!",
  },
  {
    id: 3,
    name: "Olivia Brown",
    title: "Chef & Culinary Enthusiast",
    image: "/path/to/customer2.png",
    rating: 5,
    text: "A true gem! The chefs clearly put their heart into every plate. Every flavor felt balanced and authentic. Highly recommended for anyone who loves quality dining.",
  },
];


const CustomerReviews = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="min-h-screen relative bg-gray-50 overflow-hidden py-20 px-4 flex flex-col items-center">
      <img
        src={panGraphic}
        alt="Cooking Pan Graphic"
        className="absolute top-1/2 left-0 w-[400px] h-auto opacity-10 hidden lg:block"
        style={{ transform: "translateY(-50%)" }}
      />

      <div className="max-w-7xl mx-auto text-center z-10 w-full">
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl font-serif font-extrabold text-[#111827] mb-4"
        >
          Our Happy Customers
        </motion.h2>

        {/* 🔑 التعديل الأول: إخفاء الفقرة على الموبايل (hidden) وإظهارها على الشاشات المتوسطة وما فوق (md:block) */}
        <motion.p
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="text-gray-600 max-w-lg mx-auto mb-16 hidden md:block"
        >
          Our customers’ feedback is our pride — discover what they say about
          their experience with our cozy atmosphere and delicious dishes.
        </motion.p>


        {/* Swiper Slider */}
        {/* 🔑 التعديل الثاني: تقليل عرض القالب على الهاتف (max-w-xs) وزيادته تدريجياً على الشاشات الأكبر */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="mySwiper pt-10 pb-20"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 pt-20 rounded-t-[2rem] shadow-xl min-h-[400px] flex flex-col items-center text-center justify-between relative"
                >
                  {/* التحقق من توفر الصورة */}
                  {isImageAvailable(review.image) ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg absolute top-8"
                    />
                  ) : (
                    <UserCircle
                      className="w-20 h-20 text-gray-400 absolute top-8"
                    />
                  )}

                  {/* المسافة بين الصورة والنجوم */}
                  <div className="flex space-x-1 mt-8 justify-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-lg my-6 flex-1">
                    {review.text}
                  </p>

                  <div className="mt-4">
                    <h4 className="font-bold text-gray-800 text-lg">
                      {review.name}
                    </h4>
                    <p className="text-sm text-gray-500">{review.title}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;