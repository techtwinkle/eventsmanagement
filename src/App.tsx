import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import CategorySelection from './components/CategorySelection';
import PublicFeed from './components/PublicFeed';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Routes>
            <Route path="/" element={<CategorySelection />} />
            <Route path="/events/:category" element={<PublicFeed />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;