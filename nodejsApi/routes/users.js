var express = require('express');
var router = express.Router();
var WhatsappBot = require('./whatsapp')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/talkOnWhatsapp',WhatsappBot.googleSearch);

module.exports = router;
