/* 
    User Routes / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { validateJWT } = require('../middlewares/validateJWT');
const { loginUser, createUser, renewToken } = require('../controllers/authController');

const router = Router();


router.post(
    '/login', 
    [ //middlewares
        check('email', 'The email is required').isEmail(),
        check('password', 'Password must contain minimun 6 digits').isLength({ min: 6 })
    ],
    fieldValidator,
    loginUser);

router.post(
    '/signup', 
    [ //middlewares
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'The email is invalid').isEmail(),
        check('password', 'Password must contain minimun 6 digits').isLength({ min: 6 })
    ],
    fieldValidator,
    createUser);

router.get('/renew', validateJWT, renewToken);

module.exports = router;

