import React from "react";
import logo from "../assets/logo 1.png";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBasket } from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { useCart } from "../auth/CartContext";

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // دالة الإجراءات الموحدة (تم تعديلها لتصبح مرنة)
  const renderUserActions = (isMobile = false) => {
    // تنسيقات أساسية للأزرار
    const buttonBaseClasses = "p-2 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap";
    
    // دالة لاسترجاع التنسيقات الأصلية المعتمدة على isScrolled
    const getButtonClasses = (isPrimary = true, isBlack = false) => {
        let classes = buttonBaseClasses;
        let colorClasses = "";

        // العودة إلى الألوان الأصلية المعتمدة على isScrolled
        if (isPrimary) { // Login Button
            colorClasses = isScrolled && !isMobile 
                ? "text-white bg-orange-600" 
                : "bg-orange-600 text-white";
        } else if (isBlack) { // Signup/Logout Button
            colorClasses = isScrolled && !isMobile
                ? "text-white bg-[#1F2937]" 
                : "bg-[#1F2937] text-white";
        } else {
             // زر الإدارة (Admin) الذي كان يستخدم لون برتقالي ثابت
             colorClasses = "bg-orange-600 text-white hover:bg-orange-700";
        }
        
        // تنسيق خاص للحالة المدمجة في الموبايل لضمان الوضوح
        if (isMobile) {
             classes += " w-full max-w-xs";
        }


        return `${classes} ${colorClasses}`;
    };

    // تم إبقاء هذا الكلاس كما هو لتحقيق التباعد في الموبايل
    const containerClasses = isMobile 
        ? "flex flex-col items-center gap-4 mt-6 border-t pt-4 border-gray-200"
        : "hidden md:flex items-center gap-4";
    
    // دالة مساعدة للتنقل والإغلاق
    const navigateAndClose = (path) => {
        navigate(path);
        if (isMobile) {
            setIsMenuOpen(false);
        }
    };


    if (!isAuthenticated) {
      return (
        <div className={containerClasses}>
          <button
            onClick={() => navigateAndClose("/login")}
            className={getButtonClasses(true)}
          >
            Login
          </button>

          <button
            onClick={() => navigateAndClose("/signup")}
            className={getButtonClasses(false, true)}
          >
            Signup
          </button>
        </div>
      );
    }

    // المستخدمين المسجلين الدخول
    return (
      <div className={containerClasses}>
        {/* العودة لتنسيق isScrolled الأصلي للنص */}
        <span
          className={`text-sm ${
            isScrolled && !isMobile ? "text-gray-700" : "text-gray-700"
          }`}
        >
          Welcome, {user?.name}
        </span>

        {isAdmin ? (
          <button
            // استخدام التنسيق الخاص لزر الإدارة
            className="whitespace-nowrap w-44 bg-orange-600"
            onClick={() => navigateAndClose("/admin")}
          >
            Manage Dashboard
          </button>
        ) : (
          <>
            {/* أيقونات المستخدم العادي (السلة والمفضلة) */}
            <div className={`flex gap-4 items-center ${isMobile ? 'justify-center w-full' : ''}`}>
              {/* السلة */}
              <div 
                // العودة لتنسيق isScrolled الأصلي للأيقونات
                className={`relative cursor-pointer ${isScrolled && !isMobile ? 'text-gray-700' : 'text-gray-700'}`}
                onClick={() => navigateAndClose("/cart")}
              >
                {cart && cart.totalItems > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 z-10">
                    {cart.totalItems}
                  </div>
                )}
                <ShoppingBasket className="h-6 w-6"/>
              </div>

              {/* المفضلة */}
              <div 
                 // العودة لتنسيق isScrolled الأصلي للأيقونات
                className={`cursor-pointer ${isScrolled && !isMobile ? 'text-gray-700' : 'text-gray-700'}`}
              >
                <Heart className="h-6 w-6"/>
              </div>
            </div>
          </>
        )}

        {/* زر Logout */}
        <button 
            className={getButtonClasses(false, true)} 
            onClick={() => {
                handleLogout();
                if(isMobile) setIsMenuOpen(false);
            }}
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 bg-gray-50 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" // 👈 العودة إلى الخلفية البيضاء الشفافة الأصلية
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Logo"
          className="h-[100px] w-[100px] object-contain"
        />
      </a>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            // العودة لتنسيق isScrolled الأصلي لروابط الـ Nav
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-gray-700"
            }`}
          >
            {link.name}
            <div
              // العودة لتنسيق isScrolled الأصلي للخط السفلي
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </a>
        ))}
      </div>

      {/* Desktop Right (إعادة استخدام الدالة بوضع العرض الافتراضي - Desktop) */}
      {renderUserActions(false)} 
      
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <svg
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          // العودة لتنسيق invert الأصلي
          className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </div>

      {/* Mobile Menu - تم إبقاء المنطق الوظيفي وإزالة التنسيقات المضافة مؤخراً */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 z-[60] ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* زر الإغلاق (X) */}
        <a
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </a>

        {/* روابط الـ NavLinks - مع إغلاق القائمة عند النقر */}
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            onClick={() => setIsMenuOpen(false)} 
            className="text-lg font-medium" // العودة لتنسيق موبايل بسيط
          >
            {link.name}
          </a>
        ))}

        {/* المنطق المطلوب: إضافة الإجراءات في الموبايل وإغلاق القائمة */}
        {renderUserActions(true)} 
        
      </div>
    </nav>
  );
};

export default Header;