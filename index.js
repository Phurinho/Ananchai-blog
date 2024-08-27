const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const flash = require('connect-flash')
require('dotenv').config()
const connected = require('./connectMongo')
const MongoStore = require('connect-mongo');


//MVC
//M models, V views, C Controller
const newPostController = require('./controllers/newPost') 
const homePostController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const aboutController = require('./controllers/about')
const contactController = require('./controllers/contact')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')
const myPostController = require('./controllers/myPost')
const editPostController = require('./controllers/editPost')
const updatePostController = require('./controllers/updatePost')
const deletePostController = require('./controllers/deletePost')

//middleware
const validateMiddleWare = require('./middleware/validationmiddleware')
const authMiddleWare = require('./middleware/authmiddleware')
const redirectIfAuthenticatedMiddleWare = require('./middleware/redirectIfAuthenticatedMiddleware')

connected()

global.loggedIn = null

//middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(fileUpload())
app.use('/posts/store',validateMiddleWare)
app.use(expressSession({
    secret: "node secret",
}))

app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'node secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_CONNECT_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use('*',(req,res,next) =>{
    loggedIn = req.session.userId
    next()
})
app.use(flash())
app.set('view engine','ejs')




app.get('/', homePostController)

app.get('/about', aboutController)

app.get('/contact',contactController)

app.get('/post/:id',getPostController )

app.get('/posts/new',authMiddleWare,newPostController)

app.get('/auth/logout',logoutController)

app.post('/posts/store',authMiddleWare, storePostController)

app.get('/auth/register',redirectIfAuthenticatedMiddleWare, newUserController)

app.post('/users/register',redirectIfAuthenticatedMiddleWare, storeUserController)

app.get('/auth/login',redirectIfAuthenticatedMiddleWare,loginController)

app.get('/posts/mypost',authMiddleWare,myPostController)

app.get('/posts/edit/:id',authMiddleWare,editPostController)

app.post('/posts/update',authMiddleWare,updatePostController)

app.get('/posts/delete/:id',authMiddleWare,deletePostController)

app.post('/users/login',redirectIfAuthenticatedMiddleWare, loginUserController)

app.use((req,res)=> res.render('notfound'))



const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log('App listening on port 4000');
  });
  
