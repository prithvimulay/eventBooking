const emitter = require('./emitter');
const prisma = require('../config/db');

// Background Task 2: Event Update Notification
emitter.on('EVENT_UPDATED', async (data) => {
  try {
    // Find all unique customers who booked this event
    const bookings = await prisma.booking.findMany({
      where: { eventId: data.eventId },
      select: { customerId: true },
      distinct: ['customerId']
    });

    bookings.forEach(booking => {
      console.log(`[BACKGROUND JOB] 🔔 Notification: Alerting Customer ${booking.customerId} about updates to Event ${data.eventId}.`);
    });
  } catch (error) {
    console.error(`[BACKGROUND JOB ERROR] Failed to send notifications:`, error);
  }
});