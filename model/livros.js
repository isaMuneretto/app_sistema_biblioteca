const db = require("../sequelize");
const Sequelize = require("sequelize");
const detalhe_livro = require('./detalhes_livros');

const Livro = db.define("livro", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    isbn: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    autor: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    genero: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    detalhes_livrosId: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.STRING,
        allowNull: false,
    },
    leitura_local: {
        type: Sequelize.STRING,
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

Livro.belongsTo(detalhe_livro, { foreignKey: 'detalhes_livrosId' });

Livro.sync();

module.exports = Livro;