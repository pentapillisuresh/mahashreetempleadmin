import { apiService } from './api';

export const elibraryService = {
  // Get all books with optional filters
  getAllBooks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.format) queryParams.append('format', filters.format);
    if (filters.language) queryParams.append('language', filters.language);
    if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/elibrary?${queryString}` : '/elibrary';
    
    return await apiService.get(endpoint);
  },

  // Get books by category
  getBooksByCategory: async (category) => {
    return await apiService.get(`/elibrary/category/${category}`);
  },

  // Search books
  searchBooks: async (query) => {
    return await apiService.get(`/elibrary/search/${query}`);
  },

  // Get popular books
  getPopularBooks: async () => {
    return await apiService.get('/elibrary/popular');
  },

  // Get book by ID
  getBookById: async (id) => {
    return await apiService.get(`/elibrary/${id}`);
  },

  // Create new book
  createBook: async (bookData) => {
    return await apiService.post('/elibrary', bookData);
  },

  // Update book
  updateBook: async (id, bookData) => {
    return await apiService.put(`/elibrary/${id}`, bookData);
  },

  // Delete book
  deleteBook: async (id) => {
    return await apiService.delete(`/elibrary/${id}`);
  },

  // Download book (increment download count)
  downloadBook: async (id) => {
    return await apiService.get(`/elibrary/${id}/download`);
  }
};