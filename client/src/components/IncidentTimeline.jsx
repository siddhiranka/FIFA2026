import { motion } from 'framer-motion';

const STATUSES = ['submitted', 'assigned', 'investigating', 'resolved'];
const STATUS_CONFIG = {
  submitted: { color: '#6B7280', icon: '📝', bg: '#F3F4F6' },
  assigned: { color: '#0057B8', icon: '👷', bg: '#EAF4FF' },
  investigating: { color: '#FF9800', icon: '🔍', bg: '#FFF3E0' },
  resolved: { color: '#00A651', icon: '✅', bg: '#E8F8EF' },
};

const PRIORITY_CONFIG = {
  low: { color: '#00A651', label: 'Low' },
  medium: { color: '#FFD447', label: 'Medium' },
  high: { color: '#FF9800', label: 'High' },
  critical: { color: '#E63946', label: 'Critical' },
};

export default function IncidentTimeline({ incidents = [] }) {
  if (incidents.length === 0) {
    const demo = [
      { _id: '1', type: 'crowd', location: 'Gate A', priority: 'high', description: 'Overcrowding near Gate A entrance', status: 'investigating', aiSeverity: 'high', createdAt: new Date(Date.now() - 3600000) },
      { _id: '2', type: 'medical', location: 'Section 101', priority: 'medium', description: 'Fan feeling unwell, first aid requested', status: 'resolved', aiSeverity: 'medium', createdAt: new Date(Date.now() - 7200000) },
      { _id: '3', type: 'facility', location: 'East Concourse Restroom', priority: 'low', description: 'Restroom out of service', status: 'assigned', aiSeverity: 'low', createdAt: new Date(Date.now() - 1800000) },
    ];
    incidents = demo;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {incidents.map((incident, idx) => {
        const statusIdx = STATUSES.indexOf(incident.status);
        const priority = PRIORITY_CONFIG[incident.priority] || PRIORITY_CONFIG.medium;
        const statusCfg = STATUS_CONFIG[incident.status] || STATUS_CONFIG.submitted;

        return (
          <motion.div
            key={incident._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              background: 'white', borderRadius: 16,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 12px rgba(0,87,184,0.06)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 18px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: statusCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>
                  {statusCfg.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1F2937', textTransform: 'capitalize' }}>
                    {incident.type} — {incident.location}
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div style={{
                padding: '4px 12px', borderRadius: 50, fontSize: 11, fontWeight: 700,
                background: `${priority.color}20`, color: priority.color
              }}>
                {priority.label}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '14px 18px' }}>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 14, lineHeight: 1.5 }}>
                {incident.description}
              </p>

              {/* Progress Bar */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {STATUSES.map((status, i) => (
                  <div key={status} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      height: 4, width: '100%', borderRadius: 2,
                      background: i <= statusIdx ? statusCfg.color : '#E5E7EB',
                      transition: 'background 0.3s'
                    }} />
                    <span style={{ fontSize: 9, color: i <= statusIdx ? statusCfg.color : '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              {incident.aiRecommendation && (
                <div style={{
                  marginTop: 10, padding: '10px 12px', borderRadius: 10,
                  background: '#EAF4FF', fontSize: 12, color: '#0057B8', lineHeight: 1.6
                }}>
                  🤖 <strong>AI:</strong> {incident.aiRecommendation}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
