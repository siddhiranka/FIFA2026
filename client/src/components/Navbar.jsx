import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User, ChevronDown, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRole } from '../contexts/RoleContext';

const navLinks = [
  { key: 'home', path: '/' },
  { key: 'aiAssistant', path: '/ai' },
  { key: 'navigation', path: '/navigate' },
  { key: 'crowd', path: '/crowd' },
  { key: 'transport', path: '/transport' },
  { key: 'accessibility', path: '/accessibility' },
  { key: 'food', path: '/food' },
];

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated, isStaff } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const langs = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
  ];

  // If user is not authenticated, only show Home and Sign In in desktop nav
  const activeNavLinks = isAuthenticated ? navLinks : [{ key: 'home', path: '/' }];

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255, 255, 255, 0.90)' : 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
          boxShadow: scrolled ? '0 10px 30px -10px rgba(0, 87, 184, 0.15)' : 'none',
        }}
      >
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
            
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 42, height: 42,
                  background: 'linear-gradient(135deg, #0057B8 0%, #00A651 100%)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                  boxShadow: '0 4px 12px rgba(0, 87, 184, 0.25)'
                }}
              >
                ⚽
              </motion.div>
              <div style={{ whiteSpace: 'nowrap' }}>
                <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: '#0057B8', lineHeight: 1.1 }}>
                  StadiumPulse <span style={{ color: '#00A651' }}>AI</span>
                </div>
                <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Official Companion
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {activeNavLinks.map(link => (
                <Link key={link.key} to={link.path} style={{ textDecoration: 'none' }}>
                  <div style={{ position: 'relative', padding: '8px 16px', borderRadius: 8 }}>
                    <span style={{
                      fontSize: 14, fontWeight: 600,
                      color: location.pathname === link.path ? '#0057B8' : '#4B5563',
                      transition: 'color 0.2s',
                      whiteSpace: 'nowrap'
                    }}>
                      {t(link.key)}
                    </span>
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-4 right-4 h-[3px]"
                        style={{
                          background: 'linear-gradient(90deg, #0057B8, #00A651)',
                          borderRadius: 2
                        }}
                      />
                    )}
                  </div>
                </Link>
              ))}
              
              {/* Staff link visible only for authorized logged-in Staff sessions */}
              {isAuthenticated && isStaff && (
                <Link to="/staff" style={{ textDecoration: 'none' }}>
                  <div style={{ position: 'relative', padding: '8px 16px' }}>
                    <span style={{
                      fontSize: 14, fontWeight: 600,
                      color: location.pathname === '/staff' ? '#0057B8' : '#4B5563',
                      whiteSpace: 'nowrap'
                    }}>
                      {t('staffDashboard')}
                    </span>
                    {location.pathname === '/staff' && (
                      <motion.div layoutId="navUnderline" className="absolute bottom-0 left-4 right-4 h-[3px]" style={{
                        background: 'linear-gradient(90deg, #0057B8, #00A651)',
                        borderRadius: 2
                      }} />
                    )}
                  </div>
                </Link>
              )}
            </nav>

            {/* Right Controls Area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              
              {/* Language Selector Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 50,
                    border: '1px solid rgba(229, 231, 235, 0.8)', background: 'white',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  aria-label="Select language"
                >
                  <Globe size={15} color="#0057B8" />
                  <span>{langs.find(l => l.code === language)?.flag}</span>
                  <ChevronDown size={13} color="#6B7280" />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      style={{
                        position: 'absolute', top: '100%', right: 0, marginTop: 8,
                        background: 'white', borderRadius: 16, border: '1px solid #E5E7EB',
                        boxShadow: '0 10px 40px rgba(0, 87, 184, 0.12)', padding: 8,
                        minWidth: 160, zIndex: 100
                      }}
                    >
                      {langs.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            width: '100%', padding: '10px 14px', borderRadius: 10,
                            border: 'none', background: language === lang.code ? '#EAF4FF' : 'transparent',
                            color: language === lang.code ? '#0057B8' : '#374151',
                            cursor: 'pointer', fontSize: 14, fontWeight: language === lang.code ? 700 : 500,
                            transition: 'all 0.15s'
                          }}
                        >
                          <span style={{ fontSize: 16 }}>{lang.flag}</span> {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile User Dropdown Area */}
              {isAuthenticated ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    style={{
                      width: 40, height: 40, borderRadius: 50,
                      background: 'linear-gradient(135deg, #0057B8 0%, #0070E0 100%)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0, 87, 184, 0.2)'
                    }}
                    title={user.name}
                  >
                    <User size={18} color="white" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        style={{
                          position: 'absolute', top: '100%', right: 0, marginTop: 8,
                          background: 'white', borderRadius: 16, border: '1px solid #E5E7EB',
                          boxShadow: '0 10px 40px rgba(0, 87, 184, 0.12)', padding: 12,
                          minWidth: 200, zIndex: 100
                        }}
                      >
                        <div style={{ padding: '4px 8px 8px', borderBottom: '1px solid #F3F4F6', marginBottom: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>{user.name}</div>
                          <div style={{ fontSize: 11, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: isStaff ? '#0057B8' : '#00A651', marginTop: 4 }}>
                            {isStaff ? '👷 Staff Session' : '👤 Fan Session'}
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            width: '100%', padding: '10px 14px', borderRadius: 10,
                            border: 'none', background: 'transparent',
                            color: '#E63946', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FFF0F1'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: 13, height: 38 }}
                  >
                    Sign In
                  </button>
                </Link>
              )}

              {/* Mobile menu trigger */}
              {isAuthenticated && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  style={{
                    display: 'none', width: 40, height: 40,
                    borderRadius: 12, border: '1px solid #E5E7EB',
                    background: 'white', cursor: 'pointer',
                    alignItems: 'center', justifyContent: 'center'
                  }}
                  className="mobile-menu-btn"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 49,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              paddingTop: 90, paddingLeft: 24, paddingRight: 24
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[...activeNavLinks, ...(isStaff ? [{ key: 'staffDashboard', path: '/staff' }] : [])].map(link => (
                <Link key={link.key} to={link.path} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '16px 20px', borderRadius: 14,
                      color: location.pathname === link.path ? '#0057B8' : '#374151',
                      background: location.pathname === link.path ? '#EAF4FF' : 'transparent',
                      fontWeight: 700,
                      fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <span>{t(link.key)}</span>
                    <ArrowRight size={16} opacity={location.pathname === link.path ? 1 : 0.3} />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacing Offset */}
      <div style={{ height: 76 }} />

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
