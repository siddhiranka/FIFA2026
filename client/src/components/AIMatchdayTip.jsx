import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RefreshCw } from 'lucide-react';

const tips = [
  { icon: '🚪', text: 'Gate E has the shortest queue right now – only 1 min wait!', color: '#00A651' },
  { icon: '🚇', text: 'Metro is the fastest & greenest way to the stadium today.', color: '#0057B8' },
  { icon: '💧', text: 'Water refill stations are available near all gates. Go plastic-free!', color: '#0097FF' },
  { icon: '♿', text: 'Accessible entry at Gate D – elevators are fully operational.', color: '#9333EA' },
  { icon: '🍔', text: 'The Central Food Court has the shortest queue right now (5 min).', color: '#FF9800' },
  { icon: '📱', text: 'Save your mobile ticket offline – WiFi can be slow at peak entry.', color: '#E63946' },
  { icon: '🌱', text: 'You\'re saving 5.4kg CO₂ by taking the metro instead of driving!', color: '#00A651' },
  { icon: '🔒', text: 'Keep your bags accessible for security checks at the gate.', color: '#6B7280' },
];

export default function AIMatchdayTip() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const tip = tips[current];

  return (
    <div style={{
      background: `linear-gradient(135deg, ${tip.color}15, ${tip.color}08)`,
      border: `1px solid ${tip.color}30`,
      borderRadius: 16, padding: '18px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
      transition: 'background 0.5s, border-color 0.5s'
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${tip.color}20`, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22
      }}>
        {tip.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: tip.color, fontWeight: 600, marginBottom: 4, letterSpacing: '0.5px' }}>
          🤖 AI MATCHDAY TIP
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ fontSize: 14, color: '#1F2937', fontWeight: 500, lineHeight: 1.5, margin: 0 }}
          >
            {tip.text}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setCurrent((current + 1) % tips.length)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
        aria-label="Next tip"
      >
        <RefreshCw size={16} color={tip.color} />
      </button>
    </div>
  );
}
