const express = require('express');
const router = express.Router();
const userController =require ( '../controllers/userController')

router.route('/')
    .post(userController.createNewUser)
router.route('/login')
    .post(userController.getUserId)

    
module.exports = router