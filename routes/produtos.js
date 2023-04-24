const { Router } = require('express');
const Produto = require('../models/produto');
const Joi = require('joi');
const { Types } = require('mongoose');

const router = Router();

const produtoSchema = Joi.object({
  nome: Joi.string().required().messages({
    'any.required': 'O campo nome é obrigatório',
    'string.empty': 'O campo nome não pode estar vazio'
  }),
  descricao: Joi.string().required().messages({
    'any.required': 'O campo descrição é obrigatório',
    'string.empty': 'O campo descrição não pode estar vazio'
  }),
  qtde: Joi.number().integer().min(0).required().messages({
    'any.required': 'O campo quantidade é obrigatório',
    'string.empty': 'O campo quantidade não pode estar vazio',
    'number.integer': 'A quantidade deve ser um número inteiro',
    'number.min': 'A quantidade não pode ser menor que 0'
  }),
  preco: Joi.number().positive().required().messages({
    'any.required': 'O campo preço é obrigatório',
    'string.empty': 'O campo preço não pode estar vazio',
    'number.positive': 'O preço deve ser um número positivo'
  }),
  desconto: Joi.number().min(0).required().messages({
    'any.required': 'O campo desconto é obrigatório',
    'string.empty': 'O campo desconto não pode estar vazio',
    'number.min': 'O desconto não pode ser menor que 0'
  }),
  dataDesconto: Joi.date().iso().messages({
    'date.iso': 'A data do desconto deve estar no formato ISO (aaaa-mm-dd)'
  }),
  categoria: Joi.string().required().messages({
    'any.required': 'O campo categoria é obrigatório',
    'string.empty': 'O campo categoria não pode estar vazio'
  })
});

//Inserção de produto
router.post('/produtos', async (req, res) => {
  try {
    const { error, value } = produtoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
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
      categoria
    });
    await produto.save();
    res.json(produto);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Um erro aconteceu.' });
  }
});

//Listar todos produtos com filtros
router.get('/produtos', async (req, res) => {
  try {
    const { nome, categoria, precoMin, precoMax, descontoMin, descontoMax } =
      req.query;

    const filter = {};
    if (nome) filter.nome = { $regex: new RegExp(nome), $options: 'i' };
    if (categoria) filter.categoria = categoria;
    if (precoMin) filter.preco = { ...filter.preco, $gte: Number(precoMin) };
    if (precoMax) filter.preco = { ...filter.preco, $lte: Number(precoMax) };
    if (descontoMin)
      filter.desconto = { ...filter.desconto, $gte: Number(descontoMin) };
    if (descontoMax)
      filter.desconto = { ...filter.desconto, $lte: Number(descontoMax) };

    const produtos = await Produto.find(filter);
    res.json(produtos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Um erro aconteceu!' });
  }
});

/* 
//Listar todos produtos
router.get("/produtos", async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});
 */
//Listar um produto
router.get('/produto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    //validação id get
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido!' });
    }
    const produtoExistente = await Produto.findById(id);
    if (produtoExistente) {
      res.json(produtoExistente);
    } else {
      res.status(404).json({ message: 'Produto não encontrado!' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Um erro aconteceu!' });
  }
});

//Editar produto
router.put('/produto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    //validação put
    const { error, value } = produtoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { nome, descricao, qtde, preco, desconto, dataDesconto, categoria } =
      value;
    const produtoExistente = await Produto.findByIdAndUpdate(id, {
      nome,
      descricao,
      qtde,
      preco,
      desconto,
      dataDesconto,
      categoria
    });

    if (produtoExistente) {
      res.json({ message: 'Produto editado.' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Um erro aconteceu!' });
  }
});

//deletar produtos

router.delete('/produto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    //validação id delete
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido!' });
    }

    const produtoExistente = await Produto.findByIdAndDelete(id);

    const produtosRestantes = await Produto.find();
    if (produtoExistente) {
      res.json({ message: 'Produto deletado com sucesso!', produtosRestantes });
    } else {
      res
        .status(404)
        .json({ message: 'Produto não encontrado!', produtosRestantes });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Um erro aconteceu!' });
  }
});

module.exports = router;
