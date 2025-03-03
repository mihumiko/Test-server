const express = require("express");
const cors = require("cors");
require('dotenv').config()
const path = require("path");
const app = express();
const sequelize = require('./db');
const Product = require('./models/Product');
const initialData = require('./data')(`http://localhost:${process.env.PORT || 5000}`);
const PORT = process.env.PORT || 5000;
const HOST = `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "./assets")));

// Получение продукта по ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(parseInt(req.params.id));
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Продукт не найден");
    }
  } catch (error) {
    console.error('Ошибка при получении продукта:', error);
    res.status(500).send("Ошибка сервера");
  }
});

// Получение всех продуктов
app.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    if (products.length > 0) {
      res.json(products);
    } else {
      res.status(404).send("Продукты не найдены");
    }
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    res.status(500).send("Ошибка сервера");
  }
});

// Функция проверки и заполнения базы данных
const checkAndSeedDatabase = async () => {
  try {
    console.log('Проверка существования таблицы Products...');
    const tableExists = await sequelize.getQueryInterface().showAllTables()
      .then(tables => tables.includes('Products'));
    
    if (!tableExists) {
      console.log('Таблица Products не существует, создаём...');
      await sequelize.sync({ force: true });
      console.log('Таблица Products создана');
    }

    // Проверяем количество записей в базе
    const count = await Product.count();
    console.log(`Количество записей в базе: ${count}`);
    
    // Если база пустая, заполняем её начальными данными
    if (count === 0) {
      console.log('База данных пуста, заполняем начальными данными...');
      try {
        await Product.bulkCreate(initialData);
        console.log('База данных успешно заполнена');
      } catch (error) {
        console.error('Ошибка при заполнении данными:', error);
        console.log('Начальные данные:', JSON.stringify(initialData, null, 2));
      }
    } else {
      console.log(`В базе данных уже есть ${count} записей`);
    }
  } catch (error) {
    console.error('Ошибка при проверке/заполнении базы данных:', error);
  }
};

const start = async() => {
  try {
    console.log('Подключение к базе данных...');
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно');
    
    // Проверяем и заполняем базу данных при запуске
    await checkAndSeedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch(e) {
    console.error('Ошибка при запуске сервера:', e);
  }
}

start();
