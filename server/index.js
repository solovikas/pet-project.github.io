require("dotenv").config();

const express = require("express");
const sequelize = require("./db");
const { models } = require("./models/models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Замените на URL вашего клиента
    methods: ["GET", "POST", "DELETE", "PUT"], // Укажите методы, которые будут разрешены
    allowedHeaders: ["Content-Type", "Authorization"], // Укажите разрешенные заголовки
    credentials: true, // Если требуется передавать куки
  })
);
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
