import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path, requiresAuth) => {
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
    if (requiresAuth && !user) {
      navigate('/login', { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio', requiresAuth: true },
    { name: '3D Visualizer', path: '/visualizer', requiresAuth: true },
    { name: 'Get Ideas', path: '/recommendations', requiresAuth: true },
    { name: 'Consultation', path: '/consultation', requiresAuth: true },
  ];

  const isActive = (path) => {
    if (path === '/') {
      // For home path, only return true if it's exactly the home page
      return location.pathname === '/';
    }
    // For other paths, check if the current path starts with the nav path
    return location.pathname.startsWith(path);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] ${
        isScrolled || !isHomePage
          ? 'bg-white shadow-xl border-b border-luxury-gold/20'
          : 'bg-black/90 backdrop-blur-md'
      } transition-all duration-300`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 no-underline cursor-pointer"
          >
            <span className={`text-2xl font-bold ${
              isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
            } drop-shadow-sm`}>
              Livspace
              <span className="text-luxury-gold font-extrabold">Interior</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path, link.requiresAuth)}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isScrolled || !isHomePage
                    ? isActive(link.path)
                      ? 'text-luxury-gold'
                      : 'text-gray-800 hover:text-luxury-gold'
                    : isActive(link.path)
                    ? 'text-luxury-gold'
                    : 'text-gray-100 hover:text-luxury-gold'
                } hover:bg-black/5 rounded-md`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-luxury-gold"
                    initial={false}
                  />
                )}
              </button>
            ))}
            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isScrolled || !isHomePage
                      ? 'text-gray-800 hover:text-luxury-gold hover:bg-black/5'
                      : 'text-gray-100 hover:text-luxury-gold hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-luxury-gold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="font-medium">Profile</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isScrolled || !isHomePage
                      ? 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isScrolled || !isHomePage
                      ? 'bg-luxury-gold text-white hover:bg-luxury-gold/90'
                      : 'bg-white text-luxury-gold hover:bg-gray-50'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-luxury-gold btn-luxury-md btn-luxury-rounded-md ml-4"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${
                isScrolled || !isHomePage
                  ? 'text-gray-800 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavigation(link.path, link.requiresAuth)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.path)
                        ? 'bg-luxury-gold/10 text-luxury-gold'
                        : isScrolled || !isHomePage
                        ? 'text-gray-800 hover:bg-gray-100'
                        : 'text-gray-100 hover:bg-white/10'
                    } transition-colors`}
                  >
                    {link.name}
                  </button>
                ))}
                {user ? (
                  <div className="pt-4 space-y-2">
                    <button
                      onClick={() => handleNavigation('/profile', true)}
                      className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-luxury-gold/10 text-luxury-gold hover:bg-luxury-gold/20 transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleNavigation('/dashboard', true)}
                      className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-luxury-gold/10 text-luxury-gold hover:bg-luxury-gold/20 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-luxury-gold text-white hover:bg-luxury-gold/90 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login', false)}
                    className="block mt-4 w-full text-center px-3 py-2 rounded-md text-base font-medium bg-luxury-gold text-white hover:bg-luxury-gold/90 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
