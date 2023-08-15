const db = require("../sequelize");
const Sequelize = require("sequelize");
const Livro = require('./livros');
const Emprestimo = require('./emprestimos');

const item_exemplar = db.define("itens", {
    emprestimoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    livroId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

item_exemplar.belongsTo(Livro, { foreignKey: 'livroId' });
item_exemplar.belongsTo(Emprestimo, { foreignKey: 'emprestimoId' });

item_exemplar.sync();

module.exports = item_exemplar;