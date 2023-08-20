const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');

const app = express();

//CORS
// const corsOptions = {
//     origin: ['http://localhost:5173', 'https://lnagad.github.io']
// };
  
// app.use(cors(corsOptions));
app.use(cors());
  
// Database
dbConnection();

// Public dir
app.use( express.static('public') );

// Reading and parsing the body
app.use( express.json() );

// Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// App Error middleware
app.use((error, req, res, next) => {
    console.log(error);
    
    const message = error?.message || 'Please communicate with the administrator';
    // const data = error?.data;
    const status = error?.statusCode || 500;

    res.status(status).json({
        ok: false,
        msg: message
    });
});

app.listen( process.env.PORT , () => {
    console.log(`Server runnin on port: ${process.env.PORT}`);
});