const emitter = require('./emitter');

// Background Task 1: Booking Confirmation
emitter.on('BOOKING_CONFIRMED', (data) => {
  console.log(`[BACKGROUND JOB] 📧 Email Action: Sending booking confirmation to Customer ${data.customerId} for Event ${data.eventId} - ${data.title}. Tickets booked: ${data.ticketsCount}`);
});