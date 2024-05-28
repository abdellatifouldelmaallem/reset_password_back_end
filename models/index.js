const db_config = require('../config/configaration');
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(db_config.development)

async function testConnection(){
    try {     
        await sequelize.authenticate();
        console.log('Database connected succefully');
  } catch (error) {
        console.error('Unable to connect to the database:', error);
     }
} 

testConnection();

module.exports = sequelize;
