const db = require("../sequelize");
const Sequelize = require("sequelize");

const detalhe_livro = db.define("detalhes_livros", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imagem_capa: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    sinopse: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    info_autor: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});


module.exports = detalhe_livro;