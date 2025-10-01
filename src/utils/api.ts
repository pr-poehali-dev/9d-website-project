import funcUrls from '../../backend/func2url.json';

const API_URL = funcUrls.api;
const VERIFY_PASSWORD_URL = funcUrls['verify-password'];
const PASSWORD = atob('Njc0NVEt');

export const api = {
  async fetchAllData() {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return response.json();
  },

  async updatePhoto(photoUrl: string | null) {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'update_photo',
        data: { photo_url: photoUrl }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update photo');
    }
    
    return response.json();
  },

  async addNews(title: string, content: string, date: string) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'add_news',
        data: { title, content, date }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add news');
    }
    
    return response.json();
  },

  async updateNews(id: number, title: string, content: string) {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'update_news',
        data: { id, title, content }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update news');
    }
    
    return response.json();
  },

  async deleteNews(id: number) {
    const response = await fetch(`${API_URL}?action=delete_news&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete news');
    }
    
    return response.json();
  },

  async addStudent(name: string) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'add_student',
        data: { name }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add student');
    }
    
    return response.json();
  },

  async updateStudent(id: number, name: string) {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'update_student',
        data: { id, name }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update student');
    }
    
    return response.json();
  },

  async deleteStudent(id: number) {
    const response = await fetch(`${API_URL}?action=delete_student&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
    
    return response.json();
  },

  async addHomework(subject: string, task: string, due: string, status: string) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'add_homework',
        data: { subject, task, due, status }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add homework');
    }
    
    return response.json();
  },

  async updateHomework(id: number, subject: string, task: string, due: string, status: string) {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'update_homework',
        data: { id, subject, task, due, status }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update homework');
    }
    
    return response.json();
  },

  async deleteHomework(id: number) {
    const response = await fetch(`${API_URL}?action=delete_homework&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete homework');
    }
    
    return response.json();
  },

  async addMaterial(title: string, type: string, size: string) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'add_material',
        data: { title, type, size }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add material');
    }
    
    return response.json();
  },

  async updateMaterial(id: number, title: string) {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      },
      body: JSON.stringify({
        action: 'update_material',
        data: { id, title }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update material');
    }
    
    return response.json();
  },

  async deleteMaterial(id: number) {
    const response = await fetch(`${API_URL}?action=delete_material&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': PASSWORD
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete material');
    }
    
    return response.json();
  },

  async verifyPassword(password: string) {
    const response = await fetch(VERIFY_PASSWORD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify password');
    }
    
    const data = await response.json();
    return data.valid;
  }
};