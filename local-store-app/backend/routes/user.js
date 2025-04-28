const bcrypt = require('bcrypt');
const db = require('../db');
const router = require('express').Router();

router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    
    const userExists = await db.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const newUser = await db.query(
      `INSERT INTO users (full_name, username, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, username, email, created_at`,
      [fullName, username, email, passwordHash]
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userResult = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = userResult.rows[0];
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    
    const sessionData = {
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    req.session.user = sessionData;
    
    res.status(200).json({
      message: 'Login successful',
      user: sessionData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/logout', (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Error during logout' });
      }
      
      res.clearCookie('connect.sid');
      
      res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

module.exports = router;