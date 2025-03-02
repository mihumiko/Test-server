const express = require("express");
const cors = require("cors");
require('dotenv').config()
const path = require("path");
const app = express();
const sequelize = require('./db');
const PORT = 5000;
const HOST = `http://localhost:${PORT}`;

const products = require("./data")(HOST);

app.use(cors());
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "./assets")));


app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Продукт не найден");
  }
});

app.get("/products", (req, res) => {
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(404).send("Ничего нет");
  }
});


const start = async() => {
  try{
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {console.log(`Сервер запущен на http://localhost:${PORT}`);});
  } catch(e){
    console.log(e);
  }
}
start();
