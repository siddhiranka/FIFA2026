import { motion } from 'framer-motion';

const getStatus = (density) => {
  if (density >= 70) return { color: '#E63946', bg: '#FFF0F1', label: 'High', barClass: 'density-high' };
  if (density >= 40) return { color: '#FFD447', bg: '#FFF8DD', label: 'Medium', barClass: 'density-medium' };
  return { color: '#00A651', bg: '#E8F8EF', label: 'Low', barClass: 'density-low' };
};

export default function CrowdHeatmap({ gateData = [], aiRecommendation = '' }) {
  if (!gateData.length) {
    gateData = [
      { id: 'A', name: 'Gate A', density: 85, waitMinutes: 12 },
      { id: 'B', name: 'Gate B', density: 62, waitMinutes: 6 },
      { id: 'C', name: 'Gate C', density: 28, waitMinutes: 2 },
      { id: 'D', name: 'Gate D', density: 45, waitMinutes: 5 },
      { id: 'E', name: 'Gate E', density: 15, waitMinutes: 1 },
      { id: 'F', name: 'Gate F', density: 71, waitMinutes: 9 },
    ];
  }

  return (
    <div>
      {/* Stadium Visual Map */}
      <div style={{
        background: 'linear-gradient(180deg, #1a6b35 0%, #145c2b 50%, #1a6b35 100%)',
        borderRadius: 20, padding: '24px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)'
      }}>
        {/* Pitch lines */}
        <div style={{
          position: 'absolute', inset: 12,
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: 14
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: 12, right: 12,
          height: 2, background: 'rgba(255,255,255,0.2)',
          transform: 'translateY(-50%)'
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 80, height: 80, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.2)',
          transform: 'translate(-50%, -50%)'
        }} />

        {/* Gate bubbles */}
        <div style={{ position: 'relative', paddingTop: '60%' }}>
          {[
            { id: 'A', x: '50%', y: '2%' },
            { id: 'B', x: '93%', y: '48%' },
            { id: 'C', x: '50%', y: '93%' },
            { id: 'D', x: '2%', y: '48%' },
            { id: 'E', x: '78%', y: '8%' },
            { id: 'F', x: '18%', y: '90%' },
          ].map(pos => {
            const gate = gateData.find(g => g.id === pos.id) || {};
            const status = getStatus(gate.density || 50);
            return (
              <motion.div
                key={pos.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                style={{
                  position: 'absolute',
                  left: pos.x, top: pos.y,
                  transform: 'translate(-50%, -50%)',
                  width: 52, height: 52,
                  borderRadius: '50%',
                  background: status.color,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: `0 4px 20px ${status.color}60`,
                  border: '3px solid rgba(255,255,255,0.8)'
                }}
              >
                <span style={{ color: 'white', fontWeight: 800, fontSize: 12, fontFamily: 'Poppins' }}>
                  {pos.id}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 9, fontWeight: 600 }}>
                  {gate.density || '—'}%
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', paddingTop: 8 }}>
          {[
            { color: '#00A651', label: 'Low (<40%)' },
            { color: '#FFD447', label: 'Medium (40-70%)' },
            { color: '#E63946', label: 'High (>70%)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gate List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {gateData.map((gate, i) => {
          const status = getStatus(gate.density);
          return (
            <motion.div
              key={gate.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 14,
                background: 'white', border: '1px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: status.bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins', fontWeight: 800, color: status.color, fontSize: 14
              }}>
                {gate.id}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#1F2937' }}>{gate.name}</span>
                  <span style={{ fontSize: 13, color: status.color, fontWeight: 700 }}>{gate.density}%</span>
                </div>
                <div className="density-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gate.density}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`density-fill ${status.barClass}`}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: status.color,
                  background: status.bg, padding: '3px 10px', borderRadius: 50
                }}>
                  {status.label}
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                  ~{gate.waitMinutes} min
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Recommendation */}
      {aiRecommendation && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px 20px', borderRadius: 14,
            background: 'linear-gradient(135deg, #EAF4FF, #E8F8EF)',
            border: '1px solid rgba(0,87,184,0.15)'
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0057B8', marginBottom: 6 }}>
                AI Crowd Recommendation
              </div>
              <div style={{ fontSize: 14, color: '#1F2937', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {aiRecommendation}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
