require('dotenv').config()
// const dotenv = require('dotenv')
// dotenv.config()
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')
const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')

const port = process.env.PORT ? process.env.PORT : '3000'

// creates a connection to MONGO database
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60 // 1 week in seconds
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        httpOnly: true,
        secure: false,
    }
}))
app.use(passUserToView)

// CONTROLLERS
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')
// const vipCtrl = require('./controllers/vip')
const applicationsCtrl = require('./controllers/applications')

// ROUTE HANDLERS
app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/auth/sign-out', authCtrl.signOut)

app.use(isSignedIn) // anything under here, the user must be signed in

// 67a1c05e7af170d98bdda837
app.get('/users/:userId/applications/new', applicationsCtrl.newApplication) // view new application form
app.post('/users/:userId/applications', applicationsCtrl.createApplication) // posting new application to the database
app.get('/users/:userId/applications', applicationsCtrl.index) // view all the applications
app.get('/users/:userId/applications/:applicationId', applicationsCtrl.show) // show details of one application
app.delete('/users/:userId/applications/:applicationId', applicationsCtrl.deleteApplication)
app.get('/users/:userId/applications/:applicationId/edit', applicationsCtrl.edit) // view an edit form
app.put('/users/:userId/applications/:applicationId', applicationsCtrl.update)

// app.get('/vip-lounge', isSignedIn, vipCtrl.welcome)

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`)
})