var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('sessions', { title: 'MI. Movies Admin' });
});

module.exports = router;
