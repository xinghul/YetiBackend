var express = require('express');
var router = express.Router();
var player = require('./api/player');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Yeti Backend' });
});

router.get('/newplayer', function (req, res) {
    res.render('newplayer', { title: 'Add new player'});
});

router.get('/api/player', player.GetPlayer());

router.get('/api/players', player.GetPlayers());

router.post('/api/players', player.AddPlayer());

module.exports = router;
