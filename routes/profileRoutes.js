const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController')

// route to set the profile(post to database)
router.post('/setProfile',profileController.profileController);

// route to get the profile(fetch from the server)
router.get('/getProfile',profileController.getProfileController);

module.exports = router;

