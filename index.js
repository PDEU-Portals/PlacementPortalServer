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
  methods: ['GET','POST','PUT','DELETE']
}))

app.options('*',cors())

// const authenticateSession = require('./middleware/authenticateSession')

// importing routes
const user = require("./routes/userRoutes")
const internalRoutes = require("./routes/internalRoutes")
const openRoutes = require("./routes/openRoutes")
const recruiterRoutes = require("./routes/recruiterRoutes");
const quizRoutes = require('./routes/quizRoutes')
const experience = require("./routes/experience")
const superAdmin = require("./routes/superAdminRoutes")
const admin = require("./routes/adminRoutes")
const upload = require("./routes/uploadRoutes")

// regular middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//cookie and file middlewares
app.use(cookieParser(process.env.COOKIE_SECRET, { signed: true }))
app.use(
  fileUpload({
    tempFileDir: "./tmp/",
    useTempFiles: true,
  })
)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use((err, req, res, next) => {
  console.log(err)
  next()
});

//logging
app.use(morgan("tiny"))

// using routes
app.use("/api/v1", user)
app.use("/api/v1/internal", internalRoutes)
app.use("/api/v1/profile", openRoutes)
app.use("/api/v1/recruiter", recruiterRoutes)
app.use("/api/v1/quiz", quizRoutes)
app.use("/api/v1/experience", experience)
app.use("/api/v1/supadmin", superAdmin)
app.use("/api/v1/admin", admin)
app.use("/api/v1/upload", upload)

// after all routes
app.get((req, res) => {
  res.status(404).json({ message: "Page not found" })
})

// function notFound(req, res) { res.status(404).json({ message: "Page not found" });}
// // If no route is matched by now, it must be a 404
// app.get(notFound).post(notFound).put(notFound).patch(notFound).delete(notFound);

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
);