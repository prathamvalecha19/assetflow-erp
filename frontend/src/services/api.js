const BASE_URL = 'http://localhost:8000/api';

// Helper to get auth headers
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.email) {
    headers['Authorization'] = `Bearer ${user.email}`;
  }
  return headers;
};

// Original Mock JSON Data for backward compatibility
export const dashboardData = {
  kpis: {
    assetsAvailable: { value: 1245, trend: '+5%', status: 'success' },
    assetsAllocated: { value: 843, trend: '+2%', status: 'warning' },
    maintenanceToday: { value: 12, trend: '-3%', status: 'danger' },
    activeBookings: { value: 56, trend: '+12%', status: 'primary' },
    pendingTransfers: { value: 8, trend: '-1%', status: 'warning' },
    upcomingReturns: { value: 24, trend: '+4%', status: 'success' }
  },
  recentActivity: [
    { id: 1, action: 'Asset Allocated', item: 'MacBook Pro M2', user: 'Sarah Jenkins', time: '10 mins ago', status: 'completed' },
    { id: 2, action: 'Maintenance Requested', item: 'Office Printer', user: 'Mike Ross', time: '1 hour ago', status: 'pending' },
    { id: 3, action: 'Asset Returned', item: 'Dell Monitor', user: 'John Doe', time: '2 hours ago', status: 'completed' },
    { id: 4, action: 'Booking Approved', item: 'Conference Room A', user: 'Jane Smith', time: '3 hours ago', status: 'completed' }
  ]
};

export const assetsData = [
  { id: 1, name: 'MacBook Pro 16"', category: 'IT Equipment', status: 'Allocated', assignedTo: 'John Doe', location: 'HQ - Floor 2', condition: 'Good' },
  { id: 2, name: 'Ergonomic Chair', category: 'Furniture', status: 'Available', assignedTo: '-', location: 'HQ - Storage', condition: 'New' },
  { id: 3, name: 'Dell XPS 15', category: 'IT Equipment', status: 'Maintenance', assignedTo: '-', location: 'IT Dept', condition: 'Repair' },
  { id: 4, name: 'Projector', category: 'Electronics', status: 'Reserved', assignedTo: 'Sarah Jenkins', location: 'Meeting Room A', condition: 'Fair' },
  { id: 5, name: 'Company Van', category: 'Vehicles', status: 'Allocated', assignedTo: 'Logistics Team', location: 'Parking Bay 1', condition: 'Good' },
];

export const organizationData = {
  departments: [
    { id: 'DEP-01', name: 'Engineering', head: 'Alice Morgan', status: 'Active', size: 45 },
    { id: 'DEP-02', name: 'Marketing', head: 'Bob Fischer', status: 'Active', size: 24 },
    { id: 'DEP-03', name: 'Human Resources', head: 'Carol Danvers', status: 'Active', size: 8 },
    { id: 'DEP-04', name: 'IT Support', head: 'David Webb', status: 'Active', size: 12 }
  ],
  employees: [
    { id: 'EMP-001', name: 'John Doe', email: 'john@assetflow.com', department: 'Engineering', role: 'Developer', status: 'Active' },
    { id: 'EMP-002', name: 'Sarah Jenkins', email: 'sarah@assetflow.com', department: 'Marketing', role: 'Manager', status: 'Active' },
    { id: 'EMP-003', name: 'Mike Ross', email: 'mike@assetflow.com', department: 'IT Support', role: 'Technician', status: 'On Leave' }
  ]
};

export const bookingsData = [
  { id: 101, resource: 'Conference Room A', employee: 'john@assetflow.com', startTime: 'Oct 24, 10:00 AM', endTime: 'Oct 24, 11:30 AM', status: 'Approved' },
  { id: 102, resource: 'Company Van', employee: 'sarah@assetflow.com', startTime: 'Oct 25, 09:00 AM', endTime: 'Oct 26, 05:00 PM', status: 'Pending' },
  { id: 103, resource: 'Projector', employee: 'mike@assetflow.com', startTime: 'Oct 23, 02:00 PM', endTime: 'Oct 23, 04:00 PM', status: 'Completed' },
];

export const maintenanceData = [
  { id: 1, asset: 'MacBook Pro 16"', issue: 'Screen Flickering', priority: 'High', status: 'In Progress', technician: 'David Webb' },
  { id: 2, asset: 'AC Unit - Floor 2', issue: 'Not Cooling', priority: 'Medium', status: 'Pending', technician: '-' },
  { id: 3, asset: 'Office Printer', issue: 'Paper Jam', priority: 'Low', status: 'Approved', technician: 'Mike Ross' },
  { id: 4, asset: 'Company Van', issue: 'Oil Change', priority: 'Medium', status: 'Resolved', technician: 'AutoShop Inc' }
];

// Initialize local storage keys for persistence if API fails
if (!localStorage.getItem('local_assets')) {
  localStorage.setItem('local_assets', JSON.stringify(assetsData));
}
if (!localStorage.getItem('local_bookings')) {
  localStorage.setItem('local_bookings', JSON.stringify(bookingsData));
}
if (!localStorage.getItem('local_maintenance')) {
  localStorage.setItem('local_maintenance', JSON.stringify(maintenanceData));
}

// --- API ACTIONS ---

