import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { getTransportOptions, getTransportAI } from '../services/api';
import PageTransition from '../components/PageTransition';
import { X, CheckCircle, Navigation, Info } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function TransportPage() {
  const { language, t } = useLanguage();
  const [options, setOptions] = useState([]);
  const [sustainabilityTips, setSustainabilityTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');
  const [preference, setPreference] = useState('fastest');
  const [aiRec, setAiRec] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Modal State
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const res = await getTransportOptions();
        setOptions(res.data.options || []);
        setSustainabilityTips(res.data.sustainabilityTips || []);
      } catch (err) {
        console.error('Error fetching transport options', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransport();
  }, []);

  const handleAiRec = async (e) => {
    e.preventDefault();
    if (!origin.trim()) return;
    setAiLoading(true);
    setAiRec('');
    try {
      const res = await getTransportAI(origin, preference, language);
      setAiRec(res.data.response);
    } catch (err) {
      setAiRec(t('transportFallback'));
    } finally {
      setAiLoading(false);
    }
  };

  const getCrowdColor = (level) => {
    if (level?.toLowerCase() === 'high') return { color: '#E63946', bg: '#FFF0F1' };
    if (level?.toLowerCase() === 'medium') return { color: '#FFD447', bg: '#FFF8DD' };
    return { color: '#00A651', bg: '#E8F8EF' };
  };

  return (
    <PageTransition>
      <div className="page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">Transport Hub</span>
          <h1 className="section-title">Get to the Stadium Smartly</h1>
          <p className="section-subtitle">
            Travel sustainably, avoid game-day congestion, and track carbon metrics in real time.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ display: 'inline-block', width: 30, height: 30, border: '3px solid #E5E7EB', borderTopColor: '#0057B8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* Transport Cards Grid */}
            <div className="cards-grid" style={{ marginBottom: 48 }}>
              {options.map((opt, idx) => {
                const crowdStyle = getCrowdColor(opt.crowdLevel);
                return (
                  <motion.div
                    key={opt.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="glass-card"
                    style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 32 }}>{opt.icon}</span>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1F2937' }}>{opt.type}</h3>
                          <span style={{ fontSize: 12, color: '#6B7280' }}>{opt.name}</span>
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: 50, fontSize: 11, fontWeight: 700,
                        background: crowdStyle.bg, color: crowdStyle.color
                      }}>
                        {opt.crowdLevel} Crowd
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, background: '#F9FAFB', padding: 12, borderRadius: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>ETA</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{opt.etaMinutes} min</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>COST</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{opt.cost}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>WALK TIME</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{opt.walkingMinutes} min</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>CO₂ METRIC</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#00A651' }}>{opt.carbonFootprint} kg</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Eco Score</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#00A651' }}>{opt.sustainabilityScore}/10</span>
                      </div>
                      <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#00A651', width: `${opt.sustainabilityScore * 10}%`, borderRadius: 3 }} />
                      </div>
                    </div>

                    <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, flexGrow: 1, margin: '0 0 20px' }}>
                      {opt.recommendation}
                    </p>

                    <button
                      onClick={() => setSelectedRoute(opt)}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      📍 Route Map & Steps
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* AI Custom Planner */}
            <div className="split-row" style={{ gap: 32, marginBottom: 48 }}>
              {/* Form */}
              <div className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
                  🤖 Personalized AI Route Planner
                </h3>
                <form onSubmit={handleAiRec} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Your Current Location (e.g., Manhattan, JFK, Hotel Name)
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={e => setOrigin(e.target.value)}
                      placeholder="Enter location..."
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: '1px solid #E5E7EB', background: '#F9FAFB', outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Travel Preference
                    </label>
                    <select
                      value={preference}
                      onChange={e => setPreference(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: '1px solid #E5E7EB', background: '#F9FAFB', outline: 'none'
                      }}
                    >
                      <option value="fastest">Fastest Time</option>
                      <option value="cheapest">Cheapest Cost</option>
                      <option value="greenest">Eco-Friendly / Sustainable</option>
                    </select>
                  </div>
                  <button type="submit" disabled={aiLoading} className="btn-primary" style={{ justifyContent: 'center', marginTop: 8 }}>
                    {aiLoading ? 'Analyzing Route...' : 'Get AI Recommendation'}
                  </button>
                </form>
              </div>

              {/* Recommendation Box */}
              <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, #EAF4FF, #E8F8EF)' }}>
                {aiLoading ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid rgba(0,87,184,0.1)', borderTopColor: '#0057B8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : aiRec ? (
                  <div>
                    <h4 style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700, color: '#0057B8', marginBottom: 12 }}>
                      🤖 AI Recommended Routes
                    </h4>
                    <div style={{ fontSize: 14, color: '#1F2937', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                      {aiRec}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#6B7280' }}>
                    <span style={{ fontSize: 32 }}>🤖</span>
                    <p style={{ fontSize: 13, margin: '8px 0 0' }}>Enter your origin location to generate step-by-step AI recommendations.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sustainability Tips Section */}
            <div>
              <h3 style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700, color: '#1F2937', marginBottom: 20 }}>
                🌱 Game Day Sustainability Insights
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {sustainabilityTips.map((tip, idx) => (
                  <div key={idx} style={{
                    padding: 16, borderRadius: 16, background: '#E8F8EF',
                    border: '1px solid rgba(0,166,81,0.15)', display: 'flex', gap: 12
                  }}>
                    <span style={{ fontSize: 18 }}>💡</span>
                    <p style={{ fontSize: 13, color: '#2E7D32', fontWeight: 500, margin: 0 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Route Details Modal Overlay */}
        <AnimatePresence>
          {selectedRoute && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: 'rgba(10, 22, 40, 0.6)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  background: 'white', borderRadius: 24, maxWidth: 640, width: '100%',
                  boxShadow: '0 20px 50px rgba(0,87,184,0.3)', overflow: 'hidden',
                  border: '1px solid #E5E7EB'
                }}
              >
                {/* Header */}
                <div style={{
                  padding: '20px 24px', background: 'linear-gradient(135deg, #0057B8, #0070E0)',
                  color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{selectedRoute.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 800, margin: 0 }}>
                        {selectedRoute.type} Route Mapping
                      </h3>
                      <span style={{ fontSize: 12, opacity: 0.85 }}>{selectedRoute.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRoute(null)}
                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body Content */}
                <div style={{ padding: 24 }}>
                  {/* SVG Route Visualization Map */}
                  <div style={{
                    width: '100%', height: 180, background: '#EAF4FF', borderRadius: 16,
                    position: 'relative', overflow: 'hidden', marginBottom: 24,
                    border: '1px solid rgba(0,87,184,0.1)'
                  }}>
                    {selectedRoute.id === 'metro' && (
                      <svg viewBox="0 0 400 180" width="100%" height="100%">
                        {/* Track line */}
                        <line x1="40" y1="90" x2="360" y2="90" stroke="#9CA3AF" strokeWidth="6" />
                        <line x1="40" y1="90" x2="360" y2="90" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4,4" />
                        
                        {/* Stops */}
                        <circle cx="60" cy="90" r="7" fill="#FFD447" stroke="white" strokeWidth="2" />
                        <text x="60" y="115" fontSize="10" fontWeight="700" fill="#1F2937" textAnchor="middle">Penn Station</text>

                        <circle cx="200" cy="90" r="7" fill="#00A651" stroke="white" strokeWidth="2" />
                        <text x="200" y="115" fontSize="10" fontWeight="700" fill="#1F2937" textAnchor="middle">Secaucus Junction</text>

                        <circle cx="340" cy="90" r="9" fill="#0057B8" stroke="white" strokeWidth="2" />
                        <text x="340" y="115" fontSize="10" fontWeight="700" fill="#0057B8" textAnchor="middle">Meadowlands</text>

                        {/* Animated Train */}
                        <motion.text
                          x="60"
                          y="95"
                          fontSize="20"
                          animate={{ x: [60, 200, 340] }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                          textAnchor="middle"
                        >
                          🚇
                        </motion.text>
                      </svg>
                    )}

                    {selectedRoute.id === 'bus' && (
                      <svg viewBox="0 0 400 180" width="100%" height="100%">
                        {/* Road path */}
                        <path d="M 40 120 Q 150 40 200 90 T 360 90" fill="none" stroke="#6B7280" strokeWidth="12" strokeLinecap="round" />
                        <path d="M 40 120 Q 150 40 200 90 T 360 90" fill="none" stroke="white" strokeWidth="2" strokeDasharray="6,6" strokeLinecap="round" />
                        
                        {/* Points */}
                        <circle cx="50" cy="115" r="6" fill="#FFD447" stroke="white" strokeWidth="2" />
                        <text x="50" y="140" fontSize="10" fontWeight="700" fill="#1F2937" textAnchor="middle">Times Square</text>

                        <circle cx="340" cy="90" r="9" fill="#0057B8" stroke="white" strokeWidth="2" />
                        <text x="340" y="115" fontSize="10" fontWeight="700" fill="#0057B8" textAnchor="middle">Drop-off Hub</text>

                        {/* Animated Bus */}
                        <motion.g
                          animate={{
                            offsetDistance: ["0%", "100%"]
                          }}
                          transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: 'linear'
                          }}
                          style={{
                            motionPath: 'path("M 40 120 Q 150 40 200 90 T 360 90")',
                            display: 'block'
                          }}
                        >
                          <text y="6" fontSize="20" textAnchor="middle">🚌</text>
                        </motion.g>
                      </svg>
                    )}

                    {selectedRoute.id === 'taxi' && (
                      <svg viewBox="0 0 400 180" width="100%" height="100%">
                        {/* City Street Grid */}
                        <rect x="20" y="20" width="80" height="50" fill="#E5E7EB" rx="4" />
                        <rect x="120" y="20" width="160" height="50" fill="#E5E7EB" rx="4" />
                        <rect x="300" y="20" width="80" height="50" fill="#E5E7EB" rx="4" />
                        <rect x="20" y="90" width="120" height="60" fill="#E5E7EB" rx="4" />
                        <rect x="160" y="90" width="120" height="60" fill="#E5E7EB" rx="4" />
                        
                        {/* Road winding pathway */}
                        <path d="M 50 160 L 50 80 L 150 80 L 150 10 L 290 10 L 290 80 L 350 80" fill="none" stroke="#4B5563" strokeWidth="8" strokeLinecap="square" />
                        <path d="M 50 160 L 50 80 L 150 80 L 150 10 L 290 10 L 290 80 L 350 80" fill="none" stroke="#FFD447" strokeWidth="1.5" strokeDasharray="4,4" />

                        {/* Animated Taxi */}
                        <motion.g
                          animate={{
                            offsetDistance: ["0%", "100%"]
                          }}
                          transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          style={{
                            motionPath: 'path("M 50 160 L 50 80 L 150 80 L 150 10 L 290 10 L 290 80 L 350 80")',
                            display: 'block'
                          }}
                        >
                          <text y="6" fontSize="18" textAnchor="middle">🚕</text>
                        </motion.g>
                      </svg>
                    )}

                    {selectedRoute.id === 'walking' && (
                      <svg viewBox="0 0 400 180" width="100%" height="100%">
                        {/* Footpath walk line */}
                        <path d="M 40 90 L 130 90 L 220 50 L 350 90" fill="none" stroke="#00A651" strokeWidth="4" strokeDasharray="5,5" strokeLinecap="round" />
                        
                        {/* Checkpoints */}
                        <circle cx="40" cy="90" r="5" fill="#00A651" />
                        <text x="40" y="110" fontSize="9" fontWeight="600" fill="#4B5563" textAnchor="middle">Station Exit</text>

                        <circle cx="130" cy="90" r="5" fill="#00A651" />
                        <text x="130" y="110" fontSize="9" fontWeight="600" fill="#4B5563" textAnchor="middle">Security Check</text>

                        <circle cx="220" cy="50" r="5" fill="#00A651" />
                        <text x="220" y="70" fontSize="9" fontWeight="600" fill="#4B5563" textAnchor="middle">Ticket Scan</text>

                        <circle cx="350" cy="90" r="7" fill="#0057B8" />
                        <text x="350" y="110" fontSize="9" fontWeight="700" fill="#0057B8" textAnchor="middle">Gate A Entry</text>

                        {/* Animated Walker */}
                        <motion.g
                          animate={{
                            offsetDistance: ["0%", "100%"]
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear'
                          }}
                          style={{
                            motionPath: 'path("M 40 90 L 130 90 L 220 50 L 350 90")',
                            display: 'block'
                          }}
                        >
                          <text y="5" fontSize="18" textAnchor="middle">🚶</text>
                        </motion.g>
                      </svg>
                    )}

                    {selectedRoute.id === 'parking' && (
                      <svg viewBox="0 0 400 180" width="100%" height="100%">
                        {/* Parking Bays Grid */}
                        <line x1="40" y1="40" x2="360" y2="40" stroke="#D1D5DB" strokeWidth="2" />
                        <line x1="40" y1="140" x2="360" y2="140" stroke="#D1D5DB" strokeWidth="2" />
                        
                        {/* Bays */}
                        { [40, 90, 140, 190, 240, 290, 340].map(x => (
                          <g key={x}>
                            <line x1={x} y1="20" x2={x} y2="40" stroke="#D1D5DB" strokeWidth="2" />
                            <line x1={x} y1="140" x2={x} y2="160" stroke="#D1D5DB" strokeWidth="2" />
                          </g>
                        ))}

                        {/* Labels */}
                        <text x="70" y="32" fontSize="9" fill="#9CA3AF" fontWeight="600">VIP Lot P1</text>
                        <text x="240" y="32" fontSize="9" fill="#9CA3AF" fontWeight="600">General Lot P2</text>
                        <text x="140" y="152" fontSize="9" fill="#9CA3AF" fontWeight="600">Accessibility Bay (Gate D)</text>

                        {/* Entrance Road & Car navigation path */}
                        <path d="M 40 90 L 220 90 L 220 120" fill="none" stroke="#4B5563" strokeWidth="6" strokeLinecap="round" />
                        <path d="M 40 90 L 220 90 L 220 120" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3,3" />

                        {/* Animated Car */}
                        <motion.g
                          animate={{
                            offsetDistance: ["0%", "100%"]
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          style={{
                            motionPath: 'path("M 40 90 L 220 90 L 220 120")',
                            display: 'block'
                          }}
                        >
                          <text y="5" fontSize="18" textAnchor="middle">🚗</text>
                        </motion.g>
                      </svg>
                    )}
                    
                    {/* Live Badge */}
                    <div style={{
                      position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)',
                      padding: '4px 10px', borderRadius: 50, fontSize: 10, fontWeight: 700,
                      color: '#0057B8', display: 'flex', alignItems: 'center', gap: 6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00A651', animation: 'pulse-ring 1.5s infinite' }} />
                      Simulated Line
                    </div>
                  </div>

                  {/* Directions Checklist Stepper */}
                  <h4 style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 700, color: '#1F2937', marginBottom: 12 }}>
                    📋 Step-by-Step Directions
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(selectedRoute.tips || []).map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', background: '#EAF4FF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, color: '#0057B8', flexShrink: 0
                        }}>
                          {i + 1}
                        </div>
                        <p style={{ fontSize: 13, color: '#4B5563', margin: 0, lineHeight: 1.5 }}>{tip}</p>
                      </div>
                    ))}
                  </div>

                  {/* Accessibility info snippet */}
                  <div style={{
                    marginTop: 20, padding: 14, borderRadius: 12, background: '#F9FAFB',
                    display: 'flex', gap: 10, alignItems: 'flex-start', border: '1px solid #E5E7EB'
                  }}>
                    <Info size={16} color="#6B7280" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
                      Meadowlands services run continuously starting 4 hours before match kickoff until 2 hours post-match. Accessible ramps are fully operational.
                    </p>
                  </div>
                </div>

                {/* Footer buttons */}
                <div style={{
                  padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB',
                  display: 'flex', justifyContent: 'flex-end', gap: 12
                }}>
                  <button
                    onClick={() => setSelectedRoute(null)}
                    style={{
                      padding: '10px 20px', borderRadius: 50, border: '1px solid #D1D5DB',
                      background: 'white', color: '#4B5563', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => { setSelectedRoute(null); alert('Directions saved offline!'); }}
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: 13 }}
                  >
                    Save Offline
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </PageTransition>
  );
}
