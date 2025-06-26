import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const CategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleCategorySelect = (category: 'technical' | 'non-technical') => {
    navigate(`/events/${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Evently</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Log In
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              What kind of events are you interested in?
            </h1>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleCategorySelect('technical')}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Tech Events
            </button>
            
            <button
              onClick={() => handleCategorySelect('non-technical')}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Non-Tech Events
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategorySelection;