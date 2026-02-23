import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import Dashboard     from './pages/Dashboard';
import FarmerPage    from './pages/FarmerPage';
import CropsPage     from './pages/CropsPage';
import MarketPage    from './pages/MarketPage';
import WeatherPage   from './pages/WeatherPage';
import SchemesPage   from './pages/SchemesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage     from './pages/AdminPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#6fcf97',fontSize:'18px' }}>🌱 Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="farmer"    element={<FarmerPage />} />
          <Route path="crops"     element={<CropsPage />} />
          <Route path="market"    element={<MarketPage />} />
          <Route path="weather"   element={<WeatherPage />} />
          <Route path="schemes"   element={<SchemesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="admin"     element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}
