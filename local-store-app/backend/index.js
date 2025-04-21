const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/user');
const db = require('./db');
const session = require('express-session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 
    }
  }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Local Store API' });
});

app.use('/api/auth', userRoutes);

console.log("connected to db", process.env.DB_USER, process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});