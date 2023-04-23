const { Router } = require("express");
const Produto = require("../models/produto");

const router = Router();

//Inserção de produto
router.post("/produtos", async (req, res) => {
  try {
    const { nome, descricao, qtde, preco, desconto, dataDesconto, categoria } =
      req.body;
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

router.delete("/produto/:id", async (req,res) => {
    try{
        const {id} = req.params
        const produtoExistente = await Produto.findByIdAndDelete(id);

        const produtosRestantes = await Produto.find();
        if(produtoExistente){
            res.json({message: "Produto deletado com sucesso!", produtosRestantes})
        } else {
            res.status(404).json({message: "Produto não encontrado!", produtosRestantes})
        }
  
    } catch(err){
        console.log(err)
        res.status(500).json({message: "Um erro aconteceu!"})
    }
  })

module.exports = router;
