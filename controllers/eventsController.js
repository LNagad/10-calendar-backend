const { response } = require('express');
const Event = require('../models/Event');
const { CastError } = require('mongoose');

exports.getEvents = async( req, res = response, next) => {

    try {

        const events = await Event
            .find()
            .populate('user', 'name');
    
        res.status(200).json({
            ok: true,
            events    
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.createEvent = async( req, res = response, next) => {

    const { title, notes, start, end } = req.body;
    const event = new Event({ title, notes, start, end });

    try {

        event.user = req.uid;
        const savedEvent = await event.save();

        res.status(200).json({
            ok: true,
            event: savedEvent
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.updateEvent = async( req, res = response, next) => {
    const eventId = req.params.id;
    const uid = req.uid;
    
    try {

        const event = await Event.findById(eventId);

        if ( !event ) {
            const error = new Error('No event found');
            error.statusCode = 404;
            throw error;
        }

        if ( event.user.toString() !== uid ) {
            const error = new Error('You are not authorized to edit this event');
            error.statusCode = 401;
            throw error;
        }
       
        const newEvent = {
            ...req.body,
            user: uid
        };

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.status(200).json({
            ok: true,
            event: updatedEvent
        });
    } catch (error) {
        if (error instanceof CastError) {
            const castError = new Error('Invalid event ID');
            castError.statusCode = 400;
            return next(castError);
        }

        console.log(error);
        next(error);
    }
};

exports.deleteEvent = async( req, res = response, next) => {
    const eventId = req.params.id;
    const uid = req.uid;
    
    try {
        
        const event = await Event.findById(eventId);

        if ( !event ) {
            const error = new Error('No event found');
            error.statusCode = 404;
            throw error;
        }

        if ( event.user.toString() !== uid ) {
            const error = new Error('You are not authorized to delete this event');
            error.statusCode = 401;
            throw error;
        }

        await Event.findByIdAndDelete( eventId );

        res.status(200).json({
            ok: true,
            msg: 'Event has been sucessfully deleted'
        });
        
    } catch (error) {
        if (error instanceof CastError) {
            const castError = new Error('Invalid event ID');
            castError.statusCode = 400;
            return next(castError);
        }
          
        console.log(error);
        next(error);
    }
};
