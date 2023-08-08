// # > IMPORTS
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const routes = require('./routes');
// # < IMPORTS

// # > EXPRESS CONFIG
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// # < EXPRESS CONFIG


// app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));


// # > ROUTES
app.use('/api', routes);
// # < ROUTES


// app.get('/', (req,res) => {
//   res.sendFile(process.cwd()+"/../calzonerecords-front/src/dist/index.html");
//   // res.sendFile(path.resolve('../calzonerecords-front/src/dist/index.html'));
// });

module.exports = app;