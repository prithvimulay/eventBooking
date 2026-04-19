const express = require('express');
const router = express.Router();
const service = require('./events.service');
const requireRole = require('../../middlewares/requireRole');

router.use(requireRole('ORGANIZER')); // Guards the entire router

router.post('/', async (req, res) => {
  try { res.status(201).json(await service.createEvent(req.user.id, req.body)); } 
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  try { res.status(200).json(await service.getOrganizerEvents(req.user.id)); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try { res.status(200).json(await service.getEventById(req.params.id, req.user.id)); } 
  catch (err) { res.status(404).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try { res.status(200).json(await service.updateEvent(req.params.id, req.user.id, req.body)); } 
  catch (err) { res.status(403).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try { await service.deleteEvent(req.params.id, req.user.id); res.status(204).send(); } 
  catch (err) { res.status(403).json({ error: err.message }); }
});

module.exports = router;