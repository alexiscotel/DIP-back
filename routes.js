const express = require('express');
const router = express.Router();

const auth = require('./auth');
const ctrl = require('./controller');

// POST
// router.post('/select', ctrl.selectTest);
router.get('/start/:id', ctrl.startTest);
router.get('/stop/:id', ctrl.stopTest);

// GET
router.get('/tests', ctrl.getTests);
router.get('/tests/:id', ctrl.getTest);
// router.get('/log/:id', ctrl.getTestLogById);

module.exports = router;