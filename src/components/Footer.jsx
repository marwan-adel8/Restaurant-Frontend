import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/logo 1.png";
import panBackground from "../assets/Group.png";

const Footer = () => {
  const navigationLinks = [
    { name: "Menu", href: "/menu" },
    { name: "About us", href: "/about" },
    { name: "Contact us", href: "/contact" },
    { name: "Login", href: "/login" },
  ];

  const dishesLinks = [
    { name: "Salmon Teriyaki", href: "/menu" },
    { name: "Honey Glazed", href: "/menu" },
    { name: "Creamy Shrimp", href: "/menu" },
    { name: "Grilled Ribeye", href: "/menu" },
  ];

  const socialIcons = [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
  ];

  return (
    <footer className="bg-white relative pt-16 text-gray-700 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage: `url(${panBackground})`,
          backgroundSize: "600px",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 border-b pb-12 border-gray-200">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <img src={logo} alt="Restaurant Logo" className="h-8" />
            <p className="text-sm max-w-sm leading-relaxed">
              Discover the perfect blend of taste, quality, and comfort at our restaurant.
              We’re passionate about serving you fresh, flavorful dishes made with love.
              <Link to="/about" className="text-blue-600 hover:text-blue-800 ml-1">
                Learn more
              </Link>
            </p>

            <div className="space-y-3 pt-4">
              <h4 className="font-bold text-sm text-gray-900 uppercase">Opening Hours</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Monday - Friday</p>
                  <p>8:00 am to 9:00 pm</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Saturday</p>
                  <p>8:00 am to 9:00 pm</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Sunday</p>
                  <p className="text-red-500">CLOSED</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block space-y-4">
            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-orange-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Dishes</h4>
            <ul className="space-y-3 text-sm">
              {dishesLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-orange-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Follow Us</h4>
            <div className="flex space-x-3">
              {socialIcons.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center py-5 text-xs text-gray-500 space-y-3 sm:space-y-0">
          <p>
            © 2025 Restaurants. All Right Reserved. Designed by{" "}
            <span className="font-semibold text-gray-700">Marwan</span>
          </p>
          <div className="space-x-4">
            <a href="#" className="hover:text-gray-700">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-700">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
