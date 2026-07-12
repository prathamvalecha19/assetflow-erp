const BASE_URL = 'http://localhost:8000';

export const login = async (email, password) => {
  if (!email || !password) return false;
  
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const res = await fetch(`${BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({ email }));
      return true;
    }
  } catch (error) {
    console.error("Login failed", error);
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};
