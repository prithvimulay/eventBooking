const express = require('express');
const router = express.Router();
const service = require('./events.service');
const requireRole = require('../../middlewares/requireRole');

router.use(requireRole('CUSTOMER')); 

router.get('/', async (req, res) => {
  try { res.status(200).json(await service.getAvailableEvents()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try { res.status(200).json(await service.getEventById(req.params.id)); } 
  catch (err) { res.status(404).json({ error: err.message }); }
});

module.exports = router;