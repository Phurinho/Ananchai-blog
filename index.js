const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session'); // Corrected import
const flash = require('connect-flash');
require('dotenv').config();
const connected = require('./connectMongo');
const MongoStore = require('connect-mongo'); // Correct import for Mongo session store

// Connect to MongoDB
connected();

// MVC
const newPostController = require('./controllers/newPost'); 
const homePostController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const aboutController = require('./controllers/about');
const contactController = require('./controllers/contact');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');
const myPostController = require('./controllers/myPost');
const editPostController = require('./controllers/editPost');
const updatePostController = require('./controllers/updatePost');
const deletePostController = require('./controllers/deletePost');

// Middleware
const validateMiddleWare = require('./middleware/validationmiddleware');
const authMiddleWare = require('./middleware/authmiddleware');
const redirectIfAuthenticatedMiddleWare = require('./middleware/redirectIfAuthenticatedMiddleware');

global.loggedIn = null;

// Static files
app.use(express.static('public'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/posts/store', validateMiddleWare);

app.set('trust proxy', 1);

// Correct session configuration with MongoDB
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_CONNECT_URI, // Make sure you have MONGO_URI in your .env
        collectionName: 'sessions'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // use secure cookies in production
        maxAge: 60000
    }
}));

// Check for session existence
app.use(function(req, res, next) {
    if (!req.session) {
        return next(new Error('Session initialization failed!'));
    }
    next();
});

// Global variable middleware
app.use('*', (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

// Flash messages
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');

// Routes
app.get('/', homePostController);
app.get('/about', aboutController);
app.get('/contact', contactController);
app.get('/post/:id', getPostController);
app.get('/posts/new', authMiddleWare, newPostController);
app.get('/auth/logout', logoutController);
app.post('/posts/store', authMiddleWare, storePostController);
app.get('/auth/register', redirectIfAuthenticatedMiddleWare, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleWare, storeUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleWare, loginController);
app.get('/posts/mypost', authMiddleWare, myPostController);
app.get('/posts/edit/:id', authMiddleWare, editPostController);
app.post('/posts/update', authMiddleWare, updatePostController);
app.get('/posts/delete/:id', authMiddleWare, deletePostController);
app.post('/users/login', redirectIfAuthenticatedMiddleWare, loginUserController);

// 404 handler
app.use((req, res) => res.status(404).render('notfound'));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
