const db = require("../sequelize");
const Sequelize = require("sequelize");
const Livro = require('./livros');
const Usuario = require('./usuarios');

const Reserva = db.define('reserva', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    livroId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    data_reserva: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    data_expiração: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}, {});

Reserva.belongsTo(Livro, { foreignKey: 'livroId' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Reserva.sync();

module.exports = Reserva;
