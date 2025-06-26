import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Building2, Tag, Sun, Moon, Home, ChevronDown, Clock, ExternalLink } from 'lucide-react';
import { supabase, Event } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

const PublicFeed: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, [category]);

  useEffect(() => {
    filterEvents();
  }, [events, selectedDepartment, selectedMediaType, selectedTags]);

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
      let query = supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('event_category', category);
      }

      const { data, error } = await query;

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

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(event => event.department === selectedDepartment);
    }

    if (selectedMediaType !== 'all') {
      filtered = filtered.filter(event => event.media_type === selectedMediaType);
    }

    if (selectedTags !== 'all') {
      filtered = filtered.filter(event => event.tags?.includes(selectedTags));
    }

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border transition-all duration-300 ${
        navbarVisible ? 'navbar-visible' : 'navbar-hidden'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Evently</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
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

      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">
              {category === 'technical' ? 'Tech Events' : category === 'non-technical' ? 'Non-Tech Events' : 'Events'}
            </h1>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="relative">
                <select
                  value={selectedMediaType}
                  onChange={(e) => setSelectedMediaType(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <option value="all">Media Type</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
                  className="appearance-none px-4 py-2 pr-8 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                {events.length === 0 ? 'No Events Yet' : 'No Events Match Your Filters'}
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
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
    return `/api/image/${event.media_url}`;
  };

  return (
    <article 
      className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-dark-border animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm">
              {event.department}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                event.event_category === 'technical' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' 
                  : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
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
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
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
              src={`/api/image/${event.media_url}`}
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
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline cursor-pointer"
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