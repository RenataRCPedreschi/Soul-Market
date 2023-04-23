require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//Configuração do APP
const app = express();
app.use(express.json());




//Configuração do Banco de dados
mongoose.connect(process.env.MONGODB_URL);

// Rotas
const produtosRoutes = require("./routes/produtos");
app.use(produtosRoutes);

/* const Produto = require("./models/produto"); */



//Swagger


//Escuta de eventos

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/");
  });