import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRole } from '../contexts/RoleContext';
import { useLanguage } from '../contexts/LanguageContext';
import PageTransition from '../components/PageTransition';
import { Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useRole();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name) || (isStaff && !passcode)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password, isStaff, passcode);
      if (isStaff) {
        navigate('/staff');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mesh-bg">
        <div className="mesh-orb" />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 76px)', padding: '40px 24px'
      }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
          style={{ width: '100%', maxWidth: 440, padding: 32 }}
        >
          {/* Logo Heading */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 32 }}>⚽</span>
            <h2 style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: 800, color: '#0057B8', margin: '12px 0 4px' }}>
              StadiumPulse AI
            </h2>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
              FIFA World Cup 2026 Companion Gateway
            </p>
          </div>

          {/* Form Selector Tabs */}
          <div style={{ display: 'flex', background: '#F3F4F6', padding: 4, borderRadius: 12, marginBottom: 24 }}>
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                background: !isSignUp ? 'white' : 'transparent',
                color: !isSignUp ? '#0057B8' : '#6B7280',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); setIsStaff(false); }}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                background: isSignUp ? 'white' : 'transparent',
                color: isSignUp ? '#0057B8' : '#6B7280',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 10, background: '#FFF0F1',
              border: '1px solid #E6394640', color: '#E63946', fontSize: 13, marginBottom: 20
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: 14 }} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter name..."
                    style={{
                      width: '100%', padding: '12px 16px 12px 40px', borderRadius: 10,
                      border: '1px solid #E5E7EB', background: '#F9FAFB', outline: 'none', fontSize: 14
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="off"
                  style={{
                    width: '100%', padding: '12px 16px 12px 40px', borderRadius: 10,
                    border: '1px solid #E5E7EB', background: '#F9FAFB', outline: 'none', fontSize: 14
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={{
                    width: '100%', padding: '12px 16px 12px 40px', borderRadius: 10,
                    border: '1px solid #E5E7EB', background: '#F9FAFB', outline: 'none', fontSize: 14
                  }}
                />
              </div>
            </div>

            {/* Staff / Volunteer Mode Switch (Sign In only) */}
            {!isSignUp && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 12, background: '#EAF4FF',
                border: '1px solid rgba(0, 87, 184, 0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={18} color="#0057B8" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0057B8' }}>Staff / Volunteer Mode</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>Access operations panels</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStaff(!isStaff)}
                  style={{
                    width: 44, height: 22, borderRadius: 11, background: isStaff ? '#0057B8' : '#D1D5DB',
                    border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: isStaff ? 25 : 3, transition: 'all 0.2s' }} />
                </button>
              </div>
            )}

            {/* Staff Passcode Input (Active only when isStaff is true) */}
            {isStaff && !isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Staff Security Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  autoComplete="off"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10,
                    border: '1px solid #E5E7EB', background: '#F9FAFB', outline: 'none', fontSize: 14
                  }}
                />
                <div style={{ fontSize: 11, color: '#0057B8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>ℹ️</span>
                  <span>
                    Volunteers: Check orientation handbook or use default: <strong>FIFA2026</strong>
                  </span>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '14px', marginTop: 8 }}
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Fan Account' : isStaff ? 'Secure Staff Login' : 'Sign In to Matchday'}
            </button>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
}
