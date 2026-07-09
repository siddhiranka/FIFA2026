import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { getStaffSummary, getIncidents, getLiveCrowd, updateIncidentStatus } from '../services/api';
import IncidentForm from '../components/IncidentForm';
import IncidentTimeline from '../components/IncidentTimeline';
import PageTransition from '../components/PageTransition';

export default function StaffDashboardPage() {
  const { language, t } = useLanguage();
  const [summary, setSummary] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [crowd, setCrowd] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStaffData = async () => {
    try {
      const [sumRes, incRes, crdRes] = await Promise.all([
        getStaffSummary(language),
        getIncidents(),
        getLiveCrowd()
      ]);
      setSummary(sumRes.data.response);
      setIncidents(incRes.data);
      setCrowd(crdRes.data);
    } catch (err) {
      console.error('Error fetching staff metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [language]);

  useEffect(() => {
    const interval = setInterval(fetchStaffData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleIncidentSubmitted = (newInc) => {
    setIncidents(prev => [newInc, ...prev]);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateIncidentStatus(id, status);
      fetchStaffData();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  // Volunteer stats
  const volunteers = [
    { name: 'David Miller', gate: 'Gate A', status: 'Active', activeTime: '3h 15m' },
    { name: 'Sarah Jenkins', gate: 'Gate C', status: 'On Break', activeTime: '4h 00m' },
    { name: 'Carlos Ramos', gate: 'Gate E', status: 'Active', activeTime: '2h 30m' },
    { name: 'Amina Diop', gate: 'Gate D', status: 'Active', activeTime: '5h 10m' },
  ];

  return (
    <PageTransition>
      <div className="page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0057B8 100%)',
          borderRadius: 20, padding: '32px', color: 'white', marginBottom: 40,
          boxShadow: '0 8px 32px rgba(0,87,184,0.15)', position: 'relative', overflow: 'hidden'
        }}>
          {/* Overlay glow */}
          <div style={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,166,81,0.25)', filter: 'blur(50px)' }} />

          <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 50 }}>
            STAFF SECURITY OPERATIONS
          </span>
          <h1 style={{ fontFamily: 'Poppins', fontSize: 28, fontWeight: 800, margin: '12px 0 6px' }}>
            Live Stadium Intelligence
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
            {t('staffGreeting')}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ display: 'inline-block', width: 30, height: 30, border: '3px solid #E5E7EB', borderTopColor: '#0057B8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="split-row" style={{ gap: 32 }}>
            {/* Left side: AI Directives, Active Incidents list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* AI Briefing summary */}
              <div className="glass-card" style={{ padding: 28, borderLeft: '6px solid #FFD447' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>🤖</span>
                  <h3 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 800, color: '#1F2937', margin: 0 }}>
                    Real-Time Operational AI Briefing
                  </h3>
                </div>
                <div style={{ fontSize: 14, color: '#1F2937', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                  {summary}
                </div>
              </div>

              {/* Incidents Timeline */}
              <div>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 800, color: '#1F2937', marginBottom: 18 }}>
                  🚨 Active Incidents & Priority Logs
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {incidents.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', color: '#6B7280' }}>
                      No active incident reports at this time.
                    </div>
                  ) : (
                    incidents.map((incident) => (
                      <div key={incident._id} className="glass-card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div>
                            <span style={{
                              padding: '4px 10px', borderRadius: 50, fontSize: 10, fontWeight: 700,
                              background: incident.priority === 'critical' || incident.priority === 'high' ? '#FFF0F1' : '#E8F8EF',
                              color: incident.priority === 'critical' || incident.priority === 'high' ? '#E63946' : '#00A651',
                              textTransform: 'uppercase'
                            }}>
                              {incident.priority}
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginLeft: 10 }}>
                              {incident.type} — {incident.location}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                            {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 16px', lineHeight: 1.5 }}>
                          {incident.description}
                        </p>

                        {/* Status buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
                          <span style={{ fontSize: 11, color: '#6B7280' }}>
                            Reported by: <strong>{incident.reportedBy}</strong>
                          </span>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {['assigned', 'investigating', 'resolved'].map(status => (
                              <button
                                key={status}
                                onClick={() => handleUpdateStatus(incident._id, status)}
                                style={{
                                  padding: '5px 12px', borderRadius: 50, border: 'none',
                                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                  background: incident.status === status ? '#0057B8' : '#F3F4F6',
                                  color: incident.status === status ? 'white' : '#6B7280',
                                  textTransform: 'capitalize'
                                }}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {incident.aiRecommendation && (
                          <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: '#EAF4FF', color: '#0057B8', fontSize: 12, lineHeight: 1.5 }}>
                            🤖 <strong>AI Direct Action:</strong> {incident.aiRecommendation}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Report Incident Form, Volunteer status check */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Form */}
              <IncidentForm onSubmitted={handleIncidentSubmitted} />

              {/* Volunteer Status check */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
                  👷 Active Volunteers
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {volunteers.map(vol => (
                    <div key={vol.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: '#F9FAFB' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{vol.name}</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>Assigned: {vol.gate}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: 10, padding: '3px 8px', borderRadius: 50, fontWeight: 700,
                          background: vol.status === 'Active' ? '#E8F8EF' : '#F3F4F6',
                          color: vol.status === 'Active' ? '#00A651' : '#6B7280'
                        }}>
                          {vol.status}
                        </span>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{vol.activeTime} duty</div>
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
