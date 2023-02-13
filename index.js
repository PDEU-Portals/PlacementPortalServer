const express = require("express")
require("dotenv").config()
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const morgan = require("morgan")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

// const authenticateSession = require('./middleware/authenticateSession')

// importing routes
const user = require("./routes/userRoutes")
const internalRoutes = require("./routes/internalRoutes")
const openRoutes = require("./routes/openRoutes")

// regular middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//cookie and file middlewares
app.use(cookieParser(process.env.COOKIE_SECRET, {signed: true}))
app.use(
  fileUpload({
    tempFileDir: "./tmp/",
    useTempFiles: true,
  })
)

app.use((req, res, next) => {
  // res.header("Access-Control-ALlow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header('Access-Control-Allow-Credentials', 'true');
  next()
})

app.use((err, req, res, next) => {
  console.log(err)
  next()
})

//logging
app.use(morgan("tiny"))

// using routes
app.use("/api/v1", user)
app.use("/api/v1/internal", internalRoutes)
app.use("/api/v1/profile", openRoutes)

// after all routes
app.get((req, res) => {
  res.status(404).json({message: "Page not found"})
})
/*
    Have installed following additional dependencies:
    1) Express-Handlebars
    2) morgan
    3) express-fileupload
    4) cookie-parser
    5) nodemon
*/

mongoose.set("strictQuery", true)
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err)
    } else {
      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
      })
    }
  }
)
