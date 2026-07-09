import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const footerLinks = [
  {
    title: 'Fan Services',
    links: [
      { label: 'AI Assistant', path: '/ai' },
      { label: 'Navigation', path: '/navigate' },
      { label: 'Crowd Status', path: '/crowd' },
      { label: 'Accessibility', path: '/accessibility' },
    ]
  },
  {
    title: 'Stadium',
    links: [
      { label: 'Transport', path: '/transport' },
      { label: 'Food & Facilities', path: '/food' },
      { label: 'Staff Dashboard', path: '/staff' },
    ]
  },
  {
    title: 'FIFA 2026',
    links: [
      { label: 'Schedule', path: '#' },
      { label: 'Venues', path: '#' },
      { label: 'Fan Guide', path: '#' },
      { label: 'Sustainability', path: '#' },
    ]
  }
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0A1628 0%, #060E1A 100%)',
      color: 'white', marginTop: 80
    }}>
      {/* Top banner */}
      <div style={{
        background: 'linear-gradient(90deg, #0057B8, #00A651)',
        padding: '20px 24px', textAlign: 'center'
      }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 15 }}>
          ⚽ FIFA World Cup 2026 — MetLife Stadium, New Jersey, USA
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
          Powered by Google Gemini AI • Real-time Stadium Intelligence
        </div>
      </div>

      {/* Main footer */}
      <div className="page-container" style={{ padding: '56px 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 40,
          marginBottom: 48
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #0057B8, #00A651)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
              }}>⚽</div>
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 18 }}>StadiumPulse AI</div>
                <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: '0.5px' }}>FIFA WORLD CUP 2026</div>
              </div>
            </div>
            <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.8, maxWidth: 280 }}>
              {t('footerDesc')}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {['🤖 AI Powered', '🌍 Multilingual', '♿ Accessible', '🌱 Sustainable'].map(badge => (
                <span key={badge} style={{
                  fontSize: 10, padding: '4px 10px', borderRadius: 50,
                  background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500
                }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map(section => (
            <div key={section.title}>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, marginBottom: 16, opacity: 0.9 }}>
                {section.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {section.links.map(link => (
                  <Link key={link.label} to={link.path} style={{
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    fontSize: 13, transition: 'color 0.2s',
                    display: 'inline-block'
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12
        }}>
          <div style={{ fontSize: 12, opacity: 0.5 }}>{t('copyright')}</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use', 'Accessibility Statement'].map(item => (
              <span key={item} style={{ fontSize: 12, opacity: 0.5, cursor: 'pointer' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div:last-child > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
