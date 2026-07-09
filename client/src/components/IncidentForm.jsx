import { useState } from 'react';
import { motion } from 'framer-motion';
import { createIncident } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const TYPES = ['medical', 'security', 'crowd', 'facility', 'fire', 'lost', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const LOCATIONS = ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate F', 'North Stand', 'South Stand', 'East Stand', 'West Stand', 'Food Court', 'Parking', 'Medical Center', 'Restrooms', 'Concourse'];

const priorityColor = { low: '#00A651', medium: '#FFD447', high: '#FF9800', critical: '#E63946' };

export default function IncidentForm({ onSubmitted }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ type: '', location: '', priority: 'medium', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.location || !form.description) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await createIncident(form);
      setSuccess(true);
      setForm({ type: '', location: '', priority: 'medium', description: '' });
      onSubmitted?.(res.data);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: 'white', borderRadius: 20, padding: '28px', border: '1px solid #E5E7EB', boxShadow: '0 4px 24px rgba(0,87,184,0.08)' }}
    >
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: '#1F2937' }}>
          🚨 {t('reportIncident')}
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
          AI will automatically categorize and prioritize your report
        </div>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: '14px 18px', borderRadius: 12, marginBottom: 20,
            background: '#E8F8EF', border: '1px solid #00A65140',
            color: '#00A651', fontWeight: 600, fontSize: 14
          }}
        >
          ✅ Incident reported! AI is analyzing and routing to the right team.
        </motion.div>
      )}

      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 12, marginBottom: 16,
          background: '#FFF0F1', border: '1px solid #E6394640',
          color: '#E63946', fontSize: 13
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Type */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            {t('incidentType')} *
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm(f => ({ ...f, type }))}
                style={{
                  padding: '7px 16px', borderRadius: 50, fontSize: 13, fontWeight: 500,
                  border: form.type === type ? '2px solid #0057B8' : '1px solid #E5E7EB',
                  background: form.type === type ? '#EAF4FF' : 'white',
                  color: form.type === type ? '#0057B8' : '#6B7280',
                  cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            {t('location')} *
          </label>
          <select
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              border: '1px solid #E5E7EB', background: 'white',
              fontSize: 14, color: '#374151', outline: 'none', cursor: 'pointer'
            }}
          >
            <option value="">Select location...</option>
            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            {t('priority')}
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setForm(f => ({ ...f, priority: p }))}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                  border: form.priority === p ? `2px solid ${priorityColor[p]}` : '1px solid #E5E7EB',
                  background: form.priority === p ? `${priorityColor[p]}15` : 'white',
                  color: form.priority === p ? priorityColor[p] : '#9CA3AF',
                  cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            {t('description')} *
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4}
            placeholder="Describe the situation clearly..."
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 12,
              border: '1px solid #E5E7EB', background: '#F9FAFB',
              fontSize: 14, color: '#374151', resize: 'vertical',
              outline: 'none', fontFamily: 'Inter', lineHeight: 1.6
            }}
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '14px', borderRadius: 50,
            background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #E63946, #FF6B6B)',
            color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Poppins', fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
              />
              Submitting...
            </>
          ) : `🚨 ${t('submit')}`}
        </motion.button>
      </form>
    </motion.div>
  );
}
