import { apiService } from './api';

export const projectService = {
  // Get all projects with optional filters
  getAllProjects: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/project?${queryString}` : '/project';
    
    return await apiService.get(endpoint);
  },

  // Get projects by category
  getProjectsByCategory: async (category) => {
    return await apiService.get(`/project/category/${category}`);
  },

  // Get active projects
  getActiveProjects: async () => {
    return await apiService.get('/project/active');
  },

  // Get project by ID
  getProjectById: async (id) => {
    return await apiService.get(`/project/${id}`);
  },

  // Create new project
  createProject: async (projectData) => {
    return await apiService.post('/project', projectData);
  },

  // Update project
  updateProject: async (id, projectData) => {
    return await apiService.put(`/project/${id}`, projectData);
  },

  // Delete project
  deleteProject: async (id) => {
    return await apiService.delete(`/project/${id}`);
  }
};