export const getAssets = async () => {
  try {
    const res = await fetch(`${BASE_URL}/assets`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('local_assets', JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn("Backend API not reachable. Using fallback local assets.", e);
  }
  return JSON.parse(localStorage.getItem('local_assets'));
};

export const getBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('local_bookings', JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn("Backend API not reachable. Using fallback local bookings.", e);
  }
  return JSON.parse(localStorage.getItem('local_bookings'));
};

export const createBooking = async (booking) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(booking),
    });
    if (res.ok) {
      const newBooking = await res.json();
      const locals = JSON.parse(localStorage.getItem('local_bookings')) || [];
      localStorage.setItem('local_bookings', JSON.stringify([...locals, newBooking]));
      return { success: true, data: newBooking };
    } else {
      const errData = await res.json();
      return { success: false, error: errData.detail || "Overlap or scheduling error." };
    }
  } catch (e) {
    console.warn("Backend API not reachable. Performing mock local booking creation.", e);
    const locals = JSON.parse(localStorage.getItem('local_bookings')) || [];
    const newStart = new Date(booking.start_time);
    const newEnd = new Date(booking.end_time);
    
    // Check overlap mock logic
    const overlap = locals.some(b => {
      const assetIdMatch = b.asset_id === booking.asset_id;
      if (!assetIdMatch || b.status === "Cancelled" || b.status === "Completed") return false;
      const bStart = new Date(b.start_time || b.startTime);
      const bEnd = new Date(b.end_time || b.endTime);
      return bStart < newEnd && bEnd > newStart;
    });

    if (overlap) {
      return { success: false, error: "Overlap detected! The resource is already booked for this duration." };
    }

    const allAssets = JSON.parse(localStorage.getItem('local_assets')) || [];
    const asset = allAssets.find(a => a.id === booking.asset_id) || { name: `Resource #${booking.asset_id}` };

    const newLocalBooking = {
      id: Date.now(),
      asset_id: booking.asset_id,
      resource: asset.name,
      employee: JSON.parse(localStorage.getItem('user'))?.email || 'admin@assetflow.com',
      start_time: booking.start_time,
      end_time: booking.end_time,
      status: 'Approved'
    };

    localStorage.setItem('local_bookings', JSON.stringify([...locals, newLocalBooking]));
    
    // Mark asset as Allocated locally
    const updatedAssets = allAssets.map(a => a.id === booking.asset_id ? { ...a, status: 'Allocated' } : a);
    localStorage.setItem('local_assets', JSON.stringify(updatedAssets));

    return { success: true, data: newLocalBooking };
  }
};

export const getMaintenance = async () => {
  try {
    const res = await fetch(`${BASE_URL}/maintenance`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('local_maintenance', JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn("Backend API not reachable. Using fallback local maintenance.", e);
  }
  return JSON.parse(localStorage.getItem('local_maintenance'));
};

export const createMaintenance = async (maint) => {
  try {
    const res = await fetch(`${BASE_URL}/maintenance`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(maint),
    });
    if (res.ok) {
      const newMaint = await res.json();
      const locals = JSON.parse(localStorage.getItem('local_maintenance')) || [];
      localStorage.setItem('local_maintenance', JSON.stringify([...locals, newMaint]));
      return { success: true, data: newMaint };
    }
  } catch (e) {
    console.warn("Backend API not reachable. Performing mock local maintenance creation.", e);
    const locals = JSON.parse(localStorage.getItem('local_maintenance')) || [];
    const allAssets = JSON.parse(localStorage.getItem('local_assets')) || [];
    const asset = allAssets.find(a => a.id === maint.asset_id) || { name: `Asset #${maint.asset_id}` };

    const newLocalMaint = {
      id: Date.now(),
      asset_id: maint.asset_id,
      asset: asset.name,
      issue: maint.issue,
      priority: maint.priority,
      status: 'Pending',
      technician: maint.technician || '-',
      created_at: new Date().toISOString()
    };

    localStorage.setItem('local_maintenance', JSON.stringify([...locals, newLocalMaint]));

    // Mark asset status as Maintenance locally
    const updatedAssets = allAssets.map(a => a.id === maint.asset_id ? { ...a, status: 'Maintenance' } : a);
    localStorage.setItem('local_assets', JSON.stringify(updatedAssets));

    return { success: true, data: newLocalMaint };
  }
};

export const updateMaintenanceStatus = async (id, updates) => {
  try {
    const res = await fetch(`${BASE_URL}/maintenance/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      const locals = JSON.parse(localStorage.getItem('local_maintenance')) || [];
      const newLocals = locals.map(m => m.id === id ? updated : m);
      localStorage.setItem('local_maintenance', JSON.stringify(newLocals));
      return { success: true, data: updated };
    }
  } catch (e) {
    console.warn("Backend API not reachable. Performing mock local status update.", e);
    const locals = JSON.parse(localStorage.getItem('local_maintenance')) || [];
    const newLocals = locals.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...updates };
        
        if (updates.status === 'Resolved') {
          const allAssets = JSON.parse(localStorage.getItem('local_assets')) || [];
          const updatedAssets = allAssets.map(a => a.id === m.asset_id ? { ...a, status: 'Available' } : a);
          localStorage.setItem('local_assets', JSON.stringify(updatedAssets));
        }
        return updated;
      }
      return m;
    });
    localStorage.setItem('local_maintenance', JSON.stringify(newLocals));
    return { success: true };
  }
};
