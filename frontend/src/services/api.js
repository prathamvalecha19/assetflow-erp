
// Mock JSON Data for the App

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
  { id: 'AST-001', name: 'MacBook Pro 16"', category: 'IT Equipment', status: 'Allocated', assignedTo: 'John Doe', location: 'HQ - Floor 2', condition: 'Good' },
  { id: 'AST-002', name: 'Ergonomic Chair', category: 'Furniture', status: 'Available', assignedTo: '-', location: 'HQ - Storage', condition: 'New' },
  { id: 'AST-003', name: 'Dell XPS 15', category: 'IT Equipment', status: 'Maintenance', assignedTo: '-', location: 'IT Dept', condition: 'Repair' },
  { id: 'AST-004', name: 'Projector', category: 'Electronics', status: 'Reserved', assignedTo: 'Sarah Jenkins', location: 'Meeting Room A', condition: 'Fair' },
  { id: 'AST-005', name: 'Company Van', category: 'Vehicles', status: 'Allocated', assignedTo: 'Logistics Team', location: 'Parking Bay 1', condition: 'Good' },
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
  { id: 'BKG-101', resource: 'Conference Room A', employee: 'John Doe', startTime: 'Oct 24, 10:00 AM', endTime: 'Oct 24, 11:30 AM', status: 'Approved' },
  { id: 'BKG-102', resource: 'Company Van', employee: 'Sarah Jenkins', startTime: 'Oct 25, 09:00 AM', endTime: 'Oct 26, 05:00 PM', status: 'Pending' },
  { id: 'BKG-103', resource: 'Projector', employee: 'Mike Ross', startTime: 'Oct 23, 02:00 PM', endTime: 'Oct 23, 04:00 PM', status: 'Completed' },
];

export const maintenanceData = [
  { id: 'MNT-001', asset: 'MacBook Pro 16"', issue: 'Screen Flickering', priority: 'High', status: 'In Progress', technician: 'David Webb' },
  { id: 'MNT-002', asset: 'AC Unit - Floor 2', issue: 'Not Cooling', priority: 'Medium', status: 'Pending', technician: '-' },
  { id: 'MNT-003', asset: 'Office Printer', issue: 'Paper Jam', priority: 'Low', status: 'Approved', technician: 'Mike Ross' },
  { id: 'MNT-004', asset: 'Company Van', issue: 'Oil Change', priority: 'Medium', status: 'Resolved', technician: 'AutoShop Inc' }
];

