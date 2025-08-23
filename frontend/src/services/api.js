// API service for PhysioLens platform
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async getUserStats() {
    return this.request('/user/stats');
  }

  // Session endpoints
  async getSessionHistory(days = 7) {
    return this.request(`/sessions/history?days=${days}`);
  }

  async getLatestSession() {
    return this.request('/sessions/latest');
  }

  async createSession(sessionData) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  // Appointment endpoints
  async getUpcomingAppointments() {
    return this.request('/appointments/upcoming');
  }

  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  // Community endpoints
  async getCommunityPosts(limit = 20) {
    return this.request(`/community/posts?limit=${limit}`);
  }

  async createCommunityPost(postData) {
    return this.request('/community/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId) {
    return this.request(`/community/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  // Learning resources
  async getLearningResources(resourceType = null) {
    const params = resourceType ? `?resource_type=${resourceType}` : '';
    return this.request(`/resources${params}`);
  }

  // Progress chart
  async getProgressChart(days = 7) {
    return this.request(`/progress/chart?days=${days}`);
  }

  // Posture analysis
  async analyzePosture(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    const url = `${this.baseURL}/analyze`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async analyzeFrame(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    const url = `${this.baseURL}/analyze_frame`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async analyzeFrameJson(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    const url = `${this.baseURL}/analyze_frame_json`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export default new ApiService();