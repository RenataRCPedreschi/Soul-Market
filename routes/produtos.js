/**
 * @swagger
 * components:
 *   schemas:
 *     Produtos: 
 *       type: object
 *       required:
 *       properties:
 *         nome: 
 *           type: string  
 *           required: true  
 *           validate: {messages:'any.required': 'O campo nome é obrigatório', 'string.empty': 'O campo nome não pode estar vazio'} 
 *           description: Nome do produto 
 *         descricao:
 *           type: string
 *           required: true
 *           validate: {messages:'any.required': 'O campo descrição é obrigatório', 'string.empty': 'O campo descrição não pode estar vazio'}
 *           description: Descrição do produto
 *         qtde:
 *           type: number
 *           required: true
 *           validate: {messages:'any.required': 'O campo quantidade é obrigatório', 'string.empty': 'O campo quantidade não pode estar vazio', 'number.integer': 'A quantidade deve ser um número inteiro', 'number.min': 'A quantidade não pode ser menor que 0'}
 *           description: Quantidade do produto
 *         preco:
 *           type: number
 *           required: true
 *           validate: {messages:'any.required': 'O campo preço é obrigatório', 'string.empty': 'O campo preço não pode estar vazio', 'number.positive': 'O preço deve ser um número positivo'}
 *           description: preço do produto
 *         desconto:
 *           type: number
 *           required: true
 *           unique: true
 *           validate: {messages:'any.required': 'O campo desconto é obrigatório', 'string.empty': 'O campo desconto não pode estar vazio', 'number.min': 'O desconto não pode ser menor que 0'}
 *           description: Desconto do produto
 *         dataDesconto:
 *           type: date
 *           required: true
 *           unique: true
 *           validate: {messages:'date.iso': 'A data do desconto deve estar no formato ISO (aaaa-mm-dd)'}
 *           description: Data do desconto do produto
 *         categoria:
 *           type: string
 *           required: true
 *           unique: true
 *           validate: {messages:'any.required': 'O campo categoria é obrigatório', 'string.empty': 'O campo categoria não pode estar vazio'}
 *           description: Categoria do produto
 *       example:  
 *         nome: Contra Baixo
 *         descricao: Contra Baixo 4 Cordas Land Preto+Capa+Correia+Afinador
 *         qtde: 25
 *         preco: 1200.00
 *         desconto: 150.00
 *         dataDesconto: 2023-04-25
 *         categoria: Instrumento de corda
 *        
 */



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


/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API de Produtos
 * /produtos:
 *   post:
 *     summary: Cria um produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produtos'
 *     responses:
 *       400:
 *         description: Mensagem personalizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos'
 *       500:
 *         description: Um erro aconteceu..
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos'
 *  
 */




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

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API de Produtos
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produtos'
 *     responses:
 *       500:
 *         description: Um erro aconteceu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produtos'
 *  
 */



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




/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API produtos
 * /produto/{id}:
 *   get:
 *     summary: Lista um produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produto/{id}'
 *     responses:
 *       400:
 *         description: Id inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/routes/produto/{id}'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/routes/produto/{id}'
 *       500:
 *         description: Um erro aconteceu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produto/{id}'
 *  
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


/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API produtos
 * /produto/{id}:
 *   put:
 *     summary: Edita um produto
 *     tags: [Produto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produto/{id}'
 *     responses:
 *       400:
 *         description: Mensagem personalizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produto/{id}'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '/produto/{id}'
 *       500:
 *         description: Um erro aconteceu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produto/{id}'
 *  
 */




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



/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: O API produtos
 * /produto/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/produto/{id}'
 *     responses:
 *       400:
 *         description: Id inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produto/{id}'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produto/{id}'
 *       500:
 *         description: Um erro aconteceu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/produto/{id}'
 *  
 */




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
