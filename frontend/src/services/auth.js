// Authentication Service

export const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ name: data.user.email.split('@')[0], email: data.user.email }));
      localStorage.setItem('token', data.access_token);
      return true;
    }
    return false; // Specifically returned false if response is unauthorized
  } catch (error) {
    console.warn("Backend Auth API not reachable. Using fallback auth.", error);
  }
  
  // Fallback to offline / mock credentials
  if (email && password) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
    localStorage.setItem('token', email);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};
