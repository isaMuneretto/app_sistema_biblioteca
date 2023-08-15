const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
//const routes = require('./routes');
const PORT = 8081;

const itens = require('./routes/item_exemplar.routes')
const livro = require('./routes/livros.routes')
const emprestimo = require('./routes/emprestimos.routes');
const detalhe_livro = require('./routes/detalhes_livros.routes');
const reserva = require('./routes/reservas.routes');
const usuario = require('./routes/usuarios.routes');

app.use(cors());
app.use(bodyParser.json());
//app.use(routes);

app.use('/itens', itens);
app.use('/livro', livro);
app.use('/emprestimo', emprestimo);
app.use('/detalhe_livro', detalhe_livro);
app.use('/reserva', reserva);
app.use('/usuario', usuario);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});