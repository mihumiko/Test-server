const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Products = sequelize.define('products', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    image: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT,
        allowNull: false 
    },
    ingredients: { 
        type: DataTypes.TEXT,
        allowNull: false  
    }
}, {
    timestamps: false
});
