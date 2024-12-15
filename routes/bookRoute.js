const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const { validateBook } = require('../middlewares/validation');

router.post('/', validateBook, BookController.createBook);
router.get('/', BookController.getAllBooks);
router.get('/:id', BookController.getBookById);
router.put('/:id', validateBook, BookController.updateBook);
router.delete('/:id', BookController.deleteBook);

module.exports = router;