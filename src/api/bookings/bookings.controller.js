const bookingService = require('./bookings.service');

const create = async (req, res) => {
  try {
    const { eventId, ticketsCount } = req.body;
    const booking = await bookingService.createBooking(req.user.id, eventId, ticketsCount);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { create };