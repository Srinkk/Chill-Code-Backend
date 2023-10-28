const express = require('express');
const router = express.Router();
const userController =require ( '../controllers/userController')

router.route('/')
    .post(userController.createNewUser)
router.route('/login')
    .post(userController.getUserId)
router.route('/solved')
    .post(userController.getSolvedProblems)
router.route('/tried')
    .post(userController.getTriedProblems)
    
module.exports = router