const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    publishedDate: {
        type: Date
    },
    genre: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Author'
    }
});

module.exports = mongoose.model('Book', BookSchema);