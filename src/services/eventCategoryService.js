import { apiService } from './api';

export const eventCategoryService = {
  // Get all categories
  getAllCategories: async () => {
    return await apiService.get('/eventCategory');
  },

  // Get category by ID
  getCategoryById: async (id) => {
    return await apiService.get(`/eventCategory/${id}`);
  },

  // Create new category
  createCategory: async (categoryData) => {
    return await apiService.post('/eventCategory', categoryData);
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    return await apiService.put(`/eventCategory/${id}`, categoryData);
  },

  // Delete category
  deleteCategory: async (id) => {
    return await apiService.delete(`/eventCategory/${id}`);
  }
};