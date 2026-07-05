import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Foods from './pages/Foods';
import Scan from './pages/Scan';

// Temporary dummy components for routing setup
function Home() {
  return (
    <div className="glass-card rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-semibold mb-4 text-emerald-300">Welcome back, Alex!</h2>
      <p className="text-slate-300 mb-6">Here is your nutrition summary for today.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Calories', 'Protein', 'Carbs', 'Fat'].map((macro, i) => (
          <div key={macro} className="glass rounded-2xl p-4 flex flex-col items-center justify-center">
            <span className="text-sm text-slate-400">{macro}</span>
            <span className="text-2xl font-bold text-slate-100">{[1850, 120, 200, 65][i]}</span>
            <span className="text-xs text-emerald-400 mt-1">/ {[2200, 150, 250, 70][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/diary" element={<div className="glass-card rounded-3xl p-8"><h2 className="text-2xl font-semibold text-emerald-300">Food Diary</h2></div>} />
          <Route path="/profile" element={<div className="glass-card rounded-3xl p-8"><h2 className="text-2xl font-semibold text-emerald-300">Profile Settings</h2></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
