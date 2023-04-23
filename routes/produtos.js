const { Router } = require("express");
const Produto = require("../models/produto");
const Joi = require("joi");

const router = Router();

const produtoSchema = Joi.object({
  nome: Joi.string().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome não pode estar vazio",
  }),
  descricao: Joi.string().required().messages({
    "any.required": "O campo descrição é obrigatório",
    "string.empty": "O campo descrição não pode estar vazio",
  }),
  qtde: Joi.number().integer().min(0).required().messages({
    "any.required": "O campo quantidade é obrigatório",
    "string.empty": "O campo quantidade não pode estar vazio",
  }),
  preco: Joi.number().positive().required().messages({
    "any.required": "O campo preço é obrigatório",
    "string.empty": "O campo preço não pode estar vazio",
  }),
  desconto: Joi.number().min(0).max(1).required().messages({
    "any.required": "O campo desconto é obrigatório",
    "string.empty": "O campo desconto não pode estar vazio",
  }),
  dataDesconto: Joi.date().iso(),
  categoria: Joi.string().required().messages({
    "any.required": "O campo de data do desconto é obrigatório",
    "string.empty": "O campo data do desconto não pode estar vazio",
  }),
});

//Inserção de produto
router.post("/produtos", async (req, res) => {
  try {
    const { error, value } = produtoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message});
    }
    const { nome, descricao, qtde, preco, desconto, dataDesconto, categoria } =
      value;
    const produto = new Produto({
      nome,
      descricao,
      qtde,
      preco,
      desconto,
      dataDesconto,
      categoria,
    });
    await produto.save();
    res.json(produto);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

//Listar todos produtos
router.get("/produtos", async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});

//Listar um produto
router.get("/produto/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const produtoExistente = await Produto.findById(id);
    if (produtoExistente) {
      res.json(produtoExistente);
    } else {
      res.status(404).json({ message: "Produto não encontrado!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu!" });
  }
});

//Editar produto
router.put("/produto/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, qtde, preco, desconto, dataDesconto, categoria } =
      req.body;
    const produtoExistente = await Produto.findByIdAndUpdate(id, {
      nome,
      descricao,
      qtde,
      preco,
      desconto,
      dataDesconto,
      categoria,
    });

    if (produtoExistente) {
      res.json({ message: "Produto editado." });
    } else {
      res.status(404).json({ message: "Produto não encontrado." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu!" });
  }
});

//deletar produtos

router.delete("/produto/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const produtoExistente = await Produto.findByIdAndDelete(id);

    const produtosRestantes = await Produto.find();
    if (produtoExistente) {
      res.json({ message: "Produto deletado com sucesso!", produtosRestantes });
    } else {
      res
        .status(404)
        .json({ message: "Produto não encontrado!", produtosRestantes });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu!" });
  }
});

module.exports = router;
