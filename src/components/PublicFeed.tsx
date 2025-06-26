import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, Sun, Moon, Home, ChevronDown, Clock, ExternalLink, Search } from 'lucide-react';
import { supabase, Event } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

const PublicFeed: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedDepartment, selectedTags, selectedCategory, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
      
      // Extract unique clubs and tags
      const uniqueDepartments = [...new Set((data || []).map(event => event.department))];
      const uniqueTags = [...new Set((data || []).flatMap(event => event.tags || []))];
      setDepartments(uniqueDepartments);
      setAllTags(uniqueTags);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search functionality
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(event => event.department === selectedDepartment);
    }

    if (selectedTags !== 'all') {
      filtered = filtered.filter(event => event.tags?.includes(selectedTags));
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.event_category === selectedCategory);
    }

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cluely-bg dark:cluely-bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cluely-bg dark:cluely-bg-dark transition-all duration-500">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 mx-4 mt-4 glass-card dark:glass-card-dark transition-all duration-300 ${
        navbarVisible ? 'navbar-visible' : 'navbar-hidden'
      }`}>
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
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
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

      <div className="pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">
              All Events
            </h1>
          </div>

          {/* Filters */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass-card dark:glass-card-dark text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 glass-card dark:glass-card-dark text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  <option value="technical">Tech Events</option>
                  <option value="non-technical">Non-Tech Events</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 glass-card dark:glass-card-dark text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                >
                  <option value="all">Club</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedTags}
                  onChange={(e) => setSelectedTags(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 glass-card dark:glass-card-dark text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                >
                  <option value="all">Custom Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Events Feed */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                {events.length === 0 ? 'No Events Yet' : 'No Events Match Your Filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {events.length === 0 
                  ? 'Check back soon for exciting campus events!' 
                  : 'Try adjusting your filters to see more events.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredEvents.map((event, index) => (
                <InstagramEventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface InstagramEventCardProps {
  event: Event;
  index: number;
}

const InstagramEventCard: React.FC<InstagramEventCardProps> = ({ event, index }) => {
  const [imageError, setImageError] = useState(false);

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (diffDays === 1) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (diffDays > 0 && diffDays <= 7) {
      return `${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    // Encode the URL to handle special characters and spaces
    return `/api/image/${encodeURIComponent(event.media_url)}`;
  };

  return (
    <article 
      className="glass-card dark:glass-card-dark animate-slide-up overflow-hidden"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black dark:from-gray-300 dark:to-white rounded-full flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white dark:text-black" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm">
              {event.department}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                event.event_category === 'technical' 
                  ? 'bg-black/10 dark:bg-white/10 text-gray-800 dark:text-gray-200' 
                  : 'bg-black/10 dark:bg-white/10 text-gray-800 dark:text-gray-200'
              }`}>
                {event.event_category === 'technical' ? 'Tech' : 'Non-Tech'}
              </span>
              {event.event_datetime && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{formatEventDate(event.event_datetime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {event.link && (
          <button 
            onClick={() => window.open(event.link, '_blank')}
            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Media */}
      <div className="relative bg-gray-100 dark:bg-gray-800">
        {event.media_type === 'image' ? (
          <div className="relative aspect-square">
            <img
              src={getImageSrc()}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-square">
            <video
              src={`/api/image/${encodeURIComponent(event.media_url)}`}
              controls
              className="w-full h-full object-cover"
              poster="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800"
            >
              Your browser does not support video playback.
            </video>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-lg">
            {event.title}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {event.description}
          </p>
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {event.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-gray-700 dark:text-gray-300 text-sm hover:text-black dark:hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <time className="text-xs text-gray-500 dark:text-gray-400 block pt-2">
            {new Date(event.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      </div>
    </article>
  );
};

export default PublicFeed;