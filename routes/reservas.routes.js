const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require("../sequelize");
const Usuario = require('../model/usuarios');
const Livro = require('../model/livros');
const Reserva = require('../model/reservas');

sequelize.sync();

//GET Mostrar o inventário junto com os detalhes do carro.
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
    
        const [results, metadata] = await sequelize.query(
            `SELECT reservas.* FROM reservas 
            ORDER BY reservas.updatedAt DESC LIMIT :limit OFFSET :offset`,
            {
                replacements: { limit: limit, offset: (page - 1) * limit },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({
            reserva: results,
        });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

//GET Consulta  pelo ID
router.get('/:id', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM inventarios WHERE id = :id`,
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
                inventarios: results,
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    }
});

// Método POST para cadastrar um livro
router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO reservas ( usuarioId, livroId, data_reserva, data_expiração, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`;
        const replacements = [req.body.usuarioId, req.body.livroId, req.body.data_reserva, req.body.data_expiração, new Date(), new Date()];

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

//método PUT para atualizar um inventário, o id indica o registro a ser alterado
router.put('/:carroId', async (req, res) => {
    const carroId = req.params.carroId;
    const { quantidade } = req.body;

    try {
        //altera o campo preco, no registro onde o id coincidir com o id enviado
        await sequelize.query("UPDATE inventarios SET quantidade = ? WHERE carroId = ?", { replacements: [quantidade, carroId], type: QueryTypes.UPDATE });
        res.status(200).json({ message: 'Quantidade do inventário atualizado com sucesso.' }); //statusCode indica ok no update
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e mensagens
    }
});

//método DELETE para deletar através do id uma reserva
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; //pega o id enviado pela requisição para ser excluído

        await sequelize.query("DELETE FROM reservas WHERE id = ?",
            {
                replacements: [id],
                type: QueryTypes.DELETE
            });
        res.status(200).json({ message: 'Reserva deletado com sucesso.' }); //statusCode indica ok no delete
    } catch (error) {
        res.status(400).json({ msg: error.message }); //retorna status de erro e mensagens
    }
});

module.exports = router;