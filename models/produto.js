const {model, Schema} = require ("mongoose");

const Produto = model(
    "produto",
    new Schema ({
        nome:{
            type: String,
            required: true,
        },
        descricao:{
            type: String,
            required: true,
        },
        qtde:{
            type: Number,
            required: true,
        },
        preco:{
            type:Number,
            required: true
        },
        desconto:{
            type:Number,
            required: true,
        },
        dataDesconto:{
            type: Date,
            required: true,
        },
        categoria:{
            type: String,
            required: true,
        },
       /*  imgProdutos:{
            type: String,
        } */
    })
)

module.exports = Produto;