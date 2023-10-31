const express = require('express');
const router = express.Router();
const potdController = require('../controllers/potdController')

router.route('/')
    .post(potdController.createPotd)
    .get(potdController.getPotd)
router.route('/allproblemOfTheDay')
    .get(potdController.getAllPotd)


module.exports = router