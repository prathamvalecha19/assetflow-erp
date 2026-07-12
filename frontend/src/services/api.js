const BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchAssets = async () => {
  const res = await fetch(`${BASE_URL}/assets`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch assets');
  return res.json();
};

export const createAsset = async (assetData) => {
  const res = await fetch(`${BASE_URL}/assets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(assetData)
  });
  if (!res.ok) throw new Error('Failed to create asset');
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const fetchDepartments = async () => {
  const res = await fetch(`${BASE_URL}/departments`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
};

export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const fetchBookings = async () => {
  const res = await fetch(`${BASE_URL}/bookings`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
};

// Fallback mocks for Dashboard/Maintenance UI while they are being converted
export const maintenanceData = [
  { id: 'MNT-001', asset: 'MacBook Pro 16"', issue: 'Screen Flickering', priority: 'High', status: 'In Progress', technician: 'David Webb' }
];

export const dashboardData = {
  kpis: {
    assetsAvailable: { value: 1245, trend: '+5%', status: 'success' },
    assetsAllocated: { value: 843, trend: '+2%', status: 'warning' },
    maintenanceToday: { value: 12, trend: '-3%', status: 'danger' },
    activeBookings: { value: 56, trend: '+12%', status: 'primary' },
  },
  recentActivity: []
};
