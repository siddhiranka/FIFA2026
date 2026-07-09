import { motion } from 'framer-motion';

const steps = [
  { icon: '🏠', key: 'Home', color: '#0057B8' },
  { icon: '🚇', key: 'Transport', color: '#00A651' },
  { icon: '🚪', key: 'Entry', color: '#FFD447' },
  { icon: '💺', key: 'Seat', color: '#0057B8' },
  { icon: '🍔', key: 'Food', color: '#00A651' },
  { icon: '⚽', key: 'Match', color: '#E63946' },
];

export default function FanJourneyTracker({ currentStep = 0 }) {
  return (
    <div style={{
      background: 'white', borderRadius: 20, padding: '24px 28px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 24px rgba(0,87,184,0.08)'
    }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, color: '#1F2937' }}>
          🗺️ Fan Journey Tracker
        </div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>Your matchday progress</div>
      </div>

      {/* Desktop horizontal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
        {steps.map((step, i) => (
          <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 64 }}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: i <= currentStep ? 1 : 0.85 }}
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: i <= currentStep ? step.color : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, position: 'relative',
                  boxShadow: i <= currentStep ? `0 4px 16px ${step.color}40` : 'none',
                  transition: 'all 0.3s'
                }}
              >
                {step.icon}
                {i === currentStep && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: 'absolute', inset: -4,
                      borderRadius: '50%', border: `2px solid ${step.color}`
                    }}
                  />
                )}
              </motion.div>
              <div style={{
                fontSize: 11, fontWeight: i <= currentStep ? 600 : 400,
                color: i <= currentStep ? '#1F2937' : '#9CA3AF',
                textAlign: 'center'
              }}>
                {step.key}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, marginBottom: 20, position: 'relative' }}>
                <div style={{ height: '100%', background: '#E5E7EB', borderRadius: 1 }} />
                {i < currentStep && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      background: 'linear-gradient(90deg, #0057B8, #00A651)',
                      borderRadius: 1
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
