import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import { Auth } from './pages/Auth';
import { Settings } from './pages/Settings';
import { Documentation } from './pages/Documentation';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Status } from './pages/Status';
import { Support } from './pages/Support';
import { Affiliate } from './pages/Affiliate';

const App: React.FC = () => {
  useEffect(() => {
    const saved = localStorage.getItem('promptgeniex_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      } catch (e) {}
    }
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/status" element={<Status />} />
          <Route path="/support" element={<Support />} />
          <Route path="/affiliate" element={<Affiliate />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;