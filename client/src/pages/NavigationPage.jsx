import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { navigateAI, getLiveCrowd } from '../services/api';
import PageTransition from '../components/PageTransition';
import { Mic, MicOff, Search, Compass, AlertCircle } from 'lucide-react';

export default function NavigationPage() {
  const { language, t } = useLanguage();
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [gates, setGates] = useState([]);

  useEffect(() => {
    const fetchGates = async () => {
      try {
        const res = await getLiveCrowd();
        setGates(res.data.gates || []);
      } catch (err) {
        console.error('Error fetching gates', err);
      }
    };
    fetchGates();
  }, []);

  const handleSearch = async (queryText) => {
    const query = queryText || question;
    if (!query.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await navigateAI(query, language);
      setResult(res.data.response);
    } catch (err) {
      setResult(t('navigationFallback'));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuestion(transcript);
      handleSearch(transcript);
    };
    recognition.start();
  };

  const chips = [
    { label: t('chipGateC'), icon: '🚪' },
    { label: t('chipFood'), icon: '🍔' },
    { label: t('chipAccess'), icon: '♿' },
    { label: t('chipRestroom'), icon: '🚻' },
    { label: t('chipAid'), icon: '🏥' },
    { label: t('chipSensory'), icon: '🧘' },
    { label: t('chipParking'), icon: '🅿️' },
  ];

  const faqs = [
    { q: t('faqGateCQ'), a: t('faqGateCA') },
    { q: t('faqRestroomQ'), a: t('faqRestroomA') },
    { q: t('faqAccessQ'), a: t('faqAccessA') },
    { q: t('faqFoodQ'), a: t('faqFoodA') },
  ];

  return (
    <PageTransition>
      <div className="page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Header */}
        <div className="section-header">
          <span className="section-badge" style={{ background: '#EAF4FF', color: '#0057B8' }}>AI Navigation</span>
          <h1 className="section-title">Find Your Way in Seconds</h1>
          <p className="section-subtitle">
            Get personalized step-by-step guidance to gates, sections, restrooms, or facilities.
          </p>
        </div>

        {/* Large Gemini Search */}
        <div className="glass-card" style={{ padding: 32, marginBottom: 40, border: '1px solid rgba(0,87,184,0.15)' }}>
          <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
            <Search size={22} color="#6B7280" style={{ position: 'absolute', left: 20, top: 20 }} />
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Ask: 'Where is Section 102?' or 'Nearest water refill station?'"
              style={{
                width: '100%', padding: '18px 24px 18px 56px', borderRadius: 50,
                border: '2px solid #E5E7EB', outline: 'none', fontSize: 16,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={handleVoiceInput}
                style={{
                  width: 52, height: 52, borderRadius: '50%', border: '1px solid #E5E7EB',
                  background: listening ? '#EAF4FF' : 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Voice Search"
              >
                {listening ? <MicOff size={20} color="#0057B8" /> : <Mic size={20} color="#6B7280" />}
              </button>
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="btn-primary"
                style={{ height: 52, padding: '0 28px' }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
            {chips.map(chip => (
              <button
                key={chip.label}
                onClick={() => { setQuestion(chip.label); handleSearch(chip.label); }}
                className="chip"
              >
                <span>{chip.icon}</span> {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {loading || result ? (
          <div className="glass-card" style={{ padding: 28, marginBottom: 40, borderLeft: '5px solid #0057B8' }}>
            {loading ? (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '10px 0' }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    style={{ width: 10, height: 10, borderRadius: '50%', background: '#0057B8' }}
                  />
                ))}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                  <Compass size={20} color="#0057B8" />
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#0057B8', fontFamily: 'Poppins' }}>
                    AI NAVIGATIONAL DIRECTIVE
                  </span>
                </div>
                <div style={{ fontSize: 15, color: '#1F2937', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                  {result}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Stadium Floor Plan and Mini Gate Density */}
        <div className="split-row" style={{ gap: 32, alignItems: 'start' }}>
          {/* Map layout illustration */}
          <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 20 }}>
              📍 Interactive Stadium Plan
            </h3>
            {/* SVG oval layout */}
            <div style={{
              width: '100%', height: 280, background: '#E8F8EF', borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              border: '2px dashed rgba(0, 166, 81, 0.2)'
            }}>
              {/* Stadium shape */}
              <div style={{
                width: '80%', height: '70%', borderRadius: 100, border: '4px solid #0057B8',
                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
              }}>
                <div style={{ width: '60%', height: '50%', borderRadius: 80, background: '#00A65120', border: '2px solid #00A651', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#0057B8', fontWeight: 800, fontSize: 12 }}>PITCH</span>
                </div>

                {/* Gate indicators */}
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#0057B8', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>GATE A</div>
                <div style={{ position: 'absolute', right: -24, top: '50%', transform: 'translateY(-50%)', background: '#0057B8', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>GATE B</div>
                <div style={{ position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)', background: '#0057B8', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>GATE C</div>
                <div style={{ position: 'absolute', left: -24, top: '50%', transform: 'translateY(-50%)', background: '#0057B8', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>GATE D</div>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Common Navigation */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 20 }}>
              💡 Common Navigation Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {faqs.map(faq => (
                <div
                  key={faq.q}
                  onClick={() => { setQuestion(faq.q); handleSearch(faq.q); }}
                  style={{
                    padding: 16, borderRadius: 12, border: '1px solid #E5E7EB',
                    cursor: 'pointer', transition: 'all 0.2s', background: '#F9FAFB'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#0057B8'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937' }}>{faq.q}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
