import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import DesignerDashboard from '../pages/DesignerDashboard';
import PortfolioPage from '../pages/PortfolioPage';
import ConsultationPage from '../pages/ConsultationPage';
import VisualizerPage from '../pages/VisualizerPage';
import ProfilePage from '../pages/ProfilePage';
import RecommendationsPage from '../pages/RecommendationsPage';
import DesignDetailPage from '../pages/DesignDetailPage';
import SupplierPage from '../pages/SupplierPage';

const LoadingSpinner = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen w-full flex items-center justify-center bg-surface/80 backdrop-blur-sm"
  >
    <div className="relative">
      <div className="w-16 h-16 border-4 border-luxury-gold/20 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
    </div>
  </motion.div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    navigate('/dashboard');
  }

  return user && allowedRoles.includes(user.role) ? children : null;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/designer-dashboard" element={
        <RoleRoute allowedRoles={['designer']}>
          <DesignerDashboard />
        </RoleRoute>
      } />
      
      <Route path="/portfolio" element={
        <ProtectedRoute>
          <PortfolioPage />
        </ProtectedRoute>
      } />
      
      <Route path="/consultation" element={
        <ProtectedRoute>
          <ConsultationPage />
        </ProtectedRoute>
      } />
      
      <Route path="/visualizer" element={
        <ProtectedRoute>
          <VisualizerPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/recommendations" element={
        <ProtectedRoute>
          <RecommendationsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/design/:id" element={
        <ProtectedRoute>
          <DesignDetailPage />
        </ProtectedRoute>
      } />
      
      <Route path="/supplier" element={
        <ProtectedRoute>
          <SupplierPage />
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
