const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/bookController");

// 3a - Listar todos os livros
router.get("/", getAllBooks);

// 3b - Adicionar um novo livro
router.post("/", addBook);

// 3c - Selecionar livros por género (via params)
router.get("/genre/:genre", getBooksByGenre);

// 3d - Aplicar desconto em percentagem (via query)
router.get("/discount", applyDiscount);

// 3e - Listar livros publicados antes de uma data (via params)
router.get("/before/:date", getBooksBeforeDate);

// 4a - Selecionar um livro pelo ID (via query)
router.get("/id", getBookById);

// 4b - Apagar livro (via params)
router.delete("/delete/:id", deleteBook);

// 4c - Filtrar por palavras-chave na sinopse (via body)
router.post("/word", getBooksByWordInSynopsis);

// 4d - Adicionar comentário a um livro (mantendo os anteriores)
router.patch("/comment/:id", addComment);

// 4e - Listar livros ordenados por preço crescente (ordenação em JS)
router.get("/price", getBooksByPrice);

module.exports = router;