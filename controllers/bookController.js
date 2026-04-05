const pool = require('../config/db');

// 3a - Listar todos os livros
async function getAllBooks(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM book');
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar livros' });
    }
}

// 3b - Adicionar um novo livro
async function addBook(req, res) {
    try {
        const { title, isbn, genre, review, synopsis, pages, price, published, comment } = req.body;
        const [result] = await pool.query('INSERT INTO book (title, isbn, genre, review, synopsis, pages, price, published, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, isbn, genre, review, synopsis, pages, price, published, JSON.stringify(comment)]);
        res.status(201).json({ message: 'Livro adicionado com sucesso', bookId: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao adicionar livro' });
    }
}

// 3c - Selecionar livros por género (via params)
async function getBooksByGenre(req, res) {
    try {
        const { genre } = req.params;
        const [rows] = await pool.query('SELECT * FROM book WHERE genre = ?', [genre]);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar livros' });
    }
}

// 3d - Aplicar desconto em percentagem (via query)
async function applyDiscount(req, res) {
    try {
        const { id, discount } = req.query;
        const [result] = await pool.query('UPDATE book SET price = price - (price * ? / 100) WHERE id = ?', [discount, id]);

        // Se o livro não for encontrado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        // Desconto aplicado com sucesso
        res.status(200).json({ message: 'Desconto aplicado com sucesso' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao aplicar desconto' });
    }
}

// 3e - Listar livros publicados antes de uma data (via params)
async function getBooksBeforeDate(req, res) {
    try {
        const { date } = req.params;
        const [rows] = await pool.query('SELECT * FROM book WHERE published < ?', [date]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar livros' });
    }
}

// 4a - Selecionar um livro pelo ID (via query)
async function getBookById(req, res) {
    try {
        const { id } = req.query;
        const [rows] = await pool.query('SELECT * FROM book WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar livros' });
    }
}

// 4b - Apagar livro (via params)
async function deleteBook(req, res) {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM book WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        res.status(200).json({ message: 'Livro apagado com sucesso' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao apagar livro' });
    }
}

// 4c - Filtrar livros por palavras-chave na sinopse (via body)
async function getBooksByWordInSynopsis(req, res) {
    try {
        const { word } = req.body;
        const [rows] = await pool.query('SELECT * FROM book WHERE synopsis LIKE ?', [`%${word}%`]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar livros' });
    }
}

// 4d - Adicionar comentário a um livro (mantendo os anteriores)
async function addComment(req, res) {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const [rows] = await pool.query('SELECT * FROM book WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        const book = rows[0];

        let commentsArray = book.comment ? JSON.parse(book.comment) : [];
        commentsArray.push(comment);

        await pool.query('UPDATE book SET comment = ? WHERE id = ?', [JSON.stringify(commentsArray), id]);
        res.status(200).json({ message: 'Comentário adicionado com sucesso' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao adicionar comentário' });
    }
}

// 4e - Listar livros ordenados por preço crescente (ordenação em JS)
async function getBooksByPrice(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM book');
        rows.sort((a, b) => a.price - b.price);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar livros' });
    }
}

module.exports = {
    getAllBooks,
    addBook,
    getBooksByGenre,
    applyDiscount,
    getBooksBeforeDate,
    getBookById,
    deleteBook,
    getBooksByWordInSynopsis,
    addComment,
    getBooksByPrice
}