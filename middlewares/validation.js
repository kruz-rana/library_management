const Joi = require('joi');

// schemas
const authorSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
    }),
    bio: Joi.string().optional(),
    dateOfBirth: Joi.date().max('now').optional(),
});

const bookSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required',
    }),
    publishedDate: Joi.date().optional(),
    genre: Joi.string().optional(),
    author: Joi.string().required().messages({
        'string.empty': 'Author ID is required',
        'string.base': 'Author ID must be a valid string',
    }),
});

// Middleware for validation
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({ errors });
    }
    next();
};

module.exports = {
    validateAuthor: validate(authorSchema),
    validateBook: validate(bookSchema),
};
