const express = require('express');
const router = express.Router();
const AuthorController = require('../controllers/authorController');
const { validateAuthor } = require('../middlewares/validation');

router.post('/', validateAuthor, AuthorController.createAuthor);
router.get('/', AuthorController.getAllAuthors);
router.get('/:id', AuthorController.getAuthorById);
router.put('/:id', validateAuthor, AuthorController.updateAuthor);
router.delete('/:id', AuthorController.deleteAuthor);

module.exports = router;