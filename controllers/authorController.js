const Author = require('../models/authorModel');
const Book = require('../models/bookModel');
const mongoose = require('mongoose');

exports.createAuthor = async (req, res) => {
    try {
        const author = new Author(req.body);
        await author.save();
        res.status(201).json(author);
    } catch (err) {
        res.status(400).json({ error: error.message });
    }
}

exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'books',
                },
            },
        ]);
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAuthorById = async (req, res) => {
    try {
        const authorId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({ message: 'Invalid Author ID' });
        }

        const author = await Author.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(authorId) } },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'books',
                },
            },
        ]);
        if (author.length === 0) return res.status(404).json({ message: 'Author not found' });
        res.json(author[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!author) return res.status(404).json({ message: 'Author not found' });
        res.json(author);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) return res.status(404).json({ message: 'Author not found' });

        await Book.updateMany({ author: req.params.id }, { $unset: { author: '' } });
        res.json({ message: 'Author deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}