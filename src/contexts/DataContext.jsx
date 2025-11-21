import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import { volunteerService } from '../services/volunteerService';
import { projectService } from '../services/projectService';
import { elibraryService } from '../services/elibraryService';
import { invitationService } from '../services/invitationService';
import { eventCategoryService } from '../services/eventCategoryService';
import { donationService } from '../services/donationService';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

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
  invitations: 'foundation_invitations',
  eventCategories: 'foundation_event_categories',
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
  const [invitations, setInvitations] = useState(() => loadFromStorage(STORAGE_KEYS.invitations));
  const [eventCategories, setEventCategories] = useState(() => loadFromStorage(STORAGE_KEYS.eventCategories));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.appointments, appointments);
  }, [appointments]);

  useEffect(() => saveToStorage(STORAGE_KEYS.volunteers, volunteers), [volunteers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.templeContent, templeContent), [templeContent]);
  useEffect(() => saveToStorage(STORAGE_KEYS.gallery, gallery), [gallery]);
  useEffect(() => saveToStorage(STORAGE_KEYS.events, events), [events]);
  useEffect(() => saveToStorage(STORAGE_KEYS.projects, projects), [projects]);
  useEffect(() => saveToStorage(STORAGE_KEYS.donations, donations), [donations]);
  useEffect(() => saveToStorage(STORAGE_KEYS.elibrary, elibrary), [elibrary]);
  useEffect(() => saveToStorage(STORAGE_KEYS.importantDates, importantDates), [importantDates]);
  useEffect(() => saveToStorage(STORAGE_KEYS.analytics, analytics), [analytics]);
  useEffect(() => saveToStorage(STORAGE_KEYS.invitations, invitations), [invitations]);
  useEffect(() => saveToStorage(STORAGE_KEYS.eventCategories, eventCategories), [eventCategories]);

  // ==================== DONATION FUNCTIONS ====================
  const loadDonationsFromAPI = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading donations from API...', filters);
      const response = await donationService.getAllDonations(filters);
      console.log('Donations loaded successfully:', response);
      
      let donationsData = [];
      if (response.data && Array.isArray(response.data)) {
        donationsData = response.data;
      } else if (response.success && Array.isArray(response.data)) {
        donationsData = response.data;
      } else if (Array.isArray(response)) {
        donationsData = response;
      }
      
      const transformedDonations = donationsData.map(donation => 
        donationService.transformDonationFromBackend(donation)
      );
      
      setDonations(transformedDonations);
      return transformedDonations;
    } catch (err) {
      console.error('Failed to load donations from API:', err);
      setError(`Failed to load donations: ${err.message}`);
      const localDonations = loadFromStorage(STORAGE_KEYS.donations);
      console.log('Using local storage donations:', localDonations);
      setDonations(localDonations);
      return localDonations;
    } finally {
      setLoading(false);
    }
  }, []);

  const addDonation = useCallback(async (donationData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating donation:', donationData);
      
      const response = await donationService.createDonation(donationData);
      console.log('Donation created successfully:', response);
      
      let newDonation;
      if (response.data && response.data.data) {
        newDonation = donationService.transformDonationFromBackend(response.data.data);
      } else if (response.data) {
        newDonation = donationService.transformDonationFromBackend(response.data);
      } else if (response.success && response.data) {
        newDonation = donationService.transformDonationFromBackend(response.data);
      } else {
        // Fallback: create local donation
        newDonation = {
          ...donationService.transformDonationToBackend(donationData),
          id: Date.now().toString(),
          donationDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      setDonations(prev => [...prev, newDonation]);
      return newDonation;
    } catch (err) {
      console.error('Failed to create donation:', err);
      const errorMsg = `Failed to create donation: ${err.message}`;
      setError(errorMsg);
      
      // Fallback to local storage
      const localDonation = {
        ...donationData,
        id: Date.now().toString(),
        donationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDonations(prev => [...prev, localDonation]);
      return localDonation;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDonation = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating donation:', id, updates);
      
      await donationService.updateDonation(id, updates);
      console.log('Donation updated successfully');
      
      setDonations(prev => prev.map(donation => 
        donation.id === id ? { 
          ...donation, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } : donation
      ));
    } catch (err) {
      console.error('Failed to update donation:', err);
      const errorMsg = `Failed to update donation: ${err.message}`;
      setError(errorMsg);
      
      // Fallback to local storage update
      setDonations(prev => prev.map(donation => 
        donation.id === id ? { 
          ...donation, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } : donation
      ));
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDonation = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting donation:', id);
      
      await donationService.deleteDonation(id);
      console.log('Donation deleted successfully');
      
      setDonations(prev => prev.filter(donation => donation.id !== id));
    } catch (err) {
      console.error('Failed to delete donation:', err);
      const errorMsg = `Failed to delete donation: ${err.message}`;
      setError(errorMsg);
      
      // Fallback to local storage deletion
      setDonations(prev => prev.filter(donation => donation.id !== id));
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Payment-related functions
  const createRazorpayOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating Razorpay order:', orderData);
      
      const response = await donationService.createRazorpayOrder(orderData);
      console.log('Razorpay order created successfully:', response);
      return response;
    } catch (err) {
      console.error('Failed to create Razorpay order:', err);
      const errorMsg = `Failed to create payment order: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyPayment = useCallback(async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Verifying payment:', paymentData);
      
      const response = await donationService.verifyPayment(paymentData);
      console.log('Payment verified successfully:', response);
      return response;
    } catch (err) {
      console.error('Failed to verify payment:', err);
      const errorMsg = `Failed to verify payment: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateQRCode = useCallback(async (qrData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Generating QR code:', qrData);
      
      const response = await donationService.generateQRCode(qrData);
      console.log('QR code generated successfully:', response);
      return response;
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      const errorMsg = `Failed to generate QR code: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const markUPIPaymentCompleted = useCallback(async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Marking UPI payment as completed:', paymentData);
      
      const response = await donationService.markUPIPaymentCompleted(paymentData);
      console.log('UPI payment marked as completed:', response);
      return response;
    } catch (err) {
      console.error('Failed to mark UPI payment as completed:', err);
      const errorMsg = `Failed to update UPI payment: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching payment summary');
      
      const response = await donationService.getPaymentSummary();
      console.log('Payment summary fetched successfully:', response);
      return response;
    } catch (err) {
      console.error('Failed to fetch payment summary:', err);
      const errorMsg = `Failed to fetch payment summary: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== INVITATION FUNCTIONS ====================
  const loadInvitationsFromAPI = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading invitations from API...', filters);
      const response = await invitationService.getAllInvitations(filters);
      console.log('Invitations loaded successfully:', response);
      
      let invitationsData = [];
      if (response.data && response.data.invitations) {
        invitationsData = response.data.invitations;
      } else if (Array.isArray(response)) {
        invitationsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        invitationsData = response.data;
      }
      
      const transformedInvitations = invitationsData.map(invitation => 
        transformInvitationDataFromBackend(invitation)
      );
      
      setInvitations(transformedInvitations);
      return transformedInvitations;
    } catch (err) {
      console.error('Failed to load invitations from API:', err);
      setError(`Failed to load invitations: ${err.message}`);
      const localInvitations = loadFromStorage(STORAGE_KEYS.invitations);
      console.log('Using local storage invitations:', localInvitations);
      setInvitations(localInvitations);
      return localInvitations;
    } finally {
      setLoading(false);
    }
  }, []);

  const addInvitation = useCallback(async (invitationData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating invitation:', invitationData);
      
      const transformedData = transformInvitationDataToBackend(invitationData);
      
      const response = await invitationService.createInvitation(transformedData);
      console.log('Invitation created successfully:', response);
      
      let newInvitation;
      if (response.data && response.data.invitation) {
        newInvitation = transformInvitationDataFromBackend(response.data.invitation);
      } else {
        newInvitation = {
          ...transformedData,
          id: response.id || Date.now().toString(),
          createdAt: new Date().toISOString()
        };
      }
      
      setInvitations(prev => [...prev, newInvitation]);
      return newInvitation;
    } catch (err) {
      console.error('Failed to create invitation:', err);
      const errorMsg = `Failed to create invitation: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInvitation = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating invitation:', id, updates);
      
      const transformedData = transformInvitationDataToBackend(updates);
      
      await invitationService.updateInvitation(id, transformedData);
      console.log('Invitation updated successfully');
      
      setInvitations(prev => prev.map(invitation => 
        invitation.id === id ? { ...invitation, ...updates, updatedAt: new Date().toISOString() } : invitation
      ));
    } catch (err) {
      console.error('Failed to update invitation:', err);
      const errorMsg = `Failed to update invitation: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInvitation = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting invitation:', id);
      
      await invitationService.deleteInvitation(id);
      console.log('Invitation deleted successfully');
      
      setInvitations(prev => prev.filter(invitation => invitation.id !== id));
    } catch (err) {
      console.error('Failed to delete invitation:', err);
      const errorMsg = `Failed to delete invitation: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== EVENT CATEGORY FUNCTIONS ====================
  const loadEventCategoriesFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading event categories from API...');
      const response = await eventCategoryService.getAllCategories();
      console.log('Event categories loaded successfully:', response);
      
      let categoriesData = [];
      if (response.data && response.data.categories) {
        categoriesData = response.data.categories;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      }
      
      const transformedCategories = categoriesData.map(category => 
        transformCategoryDataFromBackend(category)
      );
      
      setEventCategories(transformedCategories);
      return transformedCategories;
    } catch (err) {
      console.error('Failed to load event categories from API:', err);
      setError(`Failed to load event categories: ${err.message}`);
      const localCategories = loadFromStorage(STORAGE_KEYS.eventCategories);
      console.log('Using local storage event categories:', localCategories);
      setEventCategories(localCategories);
      return localCategories;
    } finally {
      setLoading(false);
    }
  }, []);

  const addEventCategory = useCallback(async (categoryData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating event category:', categoryData);
      
      const transformedData = transformCategoryDataToBackend(categoryData);
      
      const response = await eventCategoryService.createCategory(transformedData);
      console.log('Event category created successfully:', response);
      
      let newCategory;
      if (response.data && response.data.category) {
        newCategory = transformCategoryDataFromBackend(response.data.category);
      } else {
        newCategory = {
          ...transformedData,
          id: response.id || Date.now().toString(),
          createdAt: new Date().toISOString()
        };
      }
      
      setEventCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Failed to create event category:', err);
      const errorMsg = `Failed to create event category: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEventCategory = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating event category:', id, updates);
      
      const transformedData = transformCategoryDataToBackend(updates);
      
      await eventCategoryService.updateCategory(id, transformedData);
      console.log('Event category updated successfully');
      
      setEventCategories(prev => prev.map(category => 
        category.id === id ? { ...category, ...updates, updatedAt: new Date().toISOString() } : category
      ));
    } catch (err) {
      console.error('Failed to update event category:', err);
      const errorMsg = `Failed to update event category: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEventCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting event category:', id);
      
      await eventCategoryService.deleteCategory(id);
      console.log('Event category deleted successfully');
      
      setEventCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      console.error('Failed to delete event category:', err);
      const errorMsg = `Failed to delete event category: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== APPOINTMENT FUNCTIONS ====================
  const loadAppointmentsFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading appointments from API...');
      const response = await appointmentService.getAllAppointments();
      console.log('Appointments loaded successfully:', response);
      setAppointments(response);
      return response;
    } catch (err) {
      console.error('Failed to load appointments from API:', err);
      setError(`Failed to load appointments: ${err.message}`);
      const localAppointments = loadFromStorage(STORAGE_KEYS.appointments);
      console.log('Using local storage appointments:', localAppointments);
      setAppointments(localAppointments);
      return localAppointments;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAppointment = useCallback(async (appointmentData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating appointment:', appointmentData);
      
      const response = await appointmentService.createAppointment(appointmentData);
      console.log('Appointment created successfully:', response);
      
      const newAppointment = { 
        ...appointmentData, 
        id: response.consultation?.id || Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      console.error('Failed to create appointment:', err);
      const errorMsg = `Failed to create appointment: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating appointment:', id, updates);
      
      await appointmentService.updateAppointment(id, updates);
      console.log('Appointment updated successfully');
      
      setAppointments(prev => prev.map(a => 
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ));
    } catch (err) {
      console.error('Failed to update appointment:', err);
      const errorMsg = `Failed to update appointment: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAppointment = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting appointment:', id);
      
      await appointmentService.deleteAppointment(id);
      console.log('Appointment deleted successfully');
      
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      const errorMsg = `Failed to delete appointment: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating appointment status:', id, status);
      
      await appointmentService.updateAppointment(id, { status });
      console.log('Appointment status updated successfully');
      
      setAppointments(prev => prev.map(a => 
        a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
      ));
    } catch (err) {
      console.error('Failed to update appointment status:', err);
      const errorMsg = `Failed to update appointment status: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== VOLUNTEER FUNCTIONS ====================
  const loadVolunteersFromAPI = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading volunteers from API...', filters);
      const response = await volunteerService.getAllVolunteers(filters);
      console.log('Volunteers loaded successfully:', response);
      
      let volunteersData = [];
      if (response.data && response.data.volunteers) {
        volunteersData = response.data.volunteers;
      } else if (Array.isArray(response)) {
        volunteersData = response;
      } else if (response.data && Array.isArray(response.data)) {
        volunteersData = response.data;
      }
      
      const transformedVolunteers = volunteersData.map(volunteer => 
        transformVolunteerDataFromBackend(volunteer)
      );
      
      setVolunteers(transformedVolunteers);
      return transformedVolunteers;
    } catch (err) {
      console.error('Failed to load volunteers from API:', err);
      setError(`Failed to load volunteers: ${err.message}`);
      const localVolunteers = loadFromStorage(STORAGE_KEYS.volunteers);
      console.log('Using local storage volunteers:', localVolunteers);
      setVolunteers(localVolunteers);
      return localVolunteers;
    } finally {
      setLoading(false);
    }
  }, []);

  const addVolunteer = useCallback(async (volunteerData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating volunteer:', volunteerData);
      
      const transformedData = transformVolunteerDataToBackend(volunteerData);
      
      const response = await volunteerService.createVolunteer(transformedData);
      console.log('Volunteer created successfully:', response);
      
      let newVolunteer;
      if (response.data && response.data.volunteer) {
        newVolunteer = transformVolunteerDataFromBackend(response.data.volunteer);
      } else {
        newVolunteer = {
          ...transformedData,
          id: response.id || Date.now().toString(),
          volunteerId: response.volunteerId || `VOL-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
      }
      
      setVolunteers(prev => [...prev, newVolunteer]);
      return newVolunteer;
    } catch (err) {
      console.error('Failed to create volunteer:', err);
      const errorMsg = `Failed to create volunteer: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVolunteer = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating volunteer:', id, updates);
      
      const transformedData = transformVolunteerDataToBackend(updates);
      
      await volunteerService.updateVolunteer(id, transformedData);
      console.log('Volunteer updated successfully');
      
      setVolunteers(prev => prev.map(v => 
        v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
      ));
    } catch (err) {
      console.error('Failed to update volunteer:', err);
      const errorMsg = `Failed to update volunteer: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVolunteer = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting volunteer:', id);
      
      await volunteerService.deleteVolunteer(id);
      console.log('Volunteer deleted successfully');
      
      setVolunteers(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error('Failed to delete volunteer:', err);
      const errorMsg = `Failed to delete volunteer: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVolunteerStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating volunteer status:', id, status);
      
      await volunteerService.updateVolunteerStatus(id, status);
      console.log('Volunteer status updated successfully');
      
      setVolunteers(prev => prev.map(v => 
        v.id === id ? { ...v, status, updatedAt: new Date().toISOString() } : v
      ));
    } catch (err) {
      console.error('Failed to update volunteer status:', err);
      const errorMsg = `Failed to update volunteer status: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== PROJECT FUNCTIONS ====================
  const loadProjectsFromAPI = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading projects from API...', filters);
      const response = await projectService.getAllProjects(filters);
      console.log('Projects loaded successfully:', response);
      
      let projectsData = [];
      if (response.data && response.data.projects) {
        projectsData = response.data.projects;
      } else if (Array.isArray(response)) {
        projectsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        projectsData = response.data;
      }
      
      const transformedProjects = projectsData.map(project => 
        transformProjectDataFromBackend(project)
      );
      
      setProjects(transformedProjects);
      return transformedProjects;
    } catch (err) {
      console.error('Failed to load projects from API:', err);
      setError(`Failed to load projects: ${err.message}`);
      const localProjects = loadFromStorage(STORAGE_KEYS.projects);
      console.log('Using local storage projects:', localProjects);
      setProjects(localProjects);
      return localProjects;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating project:', projectData);
      
      const transformedData = transformProjectDataToBackend(projectData);
      
      const response = await projectService.createProject(transformedData);
      console.log('Project created successfully:', response);
      
      let newProject;
      if (response.data && response.data.project) {
        newProject = transformProjectDataFromBackend(response.data.project);
      } else {
        newProject = {
          ...transformedData,
          id: response.id || Date.now().toString(),
          createdAt: new Date().toISOString()
        };
      }
      
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      console.error('Failed to create project:', err);
      const errorMsg = `Failed to create project: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating project:', id, updates);
      
      const transformedData = transformProjectDataToBackend(updates);
      
      await projectService.updateProject(id, transformedData);
      console.log('Project updated successfully');
      
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ));
    } catch (err) {
      console.error('Failed to update project:', err);
      const errorMsg = `Failed to update project: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting project:', id);
      
      await projectService.deleteProject(id);
      console.log('Project deleted successfully');
      
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
      const errorMsg = `Failed to delete project: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== E-LIBRARY FUNCTIONS ====================
  const loadELibraryFromAPI = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading E-Library from API...', filters);
      const response = await elibraryService.getAllBooks(filters);
      console.log('E-Library loaded successfully:', response);
      
      let booksData = [];
      if (response.data && response.data.books) {
        booksData = response.data.books;
      } else if (Array.isArray(response)) {
        booksData = response;
      } else if (response.data && Array.isArray(response.data)) {
        booksData = response.data;
      }
      
      const transformedBooks = booksData.map(book => 
        transformBookDataFromBackend(book)
      );
      
      setElibrary(transformedBooks);
      return transformedBooks;
    } catch (err) {
      console.error('Failed to load E-Library from API:', err);
      setError(`Failed to load E-Library: ${err.message}`);
      const localELibrary = loadFromStorage(STORAGE_KEYS.elibrary);
      console.log('Using local storage E-Library:', localELibrary);
      setElibrary(localELibrary);
      return localELibrary;
    } finally {
      setLoading(false);
    }
  }, []);

  const addELibraryItem = useCallback(async (bookData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating book:', bookData);
      
      const transformedData = transformBookDataToBackend(bookData);
      
      const response = await elibraryService.createBook(transformedData);
      console.log('Book created successfully:', response);
      
      let newBook;
      if (response.data && response.data.book) {
        newBook = transformBookDataFromBackend(response.data.book);
      } else {
        newBook = {
          ...transformedData,
          id: response.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          downloadCount: 0
        };
      }
      
      setElibrary(prev => [...prev, newBook]);
      return newBook;
    } catch (err) {
      console.error('Failed to create book:', err);
      const errorMsg = `Failed to create book: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateELibraryItem = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating book:', id, updates);
      
      const transformedData = transformBookDataToBackend(updates);
      
      await elibraryService.updateBook(id, transformedData);
      console.log('Book updated successfully');
      
      setElibrary(prev => prev.map(book => 
        book.id === id ? { ...book, ...updates, updatedAt: new Date().toISOString() } : book
      ));
    } catch (err) {
      console.error('Failed to update book:', err);
      const errorMsg = `Failed to update book: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteELibraryItem = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting book:', id);
      
      await elibraryService.deleteBook(id);
      console.log('Book deleted successfully');
      
      setElibrary(prev => prev.filter(book => book.id !== id));
    } catch (err) {
      console.error('Failed to delete book:', err);
      const errorMsg = `Failed to delete book: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadBook = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Downloading book:', id);
      
      const response = await elibraryService.downloadBook(id);
      console.log('Book download initiated:', response);
      
      // Update download count in local state
      setElibrary(prev => prev.map(book => 
        book.id === id ? { ...book, downloadCount: (book.downloadCount || 0) + 1 } : book
      ));
      
      return response;
    } catch (err) {
      console.error('Failed to download book:', err);
      const errorMsg = `Failed to download book: ${err.message}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== TRANSFORMATION FUNCTIONS ====================
  const transformInvitationDataToBackend = (frontendData) => {
    const statusMap = {
      'upcoming': 'planning',
      'ongoing': 'active',
      'completed': 'completed',
      'cancelled': 'suspended'
    };

    return {
      title: frontendData.title,
      description: frontendData.description,
      eventDate: frontendData.eventDate && frontendData.eventTime 
        ? `${frontendData.eventDate}T${frontendData.eventTime}` 
        : frontendData.eventDate,
      venue: frontendData.location || '',
      organizer: frontendData.organizer || '',
      contactInfo: frontendData.contactInfo || {},
      images: frontendData.images || (frontendData.imageUrl ? [frontendData.imageUrl] : []),
      category: frontendData.category || '',
      categoryId: frontendData.categoryId || '',
      registrationRequired: frontendData.registrationRequired || false,
      maxParticipants: frontendData.maxAttendees ? parseInt(frontendData.maxAttendees) : null,
      status: statusMap[frontendData.status] || 'planning',
      isActive: frontendData.status !== 'cancelled'
    };
  };

  const transformInvitationDataFromBackend = (backendData) => {
    const statusMap = {
      'planning': 'upcoming',
      'active': 'ongoing',
      'completed': 'completed',
      'suspended': 'cancelled'
    };

    const eventDate = new Date(backendData.eventDate);
    const dateString = eventDate.toISOString().split('T')[0];
    const timeString = eventDate.toTimeString().split(' ')[0].substring(0, 5);

    return {
      id: backendData.id,
      invitationId: backendData.invitationId,
      title: backendData.title,
      description: backendData.description,
      eventDate: dateString,
      eventTime: timeString,
      location: backendData.venue,
      organizer: backendData.organizer,
      contactInfo: backendData.contactInfo || {},
      images: backendData.images || [],
      imageUrl: backendData.images && backendData.images.length > 0 ? backendData.images[0] : '',
      category: backendData.category,
      categoryId: backendData.categoryId,
      registrationRequired: backendData.registrationRequired || false,
      maxAttendees: backendData.maxParticipants,
      status: statusMap[backendData.status] || 'upcoming',
      isActive: backendData.isActive !== false,
      invitesSent: backendData.invitesSent || false,
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  };

  const transformCategoryDataToBackend = (frontendData) => {
    return {
      name: frontendData.name,
      description: frontendData.description,
      isActive: frontendData.isActive !== false
    };
  };

  const transformCategoryDataFromBackend = (backendData) => {
    return {
      id: backendData.id,
      name: backendData.name,
      description: backendData.description,
      isActive: backendData.isActive !== false,
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  };

  // Helper functions to transform book data between frontend and backend formats
  const transformBookDataToBackend = (frontendData) => {
    // Map frontend category names to backend enum values
    const categoryMap = {
      'Books': 'others',
      'Puranas': 'puranas',
      'Vedic Texts': 'vedic_texts',
      'Spiritual Books': 'spiritual_books',
      'Social Welfare': 'social_welfare',
      'Economics': 'economics',
      'Philosophy': 'philosophy',
      'Others': 'others'
    };

    // Map frontend file types to backend formats
    const formatMap = {
      'PDF': 'pdf',
      'DOC': 'pdf', // Map DOC to PDF for backend
      'DOCX': 'pdf', // Map DOCX to PDF for backend
      'EPUB': 'epub',
      'AUDIO': 'audio',
      'VIDEO': 'video'
    };

    return {
      title: frontendData.title,
      author: frontendData.author || null,
      description: frontendData.description || null,
      category: categoryMap[frontendData.category] || 'others',
      language: frontendData.language || 'English',
      format: formatMap[frontendData.fileType] || 'pdf',
      filePath: frontendData.fileUrl || frontendData.filePath || '',
      fileSize: frontendData.fileSize ? parseInt(frontendData.fileSize) : null,
      thumbnailPath: frontendData.thumbnailPath || null,
      isbn: frontendData.isbn || null,
      publicationYear: frontendData.publicationYear ? parseInt(frontendData.publicationYear) : null,
      publisher: frontendData.publisher || null,
      tags: frontendData.tags || [],
      downloadCount: frontendData.downloadCount || 0,
      isActive: frontendData.isActive !== false,
      sortOrder: frontendData.sortOrder || 0
    };
  };

  const transformBookDataFromBackend = (backendData) => {
    // Map backend category enum values to frontend category names
    const categoryMap = {
      'puranas': 'Puranas',
      'vedic_texts': 'Vedic Texts',
      'spiritual_books': 'Spiritual Books',
      'social_welfare': 'Social Welfare',
      'economics': 'Economics',
      'philosophy': 'Philosophy',
      'others': 'Books'
    };

    // Map backend formats to frontend file types
    const fileTypeMap = {
      'pdf': 'PDF',
      'epub': 'EPUB',
      'audio': 'AUDIO',
      'video': 'VIDEO'
    };

    return {
      id: backendData.id,
      title: backendData.title,
      author: backendData.author,
      description: backendData.description,
      category: categoryMap[backendData.category] || 'Books',
      language: backendData.language,
      fileType: fileTypeMap[backendData.format] || 'PDF',
      fileUrl: backendData.filePath,
      filePath: backendData.filePath,
      fileSize: backendData.fileSize ? formatFileSize(backendData.fileSize) : null,
      thumbnailPath: backendData.thumbnailPath,
      isbn: backendData.isbn,
      publicationYear: backendData.publicationYear,
      publisher: backendData.publisher,
      tags: backendData.tags || [],
      downloadCount: backendData.downloadCount || 0,
      isActive: backendData.isActive !== false,
      sortOrder: backendData.sortOrder || 0,
      accessType: 'public', // Default for frontend
      pages: backendData.pages || null,
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper functions to transform project data between frontend and backend formats
  const transformProjectDataToBackend = (frontendData) => {
    const categoryMap = {
      'Medical': 'medical_assistance',
      'Education': 'educational_resources',
      'Social Welfare': 'help_people',
      'Infrastructure': 'others',
      'Cultural': 'vedic_sanskrit_education',
      'Environmental': 'others',
      'Other': 'others'
    };

    const statusMap = {
      'planning': 'planning',
      'active': 'active',
      'on-hold': 'suspended',
      'completed': 'completed'
    };

    return {
      name: frontendData.title,
      description: frontendData.description,
      category: categoryMap[frontendData.category] || 'others',
      objective: frontendData.objective || frontendData.description,
      targetBeneficiaries: frontendData.targetBeneficiaries || '',
      startDate: frontendData.startDate || null,
      endDate: frontendData.endDate || null,
      budget: frontendData.budget || null,
      currentFunding: frontendData.currentFunding || 0,
      images: frontendData.images || [],
      contactPerson: frontendData.contactPerson || '',
      contactInfo: frontendData.contactInfo || {},
      status: statusMap[frontendData.status] || 'planning',
      isActive: frontendData.status !== 'completed',
      sortOrder: frontendData.sortOrder || 0
    };
  };

  const transformProjectDataFromBackend = (backendData) => {
    const categoryMap = {
      'blood_bank': 'Medical',
      'educational_resources': 'Education',
      'food_distribution': 'Social Welfare',
      'vedic_sanskrit_education': 'Cultural',
      'goshala': 'Environmental',
      'help_people': 'Social Welfare',
      'medical_assistance': 'Medical',
      'yoga_classes': 'Cultural',
      'book_bank': 'Education',
      'others': 'Other'
    };

    const statusMap = {
      'planning': 'planning',
      'active': 'active',
      'suspended': 'on-hold',
      'completed': 'completed'
    };

    return {
      id: backendData.id,
      title: backendData.name,
      description: backendData.description,
      category: categoryMap[backendData.category] || 'Other',
      objective: backendData.objective,
      targetBeneficiaries: backendData.targetBeneficiaries,
      startDate: backendData.startDate,
      endDate: backendData.endDate,
      budget: backendData.budget,
      currentFunding: backendData.currentFunding,
      images: backendData.images || [],
      contactPerson: backendData.contactPerson,
      contactInfo: backendData.contactInfo,
      status: statusMap[backendData.status] || 'planning',
      isActive: backendData.isActive,
      sortOrder: backendData.sortOrder,
      currentProgress: backendData.currentProgress || 0,
      volunteersRequired: backendData.volunteersRequired || '',
      donationLink: backendData.donationLink || '',
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  };

  // Helper functions for volunteers
  const transformVolunteerDataToBackend = (frontendData) => {
    const areasOfInterest = [];
    if (frontendData.templeService) areasOfInterest.push('temple_service');
    if (frontendData.socialService) areasOfInterest.push('social_service');
    if (frontendData.educationalSupport) areasOfInterest.push('educational_support');
    if (frontendData.events) areasOfInterest.push('events');
    if (frontendData.medicalCamps) areasOfInterest.push('medical_camps');
    if (frontendData.othersInterest) areasOfInterest.push('others');

    let availability = null;
    if (frontendData.weekdays) availability = 'weekdays';
    else if (frontendData.weekends) availability = 'weekends';
    else if (frontendData.flexible) availability = 'flexible';
    else if (frontendData.specificTime) availability = 'specific_time';

    return {
      name: frontendData.fullName,
      email: frontendData.email,
      qualification: frontendData.qualification,
      occupation: frontendData.occupation,
      gender: frontendData.gender,
      bloodGroup: frontendData.bloodGroup,
      isBloodDonor: frontendData.bloodDonor === 'yes',
      dateOfBirth: frontendData.dateOfBirth,
      address: frontendData.address,
      phoneNumber: frontendData.phoneNumber,
      maritalStatus: frontendData.maritalStatus?.toLowerCase(),
      areasOfInterest: areasOfInterest.length > 0 ? areasOfInterest : null,
      availability: availability,
      feedback_suggestions: frontendData.feedback,
      status: frontendData.status || 'pending'
    };
  };

  const transformVolunteerDataFromBackend = (backendData) => {
    const areasOfInterest = backendData.areasOfInterest || [];
    return {
      id: backendData.id,
      volunteerId: backendData.volunteerId,
      fullName: backendData.name,
      email: backendData.email,
      qualification: backendData.qualification,
      occupation: backendData.occupation,
      gender: backendData.gender,
      bloodGroup: backendData.bloodGroup,
      bloodDonor: backendData.isBloodDonor ? 'yes' : 'no',
      dateOfBirth: backendData.dateOfBirth,
      address: backendData.address,
      phoneNumber: backendData.phoneNumber,
      maritalStatus: backendData.maritalStatus,
      templeService: areasOfInterest.includes('temple_service'),
      socialService: areasOfInterest.includes('social_service'),
      educationalSupport: areasOfInterest.includes('educational_support'),
      events: areasOfInterest.includes('events'),
      medicalCamps: areasOfInterest.includes('medical_camps'),
      othersInterest: areasOfInterest.includes('others'),
      weekdays: backendData.availability === 'weekdays',
      weekends: backendData.availability === 'weekends',
      flexible: backendData.availability === 'flexible',
      specificTime: backendData.availability === 'specific_time',
      feedback: backendData.feedback_suggestions,
      status: backendData.status,
      adminNotes: backendData.adminNotes,
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  };

  // ==================== OTHER FUNCTIONS ====================
  const addTempleContent = useCallback((content) => {
    const newContent = { ...content, id: generateId(), updatedAt: new Date().toISOString() };
    setTempleContent(prev => [...prev, newContent]);
    return newContent;
  }, []);

  const updateTempleContent = useCallback((id, updates) => {
    setTempleContent(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTempleContent = useCallback((id) => {
    setTempleContent(prev => prev.filter(t => t.id !== id));
  }, []);

  const addGalleryItem = useCallback((item) => {
    const newItem = { ...item, id: generateId(), uploadedAt: new Date().toISOString() };
    setGallery(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const deleteGalleryItem = useCallback((id) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  }, []);

  const addEvent = useCallback((event) => {
    const newEvent = { ...event, id: generateId(), createdAt: new Date().toISOString() };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const addImportantDate = useCallback((date) => {
    const newDate = { ...date, id: generateId() };
    setImportantDates(prev => [...prev, newDate]);
    return newDate;
  }, []);

  const updateImportantDate = useCallback((id, updates) => {
    setImportantDates(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const deleteImportantDate = useCallback((id) => {
    setImportantDates(prev => prev.filter(d => d.id !== id));
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Load data from API on component mount
  useEffect(() => {
    console.log('DataProvider mounted, loading initial data...');
    const loadInitialData = async () => {
      try {
        await Promise.all([
          loadAppointmentsFromAPI(),
          loadVolunteersFromAPI(),
          loadProjectsFromAPI(),
          loadELibraryFromAPI(),
          loadInvitationsFromAPI(),
          loadEventCategoriesFromAPI(),
          loadDonationsFromAPI() // Add donations to initial load
        ]);
        console.log('All initial data loaded successfully');
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, [
    loadAppointmentsFromAPI, 
    loadVolunteersFromAPI, 
    loadProjectsFromAPI, 
    loadELibraryFromAPI, 
    loadInvitationsFromAPI, 
    loadEventCategoriesFromAPI,
    loadDonationsFromAPI // Add this dependency
  ]);

  const value = {
    // ==================== DONATION INTEGRATION ====================
    // Donations with API integration
    donations,
    addDonation,
    updateDonation,
    deleteDonation,
    loadDonationsFromAPI,
    
    // Payment functions
    createRazorpayOrder,
    verifyPayment,
    generateQRCode,
    markUPIPaymentCompleted,
    getPaymentSummary,

    // ==================== INVITATION FUNCTIONS ====================
    // Invitations with API integration
    invitations,
    addInvitation,
    updateInvitation,
    deleteInvitation,
    loadInvitationsFromAPI,
    
    // Event Categories with API integration
    eventCategories,
    addEventCategory,
    updateEventCategory,
    deleteEventCategory,
    loadEventCategoriesFromAPI,
    
    // ==================== EXISTING INTEGRATIONS ====================
    // Appointments with API integration
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    loadAppointmentsFromAPI,
    
    // Volunteers with API integration
    volunteers,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    updateVolunteerStatus,
    loadVolunteersFromAPI,
    
    // Projects with API integration
    projects,
    addProject,
    updateProject,
    deleteProject,
    loadProjectsFromAPI,
    
    // E-Library with API integration
    elibrary,
    addELibraryItem,
    updateELibraryItem,
    deleteELibraryItem,
    downloadBook,
    loadELibraryFromAPI,
    
    // Other entities
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
    importantDates,
    addImportantDate,
    updateImportantDate,
    deleteImportantDate,
    analytics,
    setAnalytics,
    
    // Common states
    loading,
    error,
    clearError: () => setError(null),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};