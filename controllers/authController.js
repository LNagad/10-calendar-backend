const { request, response } = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateJWT } = require( '../helpers/jwt');


exports.loginUser = async(req = request, res = response, next) => {
    
    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        
        if ( !user ) {
            const error = new Error('Incorrect username or password');
            error.statusCode = 400;
            throw error;
        }

        // Confirm password - true - false
        const validPassword = await bcrypt.compareSync( password, user.password);
        
        if ( !validPassword ) {
            const error = new Error('Incorrect username or password');
            error.statusCode = 400;
            throw error;
        }

        // Generate JWT
        const token = await generateJWT( user._id.toString(), user.name );

        res.json({
            ok: true,
            uid: user._id.toString(),
            name: user.name,
            token
        });
        
    } catch (error) {
        next(error);
    }
  
};

exports.createUser = async(req = request, res = response, next) => {

    try {
        const { name, email, password } = req.body;
        
        let user = await User.findOne({ email });
        
        if ( user ) {
            const error = new Error('Email already in use');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT
        const token = await generateJWT( user._id.toString(), user.name );

        res.status(201).json({
            ok: true,
            uid: user._id.toString(),
            name: user.name,
            token
        });

    } catch (error) {
        next(error);
    }
};

exports.renewToken = async(req = request, res = response) => {
    
    const { uid, name } = req;
    
    // Generate new token
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        token
    });
};
