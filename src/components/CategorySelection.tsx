import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const CategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleCategorySelect = () => {
    navigate('/events');
  };

  return (
    <div className="min-h-screen cluely-bg dark:cluely-bg-dark transition-all duration-500">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 mx-4 mt-4 glass-card dark:glass-card-dark transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black rounded-2xl">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Vibe-Check</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <span className="flex items-center space-x-1 text-gray-900 dark:text-white font-medium">
                  <span>Home</span>
                </span>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                Log In
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
              Your Campus, Your Stage
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              All events, one place
            </p>
          </div>

          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <button
              onClick={handleCategorySelect}
              className="w-full py-4 px-8 cluely-button font-medium transition-all duration-300 text-lg"
            >
              Explore Events
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategorySelection;