import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const STORAGE_KEYS = {
  volunteers: 'foundation_volunteers',
  appointments: 'foundation_appointments',
  templeContent: 'foundation_temple_content',
  gallery: 'foundation_gallery',
  events: 'foundation_events',
  projects: 'foundation_projects',
  donations: 'foundation_donations',
  elibrary: 'foundation_elibrary',
  importantDates: 'foundation_important_dates',
  analytics: 'foundation_analytics',
};

const loadFromStorage = (key, defaultValue = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const DataProvider = ({ children }) => {
  const [volunteers, setVolunteers] = useState(() => loadFromStorage(STORAGE_KEYS.volunteers));
  const [appointments, setAppointments] = useState(() => loadFromStorage(STORAGE_KEYS.appointments));
  const [templeContent, setTempleContent] = useState(() => loadFromStorage(STORAGE_KEYS.templeContent));
  const [gallery, setGallery] = useState(() => loadFromStorage(STORAGE_KEYS.gallery));
  const [events, setEvents] = useState(() => loadFromStorage(STORAGE_KEYS.events));
  const [projects, setProjects] = useState(() => loadFromStorage(STORAGE_KEYS.projects));
  const [donations, setDonations] = useState(() => loadFromStorage(STORAGE_KEYS.donations));
  const [elibrary, setElibrary] = useState(() => loadFromStorage(STORAGE_KEYS.elibrary));
  const [importantDates, setImportantDates] = useState(() => loadFromStorage(STORAGE_KEYS.importantDates));
  const [analytics, setAnalytics] = useState(() => loadFromStorage(STORAGE_KEYS.analytics, { visitors: 0, pageViews: 0 }));

  useEffect(() => saveToStorage(STORAGE_KEYS.volunteers, volunteers), [volunteers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.appointments, appointments), [appointments]);
  useEffect(() => saveToStorage(STORAGE_KEYS.templeContent, templeContent), [templeContent]);
  useEffect(() => saveToStorage(STORAGE_KEYS.gallery, gallery), [gallery]);
  useEffect(() => saveToStorage(STORAGE_KEYS.events, events), [events]);
  useEffect(() => saveToStorage(STORAGE_KEYS.projects, projects), [projects]);
  useEffect(() => saveToStorage(STORAGE_KEYS.donations, donations), [donations]);
  useEffect(() => saveToStorage(STORAGE_KEYS.elibrary, elibrary), [elibrary]);
  useEffect(() => saveToStorage(STORAGE_KEYS.importantDates, importantDates), [importantDates]);
  useEffect(() => saveToStorage(STORAGE_KEYS.analytics, analytics), [analytics]);

  const addVolunteer = (volunteer) => {
    const newVolunteer = { ...volunteer, id: generateId(), applicationDate: new Date().toISOString() };
    setVolunteers(prev => [...prev, newVolunteer]);
    return newVolunteer;
  };

  const updateVolunteer = (id, updates) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVolunteer = (id) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
  };

  const addAppointment = (appointment) => {
    const newAppointment = { ...appointment, id: generateId(), createdAt: new Date().toISOString() };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id, updates) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const addTempleContent = (content) => {
    const newContent = { ...content, id: generateId(), updatedAt: new Date().toISOString() };
    setTempleContent(prev => [...prev, newContent]);
    return newContent;
  };

  const updateTempleContent = (id, updates) => {
    setTempleContent(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  };

  const deleteTempleContent = (id) => {
    setTempleContent(prev => prev.filter(t => t.id !== id));
  };

  const addGalleryItem = (item) => {
    const newItem = { ...item, id: generateId(), uploadedAt: new Date().toISOString() };
    setGallery(prev => [...prev, newItem]);
    return newItem;
  };

  const deleteGalleryItem = (id) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const addEvent = (event) => {
    const newEvent = { ...event, id: generateId(), createdAt: new Date().toISOString() };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addProject = (project) => {
    const newProject = { ...project, id: generateId(), createdAt: new Date().toISOString() };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addDonation = (donation) => {
    const newDonation = { ...donation, id: generateId(), donationDate: new Date().toISOString() };
    setDonations(prev => [...prev, newDonation]);
    return newDonation;
  };

  const updateDonation = (id, updates) => {
    setDonations(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDonation = (id) => {
    setDonations(prev => prev.filter(d => d.id !== id));
  };

  const addELibraryItem = (item) => {
    const newItem = { ...item, id: generateId(), uploadedAt: new Date().toISOString(), downloadCount: 0 };
    setElibrary(prev => [...prev, newItem]);
    return newItem;
  };

  const updateELibraryItem = (id, updates) => {
    setElibrary(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteELibraryItem = (id) => {
    setElibrary(prev => prev.filter(e => e.id !== id));
  };

  const addImportantDate = (date) => {
    const newDate = { ...date, id: generateId() };
    setImportantDates(prev => [...prev, newDate]);
    return newDate;
  };

  const updateImportantDate = (id, updates) => {
    setImportantDates(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteImportantDate = (id) => {
    setImportantDates(prev => prev.filter(d => d.id !== id));
  };

  const value = {
    volunteers,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    templeContent,
    addTempleContent,
    updateTempleContent,
    deleteTempleContent,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    projects,
    addProject,
    updateProject,
    deleteProject,
    donations,
    addDonation,
    updateDonation,
    deleteDonation,
    elibrary,
    addELibraryItem,
    updateELibraryItem,
    deleteELibraryItem,
    importantDates,
    addImportantDate,
    updateImportantDate,
    deleteImportantDate,
    analytics,
    setAnalytics,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
