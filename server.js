const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
dotenv.config()


const sequelize = require('./models/index');
const User = require('./models/user');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Apply the CORS middleware to allow requests from any origin
app.use(cors());

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Import and use the user routes
const authRoutes = require('./routes/user_routes');
app.use('/api', authRoutes);


sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Synchronize the models
    return sequelize.sync(); // This will create the tables if they do not exist
  })
  .then(() => {
    console.log('Models synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
