const express = require('express');
const app = express();
const porta = 3000;

const bookRoutes = require('./routes/bookRoutes');

app.use(express.json());

app.use('/books', bookRoutes);


app.listen(porta, () => {
    console.log(`Servidor a correr na porta ${porta}`);
});