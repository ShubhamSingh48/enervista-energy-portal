const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_super_secret_jwt_key_here';

// Middleware
app.use(express.json());
app.use(cors());

// Brute-force protection: Rate limiting on auth route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes.' }
});

// Static Mock User List
const MOCK_USERS = [
  {
    id: 1,
    email: 'shubham@enervista.com',
    password: 'Password123',
    name: 'Shubham'
  }
];

// Login Endpoint
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

  // Bonus/Premium Feature: Dynamic Greeting & Eco-Tier Utility Flag
  const premiumGreeting = `Peak demand hours active. Your premium eco-tier saved you 12% today!`;

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: { name: user.name, email: user.email },
    utilityFlag: premiumGreeting
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
