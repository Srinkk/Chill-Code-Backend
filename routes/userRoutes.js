const express = require('express');
const router = express.Router();
const userController =require ( '../controllers/userController')

router.route('/')
    .post(userController.createNewUser)
<<<<<<< HEAD

=======
    .patch(userController.editProfile)
>>>>>>> abffd2db0b859f3e0d1418bd1f766fe8e3933c9e
router.route('/login')
    .post(userController.getUser)
    .get(userController.autoLogin)

router.route('/googleauth')
    .post(userController.googleSignIn)

router.route('/solved')
    .post(userController.getSolvedProblems)

router.route('/tried')
    .post(userController.getTriedProblems)

module.exports = router