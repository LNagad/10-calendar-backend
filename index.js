const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');

const app = express();

// Database
dbConnection();

// Public dir
app.use( express.static('public') );

// Reading and parsing the body
app.use( express.json() );

// Routes
// TODO: auth // crear, login, renew
app.use( '/api/auth', require('./routes/auth') );


// TODO: CRUD: Eventos


app.listen( process.env.PORT , () => {
    console.log(`Server runnin on port: ${process.env.PORT}`);
});