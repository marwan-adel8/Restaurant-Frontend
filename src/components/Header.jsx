import React from "react";
import logo from "../assets/logo 1.png";
import { useNavigate, Link } from "react-router-dom";
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

  const renderUserActions = (isMobile = false) => {
    const buttonBaseClasses =
      "p-2 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap";

    const getButtonClasses = (isPrimary = true, isBlack = false) => {
      let classes = buttonBaseClasses;
      let colorClasses = "";

      if (isPrimary) {
        colorClasses =
          isScrolled && !isMobile
            ? "text-white bg-orange-600 hover:bg-orange-700"
            : "bg-orange-600 text-white hover:bg-orange-700";
      } else if (isBlack) {
        colorClasses =
          isScrolled && !isMobile
            ? "text-white bg-[#1F2937] hover:bg-gray-800"
            : "bg-[#1F2937] text-white hover:bg-gray-800";
      } else {
        colorClasses = "bg-orange-600 text-white hover:bg-orange-700";
      }

      if (isMobile) {
        classes += " w-full max-w-xs";
      }

      return `${classes} ${colorClasses}`;
    };

    const containerClasses = isMobile
      ? "flex flex-col items-center gap-4 mt-6 border-t pt-4 border-gray-200"
      : "hidden md:flex items-center gap-4";

    const handleCloseMenu = () => {
      if (isMobile) {
        setIsMenuOpen(false);
      }
    };

    if (!isAuthenticated) {
      return (
        <div className={containerClasses}>
          <Link
            to="/login"
            onClick={handleCloseMenu}
            className={getButtonClasses(true)}
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={handleCloseMenu}
            className={getButtonClasses(false, true)}
          >
            Signup
          </Link>
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <span
          className={`text-sm ${
            isScrolled && !isMobile ? "text-gray-700" : "text-gray-700"
          }`}
        >
          Welcome, {user?.name}
        </span>

        {isAdmin ? (
          <Link
            className={`${getButtonClasses(
              false,
              false
            )} whitespace-nowrap w-44 flex items-center justify-center`}
            to="/admin"
            onClick={handleCloseMenu}
          >
            Manage Dashboard
          </Link>
        ) : (
          <>
            <div
              className={`flex gap-4 items-center ${
                isMobile ? "justify-center w-full" : ""
              }`}
            >
              <Link
                to="/cart"
                onClick={handleCloseMenu}
                className={`relative cursor-pointer ${
                  isScrolled && !isMobile ? "text-gray-700" : "text-gray-700"
                }`}
              >
                {cart && cart.totalItems > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10">
                    {cart.totalItems > 99 ? "99+" : cart.totalItems}
                  </div>
                )}
                <ShoppingBasket className="h-6 w-6" />
              </Link>

              <Link
                to="/favorites"
                onClick={handleCloseMenu}
                className={`cursor-pointer ${
                  isScrolled && !isMobile ? "text-gray-700" : "text-gray-700"
                }`}
              >
                <Heart className="h-6 w-6" />
              </Link>
            </div>
          </>
        )}

        <button
          className={getButtonClasses(false, true)}
          onClick={() => {
            handleLogout();
            if (isMobile) setIsMenuOpen(false);
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
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Logo"
          className="h-[100px] w-[100px] object-contain"
        />
      </Link>

      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-gray-700"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}
      </div>

      {renderUserActions(false)}

      <div className="flex items-center gap-3 md:hidden">
        <svg
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`h-6 w-6 cursor-pointer ${
            isScrolled ? "text-gray-700" : "text-gray-700"
          }`}
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

      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 z-[60] ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <a className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
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

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="text-lg font-medium"
          >
            {link.name}
          </Link>
        ))}

        {renderUserActions(true)}
      </div>
    </nav>
  );
};

export default Header;
