import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MATCH_DATE = new Date('2026-07-14T18:00:00-05:00'); // FIFA WC 2026 Final

export default function MatchCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = MATCH_DATE - now;
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0057B8 0%, #003d85 100%)',
      borderRadius: 20, padding: '24px 28px', color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>🏆</span>
        <div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14 }}>FIFA World Cup Final 2026</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>MetLife Stadium, NJ • July 14, 2026</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {units.map((unit, i) => (
          <div key={unit.label} style={{ textAlign: 'center', flex: 1 }}>
            <motion.div
              key={unit.value}
              initial={{ scale: 1.2, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 12, padding: '10px 4px',
                fontFamily: 'Poppins', fontWeight: 800, fontSize: 28,
                lineHeight: 1, marginBottom: 6
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.div>
            <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 500, letterSpacing: '0.5px' }}>
              {unit.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
