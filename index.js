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

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT}`);
});