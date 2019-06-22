var express = require('express');
var router = express.Router();

const userController = require('../controllers/users') 

/* GET users listing. */
router.post('/signup', userController.signup);

module.exports = router;
