const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


const sequelize = require('./models/index');
const User = require('./models/user');


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
