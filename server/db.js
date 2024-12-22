const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);

sequelize.sync({ force: false }) 
  .then(() => {
    console.log("Database is synchronized!");
  })
  .catch(error => {
    console.error("Database synchronization error:", error);
  });

module.exports = sequelize;
