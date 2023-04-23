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

//Listar produtos

router.get("/produtos", async(req, res) =>{
    
})

module.exports = router;
