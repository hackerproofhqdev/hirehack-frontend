import { getUserProfile } from '@/actions/getUserProfile';
import { ParsedResume } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Resume API service functions
export interface ApiResume {
  id?: number;
  name: string;
  resume: Record<string, any>;
  last_modified: string;
  template: string;
  user_id?: number;
}

export interface UpdateTemplateRequest {
  template: string;
  resume_id: number;
}

// Get authentication token from cookies
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const accessToken = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
    return accessToken ? accessToken.split('=')[1] : null;
  }
  return null;
};

// Save resume to database
export const saveResume = async (resumeData: {
  name: string;
  resume: ParsedResume;
  template: string;
}): Promise<ApiResume> => {
  const userProfile = await getUserProfile();
  
  const response = await fetch(`${API_BASE_URL}/api/resume/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: resumeData.name,
      resume: resumeData.resume,
      template: resumeData.template,
      last_modified: new Date().toISOString(),
      user_id: userProfile.id
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save resume: ${response.statusText}`);
  }

  return response.json();
};

// Get user's resumes from database
export const getUserResumes = async (userId: number): Promise<ApiResume[]> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/resume/get?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get resumes: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};

// Update resume template
export const updateResumeTemplate = async (template: string, resumeId: number): Promise<void> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/resume/update-template`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({
      template,
      resume_id: resumeId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update template: ${response.statusText}`);
  }
};

// Update resume name
export const updateResumeName = async (resumeId: number, name: string): Promise<void> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/resume/update-name?resume_id=${resumeId}&name=${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to update resume name: ${response.statusText}`);
  }
};

// Delete resume from database
export const deleteResume = async (resumeId: number): Promise<void> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/resume/delete?resume_id=${resumeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete resume: ${response.statusText}`);
  }
};

 