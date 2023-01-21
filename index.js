const mongoose = require("mongoose");
require('dotenv').config()
const app = require('./app')
/*
    Have installed following additional dependencies:
    1) Express-Handlebars
    2) morgan
    3) express-fileupload
    4) cookie-parser
    5) nodemon
*/

app.use((req, res, next) => {
    res.header('Access-Control-ALlow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use((err, req, res, next) => {
    console.log(err);
    next();
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    },
    (err) => {
        if (err) throw err;
        else app.listen(process.env.PORT, () => {
            console.log(`Server started on PORT: ${process.env.PORT}`);
        });
    }
);