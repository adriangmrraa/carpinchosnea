const express = require('express');
const { createOrGetUser, getUserById } = require('../db/dao');

const router = express.Router();

// Mock auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.substring(7);
  if (!token.startsWith('mock_')) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  const userId = token.substring(5); // remove 'mock_'
  // In real, verify, but mock
  req.userId = userId;
  next();
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }
  try {
    const user = await createOrGetUser(username);
    const token = `mock_${user.id}`;
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;