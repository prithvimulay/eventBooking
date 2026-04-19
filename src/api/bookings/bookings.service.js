const prisma = require('../../config/db');
const emitter = require('../../jobs/emitter');

const createBooking = async (customerId, eventId, ticketsCount) => {
  // Use Prisma transaction to ensure atomic operations and prevent race conditions
  return await prisma.$transaction(async (tx) => {
    // 1. Atomically decrement tickets. Will fail if not enough tickets exist.
    const event = await tx.event.update({
      where: {
        id: eventId,
        availableTickets: { gte: ticketsCount } // Optimistic lock condition
      },
      data: {
        availableTickets: { decrement: ticketsCount }
      }
    }).catch(() => {
      throw new Error('Not enough tickets available');
    });

    // 2. Create the booking record
    const booking = await tx.booking.create({
      data: {
        ticketsCount,
        eventId,
        customerId
      }
    });

    // Trigger Background Task 1
    emitter.emit('BOOKING_CONFIRMED', {
      customerId,
      eventId,
      title: event.title,
      ticketsCount
    });

    return booking;
  });
};

module.exports = { createBooking };