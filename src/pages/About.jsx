import React from "react";
// Importing icons for better visual appeal
import { ChefHat, Timer, Trophy, Calendar, Users } from "lucide-react"; // أضفت Users للأيقونات

// Placeholder for images (Please replace with your actual images)
import restaurantImage from "../assets/restaurant-interior.jpg"; // يمكن تغييرها لصورة داخلية للمطعم
import teamImage from "../assets/teamchef.jpg"; // الصورة التي ذكرتها لفريق العمل

const About = () => {
  // Key facts for the Stats section
  const stats = [
    { icon: Calendar, value: "2020", label: "Year Established" },
    { icon: Trophy, value: "45+", label: "Signature Dishes" },
    { icon: ChefHat, value: "10+", label: "High-Level Chefs" },
    { icon: Timer, value: "15 Min", label: "Avg. Delivery Time" },
  ];

  // Core features based on your requirements
  const features = [
    {
      title: "Established in 2020",
      description:
        "We have been serving our community with passion and dedication since 2020, striving to create unforgettable dining experiences.",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Top-Tier Professional Chefs",
      description:
        "Our kitchen is run by highly skilled chefs with extensive experience, ensuring exceptional quality and mastery in every dish.",
      icon: ChefHat,
      color: "text-gray-800",
    },
    {
      title: "Excellent and Organized Management",
      description:
        "Our dedicated management team ensures smooth operations and efficiency, reflecting in the precision and quality of every customer order.",
      icon: Trophy,
      color: "text-orange-600",
    },
    {
      title: "Advanced & Speedy Service",
      description:
        "We pride ourselves on our advanced delivery service, guaranteeing that your meal arrives hot, fresh, and as quickly as possible.",
      icon: Timer,
      color: "text-gray-800",
    },
  ];

  return (
    <div className="min-h-screen pt-[170px] bg-gray-50">


      {/* 2. Features and Quality Section */}
      <section className="py-16 px-6 md:px-16 bg-white"> {/* غيرت الخلفية هنا لتكون بيضاء */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text Column (Features) */}
          <div>
            <span className="text-sm font-semibold uppercase text-orange-600 tracking-wider">
              Why Choose Us?
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2 mb-6">
              We Adhere to the Highest Standards of Excellence
            </h2>
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <feature.icon
                    className={`h-8 w-8 flex-shrink-0 ${feature.color}`}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Column (Restaurant Interior) */}
          <div className="relative">
            <div className="absolute inset-0 bg-orange-600 opacity-10 rounded-xl transform translate-x-3 translate-y-3 z-0 hidden md:block"></div>
            <img
              src={
                restaurantImage ||
                "https://via.placeholder.com/600x450?text=Restaurant+Interior"
              }
              alt="Restaurant Interior"
              className="relative w-full h-auto object-cover rounded-xl shadow-xl z-10"
              style={{ aspectRatio: "4/3" }}
            />
          </div>
        </div>
      </section>

      {/* 3. Facts and Figures (Stats Section) */}
      <section className="py-16 bg-[#1F2937] text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <stat.icon className="h-10 w-10 mx-auto text-orange-400 mb-3" />
                <div className="text-4xl font-bold text-orange-500">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wider mt-1 text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Team Section - بدلاً من Mission/Vision مع زر */}
      <section className="py-16 px-6 md:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="h-16 w-16 mx-auto text-orange-600 mb-6" /> {/* أيقونة تعبر عن الفريق */}
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Meet Our Dedicated Team
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Behind every delicious dish and seamless experience is our passionate
            team, working together to bring you the best. We are a family of
            culinary experts and service professionals committed to excellence.
          </p>
          
          {/* الصورة الجديدة للفريق */}
          <div className="max-w-2xl mx-auto mt-8">
            <img 
              src={teamImage} 
              alt="Our Team"
              className="w-full h-auto object-cover rounded-xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500"
              style={{ aspectRatio: '16/9' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;