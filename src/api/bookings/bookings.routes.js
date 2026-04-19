const express = require('express');
const router = express.Router();
const bookingsController = require('./bookings.controller');
const requireRole = require('../../middlewares/requireRole');

router.post('/', requireRole('CUSTOMER'), bookingsController.create);

module.exports = router;