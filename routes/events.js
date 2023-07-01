/* 
    User Routes / Events
    host + /api/events
*/
const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventsController');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { isDate, endDateGreaterThanStart } = require('../helpers/dateValidation');

const router = Router();

// Each route needs to go through validateJWT
router.use( validateJWT );

// Fetch events
router.get('/', getEvents);

// Create event
router.post(
    '/',
    [
        check('title', 'The title is required').notEmpty(),
        check('start', 'The start date is required').custom( isDate ),
        check('end', 'The end date is required').custom( isDate )
            .custom( endDateGreaterThanStart ).withMessage('Start date cannot be grather than end date'),

    ],
    fieldValidator, 
    createEvent
);

// Update event
router.put('/:id', updateEvent);

// Delete event
router.delete('/:id', deleteEvent);

module.exports = router;