require('dotenv').config()
const Sequelize  = require('sequelize')

const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {dialect: 'mysql', host: process.env.DB_HOST})

module.exports = seq