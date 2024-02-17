const express = require('express');
const routes = require('./routes');
// import sequelize connection
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  'umbrella',
  '',
  '',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const products = sequelize.define("Products", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  category_id: {
    type: DataTypes.INTEGER
  }
});

sequelize.sync().then(() => {
  console.log('Products table created successfully!');
  products.create({
    product_name: "Cell Phone",
    price: 299.99,
    stock: 100,
    category_id: 0
  }).then(res => {
    console.log('Product added')
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

sequelize.sync().then(() => {
    products.findAll().then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
