const moment = require('moment');

const isDate = (value, { req, location, path }) => {
    if (!value) {
        return false;
    }

    const date = moment(value);

    if ( date.isValid() ) {
        return true;
    } else {

        return false;
    }

};

const endDateGreaterThanStart = (value, { req, location, path }) => {
    const { start } = req.body;
    
    if (!value || !start) {
        return false;
    }

    const startDate = moment(start);
    const endDate = moment(value);

    const difference = endDate.diff(startDate);
    // means that the date is not ok cuz the end date is less than the start date, and this 
    //is not logical
    if ( difference < 0 ) {
        return false;
    }

    return true;
  
};

module.exports = { isDate, endDateGreaterThanStart };
