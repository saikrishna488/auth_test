const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app =express()
const mongoose = require('mongoose')
const port = process.env.PORT || 5000
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

//passport config
require('./config/passport')(passport)

//loading uri
const db = require('./config/keys').mongoUri

//connect to mongo
mongoose.connect(db,{useNewUrlParser: true})
.then(()=> console.log("mongodb connected"))
.catch((err)=> console.log(err))

//using express ejs layout
app.use(expressLayouts)
app.set("view engine" ,"ejs")

//body parser
app.use(express.urlencoded({extended : true}))

//express session
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//global var middleware
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//serving static files
app.use(express.static('public'))

app.use('/', require('./routes/home'))
app.use('/user', require('./routes/user'))

app.listen(port, console.log("server started at port: "+port))