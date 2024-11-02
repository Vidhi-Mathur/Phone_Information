const { DataTypes } = require('sequelize')
const seq = require('../util/database')

const Form = seq.define('form', {
    formType: {
        type: DataTypes.ENUM('A', 'B'), 
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[a-zA-Z\s]+$/
        }
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true, 
        }
    }
}, {
    timestamps: true
})

module.exports = Form