const express = require('express');
const router = express.Router();

const auth = require('./auth');
const ctrl = require('./controller');

// TESTS
router.get('/tests', ctrl.getTests);
router.get('/tests/:id', ctrl.getTest);

router.get('/start/:id', ctrl.startTest);
router.get('/stop/:id', ctrl.stopTest);

module.exports = router;