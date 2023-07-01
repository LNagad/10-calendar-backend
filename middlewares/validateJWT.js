const { response, request } = require('express');
const jwt = require('jsonwebtoken');


const validateJWT = ( req = request, res = response, next ) => {
  
    // x-token header
    const token = req.header('x-token');
    
    try {
    
        if ( !token ) {
            const error = new Error('Token was not sent');
            error.statusCode = 401;
            throw error;
        }
    
        const { uid, name } = jwt.verify( 
            token, 
            process.env.SECRET_JWT_SEED 
        );

        req.uid = uid;
        req.name = name;
    
        next();
        
    } catch (error) {
        console.log(error);
        error.statusCode = 401,
        error.message = 'Invalid token';
        next(error);
    }
};

module.exports = {
    validateJWT
};