// API configuration
const API_BASE_URL = 'https://api.example.com';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

async function handleResponse(response: Response): Promise<ApiResponse> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
}

export async function shareVideoViaEmail(formData: FormData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/share/email`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to share via email. Please try again.');
  }
}

export async function shareVideoViaTwitter(formData: FormData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/share/twitter`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Failed to share via Twitter. Please try again.');
  }
}