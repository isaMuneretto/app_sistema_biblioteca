const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../sequelize");
const detalhe_livro = require('../model/detalhes_livros');
const Livro = require('../model/livros');

sequelize.sync();

//GET Retorna carros com status do pedido
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
    
        const [results, metadata] = await sequelize.query(
            `SELECT livros.* FROM livros 
            ORDER BY livros.updatedAt DESC LIMIT :limit OFFSET :offset`,
            {
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({
            livro: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//lista os carros disponiveis no inventario
router.get('/disponiveis', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const [results, metadata] = await sequelize.query( //lista somente o ultimo inserido(VER)
            `SELECT * FROM carros 
            INNER JOIN inventarios ON inventarios.carroId = carros.id
            WHERE inventarios.quantidade > 0
            ORDER BY carros.updatedAt DESC LIMIT :limit OFFSET :offset`,
            {
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({
            carros: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//GET Consulta pelo ID
router.get('/:id', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM carros WHERE id = :id`,
            {
                replacements: { id: req.params.id },
                type: sequelize.QueryTypes.SELECT
            }
        );
        if (results.length === 0) {
            res.status(404).json({
                sucess: false,
                message: "tarefa não encontrada",
            });
        } else {
            res.json({
                sucess: true,
                task: results,
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

// GET para calcular o número médio de carros vendidos por mês
router.get('/media/mediaCarros', async (req, res) => {
    try {
        const query = ` SELECT YEAR(dataPedido) AS ano, MONTH(dataPedido) AS mes, COUNT(*) AS total_carros_vendidos FROM pedidos
    GROUP BY YEAR(dataPedido), MONTH(dataPedido)`;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.json({
            success: true,
            mediaCarros: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Método POST para cadastrar um livro
router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO livros 
        (isbn, titulo, autor, genero, detalhes_livrosId, data_publicacao, num_paginas, status, emprestimo_disponivel, leitura_local, qtde_dias, codigo_barras, num_exemplares, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const replacements = [req.body.isbn, req.body.titulo, req.body.autor, req.body.genero, req.body.detalhes_livroId, req.body.data_publicacao, req.body.num_paginas, req.body.status, req.body.emprestimo_disponivel, req.body.leitura_local, req.body.qtde_dias, req.body.codigo_barras, req.body.num_exemplares, new Date(), new Date()];

        const [results, metadata] = await sequelize.query(query, { replacements });

        res.status(201).json({
            success: true,
            message: "Operação criada com sucesso",
            results: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

//método PUT para atualizar um livro, o id indica o registro a ser alterado
router.put('/:id', async (req, res) => {
    const id = req.params.id; //pega o id enviado pela requisição
    const { preco } = req.body; //campo a ser alterado
    try {
        //altera o campo preco, no registro onde o id coincidir com o id enviado
        await sequelize.query("UPDATE carros SET preco = ? WHERE id = ?", { replacements: [preco, id], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Carro atualizado com sucesso.' }); //statusCode indica ok no update
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e mensagens
    }
});

//método DELETE para deletar através do id um livro
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; //pega o id enviado pela requisição para ser excluído

        await sequelize.query("DELETE FROM livros WHERE id = ?",
            {
                replacements: [id],
                type: QueryTypes.DELETE
            });
        res.status(200).json({ message: 'Livro deletado com sucesso.' }); //statusCode indica ok no delete
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e mensagens
    }
});

module.exports = router;