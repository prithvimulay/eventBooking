const express = require('express');
const organizerEventRoutes = require('./api/events/organizer.events.routes');
const customerEventRoutes = require('./api/events/customer.events.routes');
const bookingRoutes = require('./api/bookings/bookings.routes');

require('./jobs/email.worker');
require('./jobs/notification.worker');

const app = express();
app.use(express.json());

// The explicit namespace mounting you requested
app.use('/api/organizer/events', organizerEventRoutes);
app.use('/api/customer/events', customerEventRoutes);
app.use('/api/customer/bookings', bookingRoutes); // Adjusted booking route namespace

module.exports = app;