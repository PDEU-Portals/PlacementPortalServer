const mongoose = require('mongoose')

const connectDb = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log('DB got connected'))
    .catch(error => {
        console.log("Error");
        console.log(error)
        process.exit(1);
    })
}

module.exports = connectDb