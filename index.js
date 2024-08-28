const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Session configuration
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Use the correct environment variable
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60000
  }
}));

// Other middleware and routes...

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
