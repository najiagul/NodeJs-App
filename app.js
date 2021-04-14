if (process.env.NODE_ENV != 'production') {
    require('dotenv')
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
require('./config/passport')(passport)

// Connect to mongo
mongoose.connect(process.env.MongoURI, {useNewUrlParser : true})
    .then(console.log("Mongo DB connected"))
    .catch(err => err)

// Body parser
app.use(express.urlencoded({ extended : false }))

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

// Passport middileware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())

// Glocal Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next()
})

// EJS 
app.use(expressLayouts)
//app.use(express.static('public'));
//app.use(express.static('src/views'));

app.set('view engine', 'ejs')

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
