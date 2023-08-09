const express = require('express');
const router = express.Router();

const auth = require('./auth');
const ctrl = require('./controller');

// POST
// router.post('/select', ctrl.selectTest);
router.post('/start', ctrl.startTest);
router.post('/stop', ctrl.stopTest);

// GET
router.get('/tests', ctrl.getTests);
router.get('/tests/:id', ctrl.getTest);
router.get('/log/:id', ctrl.getTestLogById);

module.exports = router;