import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

// يجب استبدال هذه المسارات بمسارات صورك الحقيقية
import chefImage from "../assets/chef 1.png"; // صورة الشيف
import garlicVector from "../assets/Vector (2).png"; // الرسم الزخرفي (افتراضي)
import { useNavigate } from 'react-router-dom';

const ChefSection = () => {
    const navigate = useNavigate();

    const containerVariants = {
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    const chefVariants = {
        initial: { opacity: 0, scale: 0.9, x: 100 },
        animate: { opacity: 1, scale: 1, x: 0, transition: { duration: 1, type: "spring", stiffness: 70 } }
    };

    const features = [
        "Fresh, high-quality ingredients prepared daily",
        "Creative dishes blending tradition and innovation",
        "World-class chefs with years of culinary experience",
        "Elegant dining atmosphere for every occasion",
        "Exceptional service with attention to every detail",
        "Strict hygiene and food safety standards",
    ];

    return (
        <section className="min-h-screen flex items-center justify-center relative bg-white overflow-hidden py-20 px-4">

            <img
                src={garlicVector}
                alt="Garlic Graphic"
                className="absolute top-10 left-0 w-80 h-auto opacity-10 hidden lg:block"
            />

            {/* 🔑 التعديل هنا: استخدام lg:grid-cols-2 lg:gap-16 لتقليل التباعد على الديسكتوب، 
                 و lg:items-start للحفاظ على محاذاة النص.
                 **مهم**: أضفنا `flex-col-reverse` لتظهر الصورة أولاً على الشاشات الصغيرة.
                 ثم `lg:flex-row` و `lg:items-center` و `gap-16` لتعود للترتيب والمحاذاة الأصلية على الديسكتوب.
            */}
            <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-16 z-10">

                {/* العمود الأيسر (النصوص والميزات): 🔑 ترتيبه ثانيًا على الموبايل، أولاً على الديسكتوب (lg:order-1) */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8 text-center lg:text-left w-full lg:w-1/2 lg:order-1"
                >
                    <div className="space-y-4">
                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl font-serif font-extrabold text-[#111827] leading-tight"
                        >
                            Our Expects Chef
                        </motion.h2>
                        {/* 🔑 الفقرة: مخفية على الموبايل (hidden) وظاهرة على الديسكتوب (lg:block) */}
                        <motion.p
                            variants={itemVariants}
                            className="text-gray-600 max-w-md text-base mx-auto lg:mx-0 hidden lg:block"
                        >
                            Meet the culinary masters behind every exquisite dish.
                            Our chefs combine creativity, experience, and passion
                            to bring you unforgettable flavors made with the finest ingredients.
                        </motion.p>
                    </div>

                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4" // 🔑 استخدمنا sm:grid-cols-2 لتحسين عرض المميزات على شاشات الموبايل الأكبر قليلاً
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex items-start space-x-2 rtl:space-x-reverse"
                            >
                                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                                <span className="text-gray-700 text-sm">{feature}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center lg:justify-start space-x-4 pt-4"
                    >
                        <motion.button
                            onClick={() => navigate('/menu')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#1F2937] text-white font-semibold py-3 w-[150px] rounded-lg shadow-md hover:bg-gray-700 transition-colors"
                        >
                            Menu
                        </motion.button>
                        <motion.button
                            onClick={() => navigate('/about')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-orange-600 text-white font-semibold py-3 w-[150px] rounded-lg shadow-md hover:bg-orange-700 transition-colors"
                        >
                            About us
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* العمود الأيمن (صورة الشيف): 🔑 ترتيبه أولًا على الموبايل، ثانيًا على الديسكتوب (lg:order-2) */}
                <motion.div
                    variants={chefVariants}
                    initial="initial"
                    animate="animate"
                    className="relative flex justify-center lg:justify-end w-full lg:w-1/2 pt-16 lg:pt-0 lg:order-2"
                >
                    {/* الدائرة البرتقالية الكبيرة */}
                    <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px] bg-orange-500 rounded-full shadow-2xl overflow-hidden"> {/* 🔑 تصغير حجم الدائرة على الموبايل */}
                        {/* صورة الشيف */}
                        <img
                            src={chefImage}
                            alt="Expert Chef"
                            className="absolute bottom-0 right-0 w-full h-auto object-cover"
                            style={{ height: '110%', width: 'auto', left: '50%', transform: 'translateX(-50%)' }}
                        />
                        <div className='absolute bottom-[100px] left-[10px]'>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default ChefSection;