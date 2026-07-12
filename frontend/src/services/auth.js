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
      // Backend returns { access_token, token_type } â€” no user object
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.access_token);
      // Decode user email from the JWT payload (middle part)
      try {
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));
        const userEmail = payload.sub || email;
        localStorage.setItem('user', JSON.stringify({ name: userEmail.split('@')[0], email: userEmail }));
      } catch {
        // If decode fails, fall back to the email used to log in
        localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
      }
      return true;
    }

    // Backend returned 401 â€” wrong credentials, don't fall back
    return false;
  } catch (error) {
    console.warn("Backend not reachable. Using offline fallback auth.", error);
  }

  // Offline fallback â€” allow any email/password when backend is down
  if (email && password) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
    localStorage.setItem('token', '');
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

export const getToken = () => {
  return localStorage.getItem('token') || '';
};

export const register = async (email, username, password) => {
  try {
    const response = await fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, name: username, password, role: 'employee' })
    });
    if (response.ok) {
      return true;
    } else {
      const err = await response.json();
      return { error: err.detail || 'Registration failed' };
    }
  } catch (error) {
    console.warn("Backend Auth API not reachable. Using fallback auth.", error);
    return { error: "Network Error" };
  }
};
