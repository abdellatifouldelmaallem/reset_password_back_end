const db_config = require('../config/configaration');
const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(db_config.development)

module.exports = sequelize;