const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')

const app = express()

// regular middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//cookie and file middlewares
app.use(cookieParser())
app.use(
    fileUpload({
        tempFileDir: "./tmp/",
        useTempFiles: true,
    })
)

//logging
app.use(morgan('tiny'))

//routes
const user = require("./routes/userRoutes")
const quiz = require('./routes/quiz')
const question = require('./routes/question')
//routes middleware
app.use("/api/v1", user)
app.use('/api/v1', quiz)
app.use('/api/v1', question)

module.exports = app