import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  res => res,
  err => {
    console.error('API Error:', err.response?.data?.error || err.message);
    return Promise.reject(err);
  }
);

// AI endpoints
export const chatWithAI = (message, language) => api.post('/ai/chat', { message, language });
export const navigateAI = (question, language) => api.post('/ai/navigate', { question, language });
export const getCrowdAnalysis = (language) => api.get('/ai/crowd-analysis', { params: { language } });
export const getTransportAI = (origin, preference, language) => api.post('/ai/transport', { origin, preference, language });
export const getAccessibleRoute = (destination, needs, language) => api.post('/ai/accessible-route', { destination, needs, language });
export const getStaffSummary = (language) => api.get('/ai/staff-summary', { params: { language } });

// Crowd endpoints
export const getLiveCrowd = () => api.get('/crowd');
export const getGateCrowd = (gateId) => api.get(`/crowd/gate/${gateId}`);
export const getCrowdAlerts = () => api.get('/crowd/alerts');

// Incident endpoints
export const getIncidents = () => api.get('/incidents');
export const createIncident = (data) => api.post('/incidents', data);
export const updateIncidentStatus = (id, status) => api.patch(`/incidents/${id}/status`, { status });

// Transport endpoints
export const getTransportOptions = () => api.get('/transport');
export const getStadiumData = () => api.get('/transport/stadium');

export default api;
