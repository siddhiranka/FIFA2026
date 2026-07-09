import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { RoleProvider } from './contexts/RoleContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAIButton from './components/FloatingAIButton';

// Pages
import HomePage from './pages/HomePage';
import AIAssistantPage from './pages/AIAssistantPage';
import NavigationPage from './pages/NavigationPage';
import CrowdPage from './pages/CrowdPage';
import TransportPage from './pages/TransportPage';
import AccessibilityPage from './pages/AccessibilityPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import FoodFacilitiesPage from './pages/FoodFacilitiesPage';
import LoginPage from './pages/LoginPage';
import { useRole } from './contexts/RoleContext';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useRole();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function StaffRoute({ children }) {
  const { isAuthenticated, isStaff } = useRole();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStaff) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useRole();
  const isChatRoute = location.pathname === '/ai';
  const isAuthRoute = location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/ai" element={<PrivateRoute><AIAssistantPage /></PrivateRoute>} />
          <Route path="/navigate" element={<PrivateRoute><NavigationPage /></PrivateRoute>} />
          <Route path="/crowd" element={<PrivateRoute><CrowdPage /></PrivateRoute>} />
          <Route path="/transport" element={<PrivateRoute><TransportPage /></PrivateRoute>} />
          <Route path="/accessibility" element={<PrivateRoute><AccessibilityPage /></PrivateRoute>} />
          <Route path="/food" element={<PrivateRoute><FoodFacilitiesPage /></PrivateRoute>} />
          <Route path="/staff" element={<StaffRoute><StaffDashboardPage /></StaffRoute>} />
        </Routes>
      </main>
      {isAuthenticated && <FloatingAIButton />}
      {!isChatRoute && !isAuthRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <RoleProvider>
        <Router>
          <AppContent />
        </Router>
      </RoleProvider>
    </LanguageProvider>
  );
}

