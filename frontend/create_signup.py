import os
import re

with open('src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Login specific elements to Signup
content = content.replace('Login', 'Signup')
content = content.replace('login(', 'register(')
content = content.replace('import { login } from', 'import { register, login } from')
content = content.replace('handleLogin', 'handleSignup')
content = content.replace('Welcome back', 'Create an account')

# Inject username state
username_state = "  const [name, setName] = useState('');\\n"
content = content.replace("  const [email, setEmail] = useState('');", username_state + "  const [email, setEmail] = useState('');")

# Update register call
content = content.replace('register(email, password)', 'register(email, name, password)')

# Create Username Input element
username_input = '''
            <div className="floating-input-group">
              <input 
                type="text" 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                required 
              />
              <label htmlFor="name">Username</label>
              <div className="focus-bg"></div>
            </div>
'''
content = content.replace('<form onSubmit={handleSignup} className="erp-form">', '<form onSubmit={handleSignup} className="erp-form">' + username_input)

# Update Link to go back to login
content = content.replace('Don\'t have an account? <a href="#">Request access</a>', 'Already have an account? <a href="/login">Sign in here</a>')

# Update button text
content = content.replace('Authenticating...', 'Creating account...')
content = content.replace('Sign in', 'Sign up')
content = re.sub(r'Please enter your credentials to access your dashboard\.', 'Join AssetFlow and manage your resources effortlessly.', content)

# Error handling block
body_replace = '''
    setTimeout(async () => {
      const res = await register(email, name, password);
      if (res === true) {
        // Automatically log them in after registration
        await login(email, password);
        navigate('/dashboard');
      } else {
        setError(res.error || 'Registration failed.');
        setIsLoading(false);
      }
    }, 800);
'''
content = re.sub(r'setTimeout\(\(\) => \{[^}]*if \(register\(email, name, password\)\).*setIsLoading\(false\);\s*\}\s*\}, 800\);', body_replace, content, flags=re.DOTALL)


with open('src/pages/Signup.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
