var express = require('express');
var router = express.Router();
var player = require('./apis/player');
var dBeacon = require('./apis/dBeacon');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Yeti Backend' });
});

router.get('/newplayer', function (req, res) {
    res.render('newplayer');
});

router.get('/quest', function (req, res) {
    res.render('dbeacon');
});

router.get('/player', function (req, res) {
    res.render('player');
});

router.get('/api/player', player.GetPlayer());

router.get('/api/players', player.GetPlayers());

router.post('/api/players', player.AddPlayer());

//for demo
router.post('/api/dbeacon/query', dBeacon.query);
router.post('/api/dbeacon/update', dBeacon.updateById);
router.post('/api/dbeacon/addnode', dBeacon.addNode);
router.post('/api/dbeacon/addrls', dBeacon.addRls);
router.post('/api/dbeacon/delete', dBeacon.deleteById);

router.get('/api/dbeacon/list', dBeacon.getAll);
router.get('/api/dbeacon/relation', dBeacon.getRelation);
router.get('/api/dbeacon/beacons/:_attr', dBeacon.getAttr);
router.get('/api/dbeacon/list/:_type', dBeacon.getType);

module.exports = router;
