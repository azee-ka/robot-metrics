const API_URL = 'http://localhost:8000';

export async function getFleetStatus() {
  try {
    const response = await fetch(`${API_URL}/api/v1/fleet/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { robots: [] };
  }
}
