import { apiService } from './api';

export const invitationService = {
  // Get all invitations with optional filters
  getAllInvitations: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/invitation?${queryString}` : '/invitation';
    
    return await apiService.get(endpoint);
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    return await apiService.get('/invitation/upcoming');
  },

  // Get invitation by ID
  getInvitationById: async (id) => {
    return await apiService.get(`/invitation/${id}`);
  },

  // Create new invitation
  createInvitation: async (invitationData) => {
    return await apiService.post('/invitation', invitationData);
  },

  // Update invitation
  updateInvitation: async (id, invitationData) => {
    return await apiService.put(`/invitation/${id}`, invitationData);
  },

  // Delete invitation
  deleteInvitation: async (id) => {
    return await apiService.delete(`/invitation/${id}`);
  }
};