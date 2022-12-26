require('dotenv').config()
require('./config/db').connect()
const express = require('express')
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

//routes middleware
app.use("/api/v1", user)

module.exports = app