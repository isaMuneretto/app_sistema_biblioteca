const db = require("../sequelize");
const Sequelize = require("sequelize");

const Cadastro = db.define("cadastro", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    isbn: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    data_publicacao: {
        type: Sequelize.DATE,
        allowNull: false, 
    },
    num_paginas: {
        type: Sequelize.INTEGER,
        allowNull: false, 
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    emprestimo_disponivel: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    leitura_local: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    qtde_dias: {
        type: Sequelize.INTEGER,
        allowNull: false, 
    },
    codigo_barras: {
        type: Sequelize.INTEGER,
        allowNull: false, 
    },
    num_exemplares: {
        type: Sequelize.INTEGER,
        allowNull: false, 
    },    
});

Cadastro.sync();

module.exports = Cadastro;