import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { getAccessibleRoute } from '../services/api';
import PageTransition from '../components/PageTransition';

export default function AccessibilityPage() {
  const { language, t } = useLanguage();
  const [needs, setNeeds] = useState('wheelchair');
  const [destination, setDestination] = useState('Accessible Section 401');
  const [routePlan, setRoutePlan] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Settings states
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleRoutePlanner = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setRoutePlan('');
    try {
      const res = await getAccessibleRoute(destination, needs, language);
      setRoutePlan(res.data.response);
      if (ttsEnabled && 'speechSynthesis' in window) {
        // Read text aloud
        const utterance = new SpeechSynthesisUtterance(res.data.response.replace(/[#*•]/g, ''));
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setRoutePlan(t('accessibilityFallback'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleTtsToggle = () => {
    setTtsEnabled(!ttsEnabled);
    if (!ttsEnabled && 'speechSynthesis' in window) {
      const text = language === 'es' ? 'Narración de voz activada.' : language === 'pt' ? 'Narração de voz ativada.' : 'Text to speech enabled. AI responses will be spoken.';
      const u = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(u);
    }
  };

  const handleTextSizeToggle = () => {
    setLargeText(!largeText);
    if (!largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  };

  const handleContrastToggle = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const features = [
    { icon: '♿', title: 'Accessible Routes', desc: 'Step-free routes, tactile paving, and guided paths.', loc: 'All Gate Entrances' },
    { icon: '🛗', title: 'Elevators', desc: 'Priority elevators to upper stands & VIP suites.', loc: 'Gates A, D, E, F' },
    { icon: '🏥', title: 'Medical Centers', desc: 'Equipped for medical assistance and mobility device charging.', loc: 'Gate D, Ground level' },
    { icon: '🚻', title: 'Accessible Toilets', desc: 'Spacious, push-button entry, grab rails, emergency cords.', loc: 'Every level near main gates' },
    { icon: '🧘', title: 'Sensory Room', desc: 'Quiet, calm space for sensory overloaded spectators.', loc: 'Gate F, Upper Level' },
    { icon: '🎧', title: 'Audio Description', desc: 'Live match commentary for visually impaired fans.', loc: 'Tune to 88.3 FM inside stadium' },
  ];

  return (
    <PageTransition>
      <div className="page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Header */}
        <div className="section-header">
          <span className="section-badge" style={{ background: '#F3EAFE', color: '#9333EA' }}>Accessibility Hub</span>
          <h1 className="section-title">Everyone Welcome at FIFA 2026</h1>
          <p className="section-subtitle">
            Providing tailored stadium routing, sensory accommodations, and assist utilities for all fans.
          </p>
        </div>

        {/* Setting Controls */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 40, display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🗣️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Text-to-Speech</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Read AI routes aloud</div>
            </div>
            <button
              onClick={handleTtsToggle}
              style={{
                width: 50, height: 26, borderRadius: 13, background: ttsEnabled ? '#0057B8' : '#D1D5DB',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s'
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: ttsEnabled ? 27 : 3, transition: 'all 0.2s' }} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🔍</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Large Text Mode</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Bigger, easier reading</div>
            </div>
            <button
              onClick={handleTextSizeToggle}
              style={{
                width: 50, height: 26, borderRadius: 13, background: largeText ? '#0057B8' : '#D1D5DB',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s'
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: largeText ? 27 : 3, transition: 'all 0.2s' }} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🌓</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>High Contrast Mode</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Enhanced text readability</div>
            </div>
            <button
              onClick={handleContrastToggle}
              style={{
                width: 50, height: 26, borderRadius: 13, background: highContrast ? '#0057B8' : '#D1D5DB',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s'
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: highContrast ? 27 : 3, transition: 'all 0.2s' }} />
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card"
              style={{ padding: 24 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EAF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
                {feat.icon}
              </div>
              <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#1F2937' }}>{feat.title}</h3>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px', lineHeight: 1.5 }}>{feat.desc}</p>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0057B8', background: '#EAF4FF', padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>
                📍 {feat.loc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Accessible Route Planner */}
        <div className="split-row" style={{ gap: 32, alignItems: 'start' }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
              ♿ AI Accessible Route Planner
            </h3>
            <form onSubmit={handleRoutePlanner} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Select Destination
                </label>
                <select
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10,
                    border: '1px solid #E5E7EB', background: '#F9FAFB', outline: 'none'
                  }}
                >
                  <option value="Accessible Section 401">Accessible Section 401 (Lower Concourse)</option>
                  <option value="Sensory Room">Sensory Room (Gate F Upper)</option>
                  <option value="Medical Center">First Aid / Medical Center (Gate D)</option>
                  <option value="Accessible Restroom">Accessible Restroom (Gate A Concourse)</option>
                  <option value="Elevator Bank">West Elevator Bank (Gate D)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Access Requirement
                </label>
                <select
                  value={needs}
                  onChange={e => setNeeds(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10,
                    border: '1px solid #E5E7EB', background: '#F9FAFB', outline: 'none'
                  }}
                >
                  <option value="wheelchair">Wheelchair User / Step-free Path</option>
                  <option value="senior">Senior Citizen / Light Walking Path</option>
                  <option value="visually-impaired">Visually Impaired / Tactical Path</option>
                  <option value="hearing-impaired">Hearing Impaired / Assisted Guide</option>
                </select>
              </div>
              <button type="submit" disabled={aiLoading} className="btn-primary" style={{ justifyContent: 'center' }}>
                {aiLoading ? 'Planning Route...' : 'Generate Accessible Route'}
              </button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, #F3EAFE 0%, #EAF4FF 100%)', border: '1px solid rgba(147,51,234,0.15)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {aiLoading ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid rgba(147,51,234,0.1)', borderTopColor: '#9333EA', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : routePlan ? (
              <div>
                <h4 style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700, color: '#9333EA', marginBottom: 12 }}>
                  ♿ Step-by-Step Accessible Path
                </h4>
                <div style={{ fontSize: 14, color: '#1F2937', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {routePlan}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#6B7280' }}>
                <span style={{ fontSize: 32 }}>🦽</span>
                <p style={{ fontSize: 13, margin: '8px 0 0' }}>Plan a route to display step-by-step navigation instructions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
