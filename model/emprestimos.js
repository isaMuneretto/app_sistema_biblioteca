const db = require("../sequelize");
const Sequelize = require("sequelize");
const Livro = require('./livros');
const Usuario = require('./usuarios');

const Emprestimo = db.define("emprestimo", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    livroId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    data_emprestimo: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    data_devolucao: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    multa_atraso: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Emprestimo.belongsTo(Livro, { foreignKey: 'livroId' });
Emprestimo.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Emprestimo.sync();

module.exports = Emprestimo;