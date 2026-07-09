import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useRole } from '../contexts/RoleContext';
import { getLiveCrowd, navigateAI } from '../services/api';
import MatchCountdown from '../components/MatchCountdown';
import FanJourneyTracker from '../components/FanJourneyTracker';
import AIMatchdayTip from '../components/AIMatchdayTip';
import PageTransition from '../components/PageTransition';
import { Search, Compass, Shield, Users, Globe, Eye, ArrowRight, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const { role } = useRole();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [crowdSummary, setCrowdSummary] = useState(null);

  useEffect(() => {
    const fetchCrowd = async () => {
      try {
        const res = await getLiveCrowd();
        setCrowdSummary(res.data);
      } catch (err) {
        console.error('Error fetching crowd in home', err);
      }
    };
    fetchCrowd();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/navigate?q=${encodeURIComponent(searchQuery)}`);
  };

  const chips = ['Gate A queue', 'Metro status', 'Lot P2 parking', 'Wheelchair paths', 'First aid near me'];

  return (
    <PageTransition>
      {/* Background Mesh (fixed element inside app, class is in index.css) */}
      <div className="mesh-bg">
        <div className="mesh-orb" />
      </div>

      <div className="page-container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Split Hero Section */}
        <div className="hero-grid" style={{ marginBottom: 64 }}>
          {/* Left Column */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EAF4FF', border: '1px solid rgba(0,87,184,0.15)', padding: '6px 16px', borderRadius: 50, marginBottom: 18 }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#0057B8' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0057B8', fontFamily: 'Poppins', letterSpacing: '0.5px' }}>
                {t('stadiumSubtitle')}
              </span>
            </div>
            <h1 style={{ fontFamily: 'Poppins', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#1F2937', lineHeight: 1.15, marginBottom: 20 }}>
              FIFA World Cup 2026 <br />
              <span className="gradient-text">{t('heroSubtitle')}</span>
            </h1>
            <p style={{ fontSize: 18, color: '#6B7280', marginBottom: 32, lineHeight: 1.6, maxWidth: 540 }}>
              {t('heroSubtitleDesc')}
            </p>

            <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
              <Link to="/navigate" className="btn-primary" style={{ textDecoration: 'none' }}>
                ⚽ {t('startMatchday')}
              </Link>
              <Link to="/ai" className="btn-outline" style={{ textDecoration: 'none' }}>
                🤖 {t('askAI')}
              </Link>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {[
                { label: t('trustAI'), color: '#0057B8' },
                { label: t('trustFlow'), color: '#00A651' },
                { label: t('trustLang'), color: '#FFD447' },
                { label: t('trustPaths'), color: '#9333EA' }
              ].map(badge => (
                <div key={badge.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={16} color={badge.color} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium SVG Illustration */}
          <div style={{ position: 'relative' }}>
            {/* Soft decorative background circles */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(0,87,184,0.06) 0%, transparent 70%)', transform: 'scale(1.2)', zIndex: -1 }} />

            <svg viewBox="0 0 500 450" width="100%" height="auto" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,87,184,0.08))' }}>
              {/* Stadium Base */}
              <ellipse cx="250" cy="280" rx="200" ry="110" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="4" />
              {/* Field inside */}
              <ellipse cx="250" cy="280" rx="160" ry="80" fill="#00A651" />
              {/* Pitch Line markings */}
              <ellipse cx="250" cy="280" rx="130" ry="60" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <ellipse cx="250" cy="280" rx="60" ry="30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              {/* Stadium Stands Rings */}
              <ellipse cx="250" cy="220" rx="200" ry="90" fill="none" stroke="#0057B8" strokeWidth="6" strokeDasharray="10, 5" />
              <ellipse cx="250" cy="180" rx="190" ry="80" fill="none" stroke="#FFD447" strokeWidth="4" />

              {/* Stadium Lights glow */}
              <line x1="80" y1="80" x2="120" y2="180" stroke="#0057B8" strokeWidth="2" opacity="0.3" />
              <line x1="420" y1="80" x2="380" y2="180" stroke="#0057B8" strokeWidth="2" opacity="0.3" />
              <circle cx="80" cy="80" r="14" fill="#FFD447" opacity="0.8" />
              <circle cx="420" cy="80" r="14" fill="#FFD447" opacity="0.8" />

              {/* Fan / Staff Silhouette representations */}
              <g transform="translate(140, 240)" opacity="0.9">
                {/* Wheelchair User representation */}
                <circle cx="10" cy="10" r="6" fill="#0057B8" />
                <path d="M6,16 A8,8 0 0,1 14,24" fill="none" stroke="#0057B8" strokeWidth="3" />
                <path d="M10,16 L18,22" stroke="#0057B8" strokeWidth="3" />
              </g>
              <g transform="translate(320, 250)">
                {/* Staff / Volunteer standing */}
                <circle cx="10" cy="10" r="7" fill="#00A651" />
                <path d="M2,28 L6,16 L14,16 L18,28" fill="#00A651" />
              </g>
              <g transform="translate(240, 270)">
                {/* Center marker / soccer ball */}
                <circle cx="10" cy="10" r="12" fill="white" stroke="#1F2937" strokeWidth="2" />
                <path d="M10,2 L14,8 L10,14 L6,8 Z" fill="#1F2937" />
              </g>

              {/* Connection curves - navigation routes */}
              <path d="M80,80 Q250,220 320,250" fill="none" stroke="#0057B8" strokeWidth="3" strokeDasharray="6,4" />
              <path d="M420,80 Q250,180 140,240" fill="none" stroke="#00A651" strokeWidth="3" strokeDasharray="6,4" />
            </svg>
          </div>
        </div>

        {/* AI Quick Search box */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 56, border: '1px solid rgba(0,87,184,0.15)' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, position: 'relative' }}>
            <Search size={20} color="#9CA3AF" style={{ position: 'absolute', left: 20, top: 18 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholderHome')}
              style={{
                width: '100%', padding: '16px 20px 16px 52px', borderRadius: 50,
                border: '2px solid #E5E7EB', outline: 'none', fontSize: 15
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 28px' }}>
              {t('btnSearch')}
            </button>
          </form>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            {chips.map(chip => (
              <button key={chip} onClick={() => { setSearchQuery(chip); navigate(`/navigate?q=${encodeURIComponent(chip)}`); }} className="chip">
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Live Match Countdown & AI Matchday Tip row */}
        <div className="split-row" style={{ gap: 24, marginBottom: 56 }}>
          <MatchCountdown />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIMatchdayTip />
            {/* Live crowd summary box */}
            <div className="glass-card" style={{ padding: 20, flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EAF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                📊
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>METLIFE LIVE OCCUPANCY</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0057B8', margin: '2px 0' }}>
                  {crowdSummary ? crowdSummary.occupancyPercent : 74}% {t('stadiumFull')}
                </div>
                <div style={{ fontSize: 12, color: '#4B5563' }}>
                  {t('avgWaitTimeText')}: <strong>{crowdSummary ? Math.round(crowdSummary.gates.reduce((acc, g) => acc + g.waitMinutes, 0) / crowdSummary.gates.length) : 5} min</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fan Journey Tracker */}
        <div style={{ marginBottom: 56 }}>
          <FanJourneyTracker currentStep={2} />
        </div>

        {/* Quick Links / Grid Services */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 800, color: '#1F2937', marginBottom: 24 }}>
            {t('matchdayServicesHeader')}
          </h2>
          <div className="cards-grid">
            {[
              { title: t('svcAssistantTitle'), path: '/ai', desc: t('svcAssistantDesc'), icon: '🤖', badge: 'Gemini 1.5' },
              { title: t('svcNavTitle'), path: '/navigate', desc: t('svcNavDesc'), icon: '📍', badge: 'Live Maps' },
              { title: t('svcCrowdTitle'), path: '/crowd', desc: t('svcCrowdDesc'), icon: '👥', badge: 'Real-time' },
              { title: t('svcTransitTitle'), path: '/transport', desc: t('svcTransitDesc'), icon: '🚇', badge: 'Sustainable' },
              { title: t('svcAccessTitle'), path: '/accessibility', desc: t('svcAccessDesc'), icon: '♿', badge: 'WCAG AA' },
              { title: t('svcFoodTitle'), path: '/food', desc: t('svcFoodDesc'), icon: '🍔', badge: '5min wait' },
            ].map(svc => (
              <Link key={svc.title} to={svc.path} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <span style={{ fontSize: 28 }}>{svc.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: '#EAF4FF', color: '#0057B8' }}>
                      {svc.badge}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#1F2937' }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0, flexGrow: 1, lineHeight: 1.5 }}>
                    {svc.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
