const Book = require('../models/bookModel');
const Author = require('../models/authorModel');
const mongoose = require('mongoose');

exports.createBook = async (req, res) => {
    try {
        const { author } = req.body;
        const authorExists = await Author.findById(author);
        if (!authorExists) return res.status(404).json({ error: 'Author not Found' });

        const book = new Book(req.body);
        await book.save();

        authorExists.books.push(book._id);
        await authorExists.save();

        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getAllBooks = async (req, res) => {
    try {
        const { search, authorName, sort = 'asc', page = 1, limit = 10 } = req.query;

        // Match conditions for search
        const matchConditions = [];
        if (search) {
            matchConditions.push({ title: { $regex: search, $options: 'i' } });
        }

        if (authorName) {
            matchConditions.push({ 'authorDetails.name': { $regex: authorName, $options: 'i' } });
        }

        const books = await Book.aggregate([
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                },
            },
            { $unwind: '$authorDetails' },
            {
                $match: matchConditions.length > 0 ? { $and: matchConditions } : {},
            },
            {
                $sort: { publishedDate: sort === 'desc' ? -1 : 1 },
            },
            {
                $skip: (page - 1) * parseInt(limit, 10),
            },
            {
                $limit: parseInt(limit, 10),
            },
        ]);

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                },
            },
            { $unwind: '$authorDetails' },
        ]);
        if (book.length === 0) return res.status(404).json({ message: 'Book not found' });
        res.json(book[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateBook = async (req, res) => {
    try {
        const { author } = req.body;
        if (author) {
            const existingAuthor = await Author.findById(author);
            if (!existingAuthor) return res.status(404).json({ message: 'Author not found' });
        }
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ message: 'Book not found' });

        res.json(book);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteBook = async (req, res) => {
    try {

        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        await Author.findByIdAndUpdate(book.author, { $pull: { books: book._id } });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}