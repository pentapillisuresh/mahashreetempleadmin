import { apiService } from './api';

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async () => {
    return await apiService.get('/Astrology');
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    return await apiService.get(`/Astrology/${id}`);
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    return await apiService.post('/Astrology', appointmentData);
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    return await apiService.put(`/Astrology/${id}`, appointmentData);
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    return await apiService.delete(`/Astrology/${id}`);
  }
};