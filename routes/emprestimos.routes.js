const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../sequelize");
const Usuario = require('../model/usuarios');
const Livro = require('../model/livros');
const Emprestimo = require('../model/emprestimos');

sequelize.sync();

//GET Retorna cliente com os pedidos com paginação e ordenação
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 30 } = req.query;
    
        const [results, metadata] = await sequelize.query(
            `SELECT emprestimos.* FROM emprestimos 
            ORDER BY emprestimos.updatedAt DESC LIMIT :limit OFFSET :offset`,
            {
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({
            emprestimo: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

// GET para listar todos os clientes
router.get('/todos', async (req, res) => {
    try {
        const query = "SELECT * FROM clientes";
        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.json({
            success: true,
            clientes: results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

//GET Consulta um cliente pelo ID
router.get('/:id', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM clientes WHERE id = :id`,
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
                clientes: results,
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

router.get('/cliente/clienteMaior', async (req, res) => {
    try {
        const query = `SELECT clienteId, COUNT(*) AS quantidade_carros_comprados
        FROM pedidos
        GROUP BY clienteId
        HAVING COUNT(*) = (
            SELECT MAX(total_carros)
            FROM (
                SELECT COUNT(*) AS total_carros
                FROM pedidos
                GROUP BY clienteId
            ) AS carros_por_cliente
        )`;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.json({
            success: true,
            clienteMaior: results,
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
        const query = `INSERT INTO emprestimos (usuarioId, livroId, data_emprestimo, data_devolucao, multa_atraso, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const replacements = [req.body.usuarioId, req.body.livroId, req.body.data_emprestimo, req.body.data_devolucao, req.body.multa_atraso, new Date(), new Date()];

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
    const { telefone } = req.body; //campo a ser alterado
    try {
        //altera o campo preco, no registro onde o id coincidir com o id enviado
        await sequelize.query("UPDATE clientes SET telefone = ? WHERE id = ?", { replacements: [telefone, id], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Cliente atualizado com sucesso.' }); //statusCode indica ok no update
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e mensagens
    }
});

//método DELETE para deletar através do id um empréstimo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; //pega o id enviado pela requisição para ser excluído

        await sequelize.query("DELETE FROM emprestimos WHERE id = ?",
            {
                replacements: [id],
                type: QueryTypes.DELETE
            });
        res.status(200).json({ message: 'Empréstimo deletado com sucesso.' }); //statusCode indica ok no delete
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e mensagens
    }
});

module.exports = router;