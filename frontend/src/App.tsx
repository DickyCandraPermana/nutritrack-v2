import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Premium from './pages/Premium';
import Admin from './pages/Admin';
import Foods from './pages/Foods';
import Scan from './pages/Scan';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes without Layout */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
