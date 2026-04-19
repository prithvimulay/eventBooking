const prisma = require('../../config/db');
const emitter = require('../../jobs/emitter');

// --- ORGANIZER LOGIC ---
const createEvent = async (organizerId, data) => {
  return await prisma.event.create({
    data: { ...data, availableTickets: data.totalTickets, organizerId }
  });
};

const getOrganizerEvents = async (organizerId) => {
  return await prisma.event.findMany({ where: { organizerId }, orderBy: { date: 'asc' } });
};

const getEventById = async (eventId, organizerId = null) => {
  const whereClause = organizerId ? { id: eventId, organizerId } : { id: eventId };
  const event = await prisma.event.findFirst({ where: whereClause });
  if (!event) throw new Error('Event not found or unauthorized');
  return event;
};

const updateEvent = async (eventId, organizerId, data) => {
  await getEventById(eventId, organizerId); // Validates ownership
  const updatedEvent = await prisma.event.update({ where: { id: eventId }, data });
  emitter.emit('EVENT_UPDATED', { eventId });
  return updatedEvent;
};

const deleteEvent = async (eventId, organizerId) => {
  await getEventById(eventId, organizerId); // Validates ownership
  return await prisma.event.delete({ where: { id: eventId } });
};

// --- CUSTOMER LOGIC ---
const getAvailableEvents = async () => {
  return await prisma.event.findMany({
    where: { availableTickets: { gt: 0 } },
    orderBy: { date: 'asc' }
  });
};

module.exports = { 
  createEvent, getOrganizerEvents, getEventById, updateEvent, deleteEvent, getAvailableEvents 
};