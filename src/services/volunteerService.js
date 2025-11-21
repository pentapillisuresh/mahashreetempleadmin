import { apiService } from './api';

export const volunteerService = {
  // Get all volunteers with optional filters
  getAllVolunteers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.areasOfInterest) queryParams.append('areasOfInterest', filters.areasOfInterest);
    if (filters.availability) queryParams.append('availability', filters.availability);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/volunteer?${queryString}` : '/volunteer';
    
    return await apiService.get(endpoint);
  },

  // Get volunteer by ID
  getVolunteerById: async (id) => {
    return await apiService.get(`/volunteer/${id}`);
  },

  // Create new volunteer
  createVolunteer: async (volunteerData) => {
    return await apiService.post('/volunteer/apply', volunteerData);
  },

  // Update volunteer
  updateVolunteer: async (id, volunteerData) => {
    return await apiService.put(`/volunteer/${id}`, volunteerData);
  },

  // Delete volunteer
  deleteVolunteer: async (id) => {
    return await apiService.delete(`/volunteer/${id}`);
  },

  // Update volunteer status
  updateVolunteerStatus: async (id, status) => {
    return await apiService.put(`/volunteer/${id}/status`, { status });
  }
};