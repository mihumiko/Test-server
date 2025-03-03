const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(
    process.env.DB_NAME || 'testdb',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        dialect: process.env.DB_DIALECT || 'postgres',
        host: process.env.DB_HOST || 'db',
        port: process.env.DB_PORT || 5432,
        logging: console.log,  // Включаем логирование SQL-запросов
        define: {
            timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
        }
    }
)

module.exports = sequelize