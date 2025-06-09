import { getUserProfile } from '@/actions/getUserProfile';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface UserComplaint {
  id?: string;
  title: string;
  desc: string;
  feature_name: string;
  status?: string;
  user_id?: number;
  created_at?: string;
}

export interface ComplaintUpdate {
  title: string;
  desc: string;
  feature_name: string;
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

// Get user complaints
export const getUserComplaints = async (userId: number): Promise<UserComplaint[]> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/users/get/complaint?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get complaints: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};

// Register/Create new complaint
export const registerComplaint = async (complaintData: {
  title: string;
  desc: string;
  feature_name: string;
}): Promise<UserComplaint> => {
  const userProfile = await getUserProfile();
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/users/register/complaint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({
      title: complaintData.title,
      desc: complaintData.desc,
      feature_name: complaintData.feature_name,
      user_id: userProfile.id,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to register complaint: ${response.statusText}`);
  }

  return response.json();
};

// Update complaint
export const updateComplaint = async (
  complaintId: string,
  updateData: ComplaintUpdate
): Promise<void> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/users/update/complaint?complaint_id=${complaintId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update complaint: ${response.statusText}`);
  }
};

// Delete complaint
export const deleteComplaint = async (complaintId: string): Promise<void> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/users/delete/complaint?complaint_id=${complaintId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete complaint: ${response.statusText}`);
  }
};

// Get complaint details
export const getComplaintDetails = async (complaintId: string): Promise<UserComplaint> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/users/get-details/complaint?complaint_id=${complaintId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get complaint details: ${response.statusText}`);
  }

  return response.json();
}; 