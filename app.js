const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const moment = require('moment');
// db connection
mongoose.connect('mongodb://localhost/book');
let db = mongoose.connection;
// Check for DB connection errors
db.on('error', (error) => {
    console.log(error)
});

// Check for DB connection success
db.once('open',() => {
    console.log('Connected to MongoDB');
});

// initialize App
const app = express();
const port = 5000;

// Import Model
const Book = require('./models/book');
const { nextTick } = require('process');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// set public folder
app.use('/bootstrap', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/css/')))
app.use('/bootstrap', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/js/')))
app.use(express.static(path.join(__dirname, 'public')))


// Template Engine Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Default route
app.get('/' , (req, res) => {
     Book.find()
        .exec()
        .then(function(books) {
            res.render('home', {
                title: 'Books',
                books: books.map(book => book.toJSON())
            })
        // .catch(function(error) {
        //     console.log(error)
        // })        
    });
    
});

// Create Book route
// Renders from for creating new book
app.get('/create' , (req, res) => {
    res.render('create')
});


//Store New book to database
app.post('/create', (req, res) => {
    let book = new Book();
    book.name = req.body.name;
    book.author = req.body.author;
    book.numberOfPages = req.body.numberOfPages;
    let date = moment(req.body.yearOfPublication).format('MMMM Do YYYY');
    book.yearOfPublication = date;
    book.bookEdition = req.body.bookEdition;
    book.bookFormat = req.body.bookFormat;
    book.save((error) => {
        if(error){
            console.log(error);
            return;
        } else {
            res.redirect('/');
        }
    })
});

// Render Edit form
app.get('/edit/:id', (req, res) => {
    Book.findById(req.params.id, function (err, book) {
        res.render('edit', {
            title: "Edit Book",
            book: book.toJSON()
        })        
    })
       
});

// Update Book Data
app.post('/edit/:id', (req, res) => {
    let book = {};
    book.name = req.body.name;
    book.author = req.body.author;
    book.numberOfPages = req.body.numberOfPages;
    let date = moment(req.body.yearOfPublication).format('MMMM Do YYYY');
    book.yearOfPublication = book.yearOfPublication ? date : 'No date of publication';
    book.bookEdition = req.body.bookEdition;
    book.bookFormat = req.body.bookFormat;

    let query = {_id: req.params.id};

    Book.update(query, book, (error) => {
        if(error){
            console.log(error);
            return;
        } else {
            res.redirect('/');
        }
    })
});

app.get('/delete/:id', (req, res) => {
    let id = req.params.id
    Book.findOneAndRemove({_id: id})
        .exec()
        .then(function() {
            return res.redirect('/');
        })
        .catch(function(error) {
            console.log(error)
        })
})




app.listen(port, console.log(`Server started on port ${port}`))