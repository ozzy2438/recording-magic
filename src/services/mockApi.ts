// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock successful API response
async function mockApiCall(data: FormData): Promise<boolean> {
  await delay(1500); // Simulate network delay
  
  // Always return success for demo purposes
  // In production, this would be a real API call
  return true;
}

export const mockApi = {
  shareViaEmail: async (data: FormData) => mockApiCall(data),
  shareViaTwitter: async (data: FormData) => mockApiCall(data),
};