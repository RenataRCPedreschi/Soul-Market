require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

//Configuração do APP
const app = express();
app.use(express.json());




//Configuração do Banco de dados
mongoose.connect(process.env.MONGODB_URL);

// Rotas
const produtosRoutes = require("./routes/produtos");
app.use(produtosRoutes);



//Swagger

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Soul Market - API",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Soul Market",
        url: "https://soulmarket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);




//Escuta de eventos

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/");
  });