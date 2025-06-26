import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Trash2, Calendar, Video, Sun, Moon, Home, Edit3, X } from 'lucide-react';
import { supabase, Event } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple password authentication
  const ADMIN_PASSWORD = 'admin123'; // In production, use environment variables

  // Utility function to convert GitHub blob URLs to raw URLs
  const convertGitHubUrl = (url: string): string => {
    if (url.includes('github.com') && url.includes('/blob/')) {
      return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    return url;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setEditingEvent(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen cluely-bg dark:cluely-bg-dark transition-all duration-500">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 mx-4 mt-4 glass-card dark:glass-card-dark transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black rounded-2xl">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Vibe-Check</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                >
                  Home
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

        <div className="flex items-center justify-center min-h-screen p-4 pt-20">
          <div className="w-full max-w-md">
            <div className="glass-card dark:glass-card-dark p-8 animate-slide-up">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-black rounded-full mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
                <p className="text-gray-700 dark:text-gray-300">Enter password to access event management</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 glass-card dark:glass-card-dark text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 cluely-button font-medium transition-all duration-300"
                >
                  Access Admin Panel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
                <span className="flex items-center space-x-1 text-gray-900 dark:text-white font-medium">
                  <span>Admin Panel</span>
                </span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 cluely-button font-medium transition-all duration-300"
              >
                Create Event
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Event Management</h1>
          <p className="text-gray-700 dark:text-gray-300">Create, edit, and manage campus events</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Events Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first event to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="cluely-button px-6 py-3 font-medium transition-all duration-300"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <EventManagementCard
                key={event.id}
                event={event}
                index={index}
                onEdit={handleEditEvent}
                onDelete={deleteEvent}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Event Modal */}
      {(showCreateForm || editingEvent) && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowCreateForm(false);
            setEditingEvent(null);
          }}
          onEventCreated={(newEvent) => {
            setEvents([newEvent, ...events]);
            setShowCreateForm(false);
          }}
          onEventUpdated={handleEventUpdated}
          convertGitHubUrl={convertGitHubUrl}
        />
      )}
    </div>
  );
};

interface EventManagementCardProps {
  event: Event;
  index: number;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventManagementCard: React.FC<EventManagementCardProps> = ({ event, index, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    return `/api/image/${encodeURIComponent(event.media_url)}`;
  };

  return (
    <div 
      className="glass-card dark:glass-card-dark overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Media Preview */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
        {event.media_type === 'image' ? (
          <img
            src={getImageSrc()}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.event_category === 'technical' 
              ? 'bg-black/20 dark:bg-white/20 text-gray-800 dark:text-gray-200' 
              : 'bg-black/20 dark:bg-white/20 text-gray-800 dark:text-gray-200'
          }`}>
            {event.event_category === 'technical' ? 'Tech' : 'Non-Tech'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{event.department}</p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t border-white/20 dark:border-white/10">
          <button
            onClick={() => onEdit(event)}
            className="flex-1 py-2 px-3 bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-xl font-medium text-sm flex items-center justify-center space-x-1"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="flex-1 py-2 px-3 bg-red-500/20 text-red-700 dark:text-red-300 hover:bg-red-500/30 transition-all duration-300 rounded-xl font-medium text-sm flex items-center justify-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Created: {new Date(event.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
  onEventCreated: (event: Event) => void;
  onEventUpdated: (event: Event) => void;
  convertGitHubUrl: (url: string) => string;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose, onEventCreated, onEventUpdated, convertGitHubUrl }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    department: event?.department || '',
    event_category: event?.event_category || 'technical',
    media_url: event?.media_url || '',
    media_type: event?.media_type || 'image',
    tags: event?.tags?.join(', ') || '',
    link: event?.link || '',
    event_datetime: event?.event_datetime || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        media_url: convertGitHubUrl(formData.media_url),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        event_datetime: formData.event_datetime || null
      };

      if (event) {
        // Update existing event
        const { data, error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id)
          .select()
          .single();

        if (error) throw error;
        onEventUpdated(data);
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single();

        if (error) throw error;
        onEventCreated(data);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card dark:glass-card-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300 resize-none"
                placeholder="Describe the event"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department/Club
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                  placeholder="e.g., Computer Science Club"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.event_category}
                  onChange={(e) => setFormData({ ...formData, event_category: e.target.value as 'technical' | 'non-technical' })}
                  className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                >
                  <option value="technical">Technical</option>
                  <option value="non-technical">Non-Technical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Media URL
              </label>
              <input
                type="url"
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Media Type
              </label>
              <select
                value={formData.media_type}
                onChange={(e) => setFormData({ ...formData, media_type: e.target.value as 'image' | 'video' })}
                className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                placeholder="hackathon, coding, workshop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Link (optional)
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
                placeholder="https://example.com/register"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Date & Time (optional)
              </label>
              <input
                type="datetime-local"
                value={formData.event_datetime}
                onChange={(e) => setFormData({ ...formData, event_datetime: e.target.value })}
                className="w-full px-4 py-3 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
              />
            </div>

            <div className="flex space-x-3 pt-6 border-t border-white/20 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 glass-card dark:glass-card-dark text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 cluely-button font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;