// Mongoose
const mongoose = require('mongoose');


//Book schema
const bookSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    numberOfPages: {
        type: Number,
        require: true
    },
    yearOfPublication: {
        type: String,
        require: true
    },
    bookEdition: {
        type: String,
        required: true,
    },
    bookFormat:{
        type: String,
        enum: ['PDF', 'EPUB', 'MOBI',]
    }
});

let Book = module.exports = mongoose.model('Book', bookSchema);