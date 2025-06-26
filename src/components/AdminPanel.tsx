import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Plus, Trash2, Calendar, Image, Video, Tag, Building2, Sun, Moon, Home, Edit3, X } from 'lucide-react';
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
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Home
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

        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8 transition-colors duration-200 border border-gray-200 dark:border-dark-border">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-blue-600 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
                <p className="text-gray-600 dark:text-gray-400">Enter password to access event management</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
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
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border transition-colors duration-200">
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
                <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-medium">
                  <span>Admin Panel</span>
                </span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Create Event
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCreateForm && (
          <EventForm
            onClose={() => setShowCreateForm(false)}
            onEventSaved={(newEvent) => {
              setEvents([newEvent, ...events]);
              setShowCreateForm(false);
            }}
          />
        )}

        {editingEvent && (
          <EventForm
            event={editingEvent}
            onClose={() => setEditingEvent(null)}
            onEventSaved={handleEventUpdated}
          />
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Events</h1>
        </div>

        {/* Events List */}
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
            Upcoming Events
          </h2>

          {events.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">No Events Created</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">Create your first event to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Event</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventManagementCard
                  key={event.id}
                  event={event}
                  onDelete={() => deleteEvent(event.id)}
                  onEdit={() => handleEditEvent(event)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

interface EventFormProps {
  event?: Event;
  onClose: () => void;
  onEventSaved: (event: Event) => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose, onEventSaved }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    media_type: event?.media_type || 'image' as 'image' | 'video',
    media_url: event?.media_url || '',
    link: event?.link || '',
    department: event?.department || '',
    tags: event?.tags?.join(', ').replace(/#/g, '') || '',
    event_category: event?.event_category || 'technical' as 'technical' | 'non-technical',
    event_datetime: event?.event_datetime ? new Date(event.event_datetime).toISOString().slice(0, 16) : ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process tags - split by spaces/commas and clean up
      const processedTags = formData.tags
        .split(/[,\s]+/)
        .map(tag => tag.trim().replace(/^#/, ''))
        .filter(tag => tag.length > 0)
        .map(tag => `#${tag}`);

      const eventData = {
        title: formData.title,
        description: formData.description,
        media_type: formData.media_type,
        media_url: formData.media_url,
        link: formData.link || null,
        department: formData.department,
        tags: processedTags,
        event_category: formData.event_category,
        event_datetime: formData.event_datetime ? new Date(formData.event_datetime).toISOString() : null
      };

      let data, error;

      if (event) {
        // Update existing event
        const result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Create new event
        const result = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;
      onEventSaved(data);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200 border border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Club Name
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Computer Science Club, Robotics Club"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Category
              </label>
              <select
                value={formData.event_category}
                onChange={(e) => setFormData({ ...formData, event_category: e.target.value as 'technical' | 'non-technical' })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="technical">Technical Event</option>
                <option value="non-technical">Non-Technical Event</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.event_datetime}
              onChange={(e) => setFormData({ ...formData, event_datetime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., hackathon coding competition AI (separate with spaces or commas)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter tags separated by spaces or commas. # will be added automatically.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Media Type
            </label>
            <select
              value={formData.media_type}
              onChange={(e) => setFormData({ ...formData, media_type: e.target.value as 'image' | 'video' })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Media Filename
            </label>
            <input
              type="text"
              value={formData.media_url}
              onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
              placeholder="e.g., event-poster.jpg, hackathon-video.mp4"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter just the filename (e.g., poster.jpg). Images will be loaded from GitHub repository.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              External Link (Optional)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com/event-registration"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EventManagementCardProps {
  event: Event;
  onDelete: () => void;
  onEdit: () => void;
}

const EventManagementCard: React.FC<EventManagementCardProps> = ({ event, onDelete, onEdit }) => {
  const [imageError, setImageError] = useState(false);

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
    <article className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-dark-border">
      {/* Media */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
        {event.media_type === 'image' ? (
          <div className="relative h-full">
            <img
              src={getImageSrc()}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white dark:bg-gray-800 text-red-500 rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            event.event_category === 'technical' 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' 
              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
          }`}>
            {event.event_category === 'technical' ? 'Tech' : 'Non-Tech'}
          </span>
          <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded">
            {event.media_type === 'image' ? (
              <Image className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            ) : (
              <Video className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            )}
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>

        {/* Club Name */}
        <div className="flex items-center space-x-2 mb-3">
          <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{event.department}</span>
        </div>

        {/* Event Date */}
        {event.event_datetime && (
          <div className="flex items-center space-x-2 mb-3 text-sm text-blue-600 dark:text-blue-400">
            <Calendar className="h-4 w-4" />
            <span>{formatEventDate(event.event_datetime)}</span>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.slice(0, 2).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {event.tags.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">+{event.tags.length - 2}</span>
            )}
          </div>
        )}

        <time className="text-xs text-gray-500 dark:text-gray-400">
          Created {new Date(event.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </time>
      </div>
    </article>
  );
};

export default AdminPanel;