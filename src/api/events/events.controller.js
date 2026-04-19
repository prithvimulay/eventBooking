const eventService = require('./events.service');

const create = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.user.id, req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.user.id, req.body);
    res.status(200).json(event);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const events = await eventService.getAvailableEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, update, getAll };