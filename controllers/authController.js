const { request, response } = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const loginUser = (req = request, res = response) => {
    
    const { email, password } = req.body;

    res.json({
        ok: true,
        msg: 'login',
        user: { email, password }
    });
};

const createUser = async(req = request, res = response) => {

    try {
        const { name, email, password } = req.body;
        
        let user = await User.findOne({ email });
        
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already in use'
            });
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        user = new User({ name, email, password: hashedPassword });
        await user.save();
    
        res.status(201).json({
            ok: true,
            uid: user._id.toString(),
            name: user.name
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please communicate with the administrator'
        });
    }
};

const renewToken = (req = request, res = response) => {

    res.json({
        ok: true,
        msg: 'renew'
    });
};

module.exports = {
    createUser, loginUser, renewToken
};