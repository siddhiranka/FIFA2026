import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { getLiveCrowd, getCrowdAnalysis } from '../services/api';
import CrowdHeatmap from '../components/CrowdHeatmap';
import PageTransition from '../components/PageTransition';

export default function CrowdPage() {
  const { language, t } = useLanguage();
  const [crowdData, setCrowdData] = useState(null);
  const [aiRec, setAiRec] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLiveCrowd = async () => {
    try {
      const res = await getLiveCrowd();
      setCrowdData(res.data);
    } catch (err) {
      console.error('Error fetching crowd data', err);
    }
  };

  const fetchAiAnalysis = async () => {
    try {
      const res = await getCrowdAnalysis(language);
      setAiRec(res.data.response);
    } catch (err) {
      console.error('Error fetching AI analysis', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchLiveCrowd(), fetchAiAnalysis()]);
      setLoading(false);
    };
    init();
  }, [language]);

  useEffect(() => {
    // Poll live crowd every 20 seconds
    const interval = setInterval(fetchLiveCrowd, 20000);
    return () => clearInterval(interval);
  }, []);

  // Find least crowded gate
  const getLeastCrowdedGate = () => {
    if (!crowdData || !crowdData.gates) return null;
    const sorted = [...crowdData.gates].sort((a, b) => a.density - b.density);
    return sorted[0];
  };

  const leastCrowded = getLeastCrowdedGate();

  return (
    <PageTransition>
      <div className="page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Header */}
        <div className="section-header">
          <span className="section-badge" style={{ background: '#E8F8EF', color: '#00A651' }}>Live Crowd Intelligence</span>
          <h1 className="section-title">Real-Time Stadium Crowd Map</h1>
          <p className="section-subtitle">
            Live flow monitoring, wait times, gate density statistics, and automated volunteer directives.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ display: 'inline-block', width: 30, height: 30, border: '3px solid #E5E7EB', borderTopColor: '#0057B8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, alignItems: 'start' }}>
            {/* Left Column: Interactive Map & Gate List */}
            <div>
              <CrowdHeatmap gateData={crowdData?.gates} aiRecommendation={aiRec} />
            </div>

            {/* Right Column: Live Statistics, Alerts, and Recommendations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Occupancy card */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
                  📊 Live Stadium Statistics
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>OCCUPANCY</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#0057B8', margin: '4px 0' }}>
                      {crowdData?.occupancyPercent}%
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{crowdData?.currentOccupancy} fans inside</div>
                  </div>
                  <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>AVG. WAIT TIME</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#FFD447', margin: '4px 0' }}>
                      {crowdData ? Math.round(crowdData.gates.reduce((acc, g) => acc + g.waitMinutes, 0) / crowdData.gates.length) : 0} min
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>across all entrances</div>
                  </div>
                </div>
              </div>

              {/* Recommended Gate Card */}
              {leastCrowded && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'linear-gradient(135deg, #00A651, #00C070)', color: 'white',
                    padding: 24, borderRadius: 20, boxShadow: '0 8px 24px rgba(0,166,81,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 50, letterSpacing: '0.5px' }}>
                      RECOMMENDED ENTRANCE
                    </span>
                    <h3 style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 800, margin: '8px 0 2px' }}>
                      Use {leastCrowded.name}
                    </h3>
                    <p style={{ fontSize: 13, opacity: 0.9, margin: 0 }}>
                      Only {leastCrowded.density}% density • ~{leastCrowded.waitMinutes} min wait
                    </p>
                  </div>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, color: '#00A651', fontWeight: 800
                  }}>
                    {leastCrowded.id}
                  </div>
                </motion.div>
              )}

              {/* Alerts */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
                  🔔 Live Congestion Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {crowdData?.alerts.map((alert, i) => (
                    <div key={i} style={{
                      padding: 14, borderRadius: 12, display: 'flex', gap: 12,
                      background: alert.severity === 'high' ? '#FFF0F1' : '#FFF8DD',
                      borderLeft: `4px solid ${alert.severity === 'high' ? '#E63946' : '#FFD447'}`
                    }}>
                      <span style={{ fontSize: 18 }}>{alert.severity === 'high' ? '🚨' : '⚠️'}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: alert.severity === 'high' ? '#E63946' : '#B8860B', textTransform: 'uppercase' }}>
                          {alert.location}
                        </div>
                        <p style={{ fontSize: 12, color: '#1F2937', margin: '2px 0 0', lineHeight: 1.4 }}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
