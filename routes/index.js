var express = require('express');
var app = express()
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');


/* GET home page. */
router.get('/', function(req, res) {
  var ccControl = require(path.join(__dirname,'../ccControl/query_view.js'))();

  ccControl.query_view(function(border_list){

    console.log(border_list.toString());
    border_json = JSON.parse(border_list.toString());
    console.log(border_json.length);
    res.render('index', { title: 'Fabric Border', border_list: border_json});
  });
});

router.get('/createbord', function(req, res) {
  res.render('createbord', { title: 'Create Bord'});
});

router.get('/creatbord_submit', function(req, res) {
  var tittle = req.body.tittle;
  var content = req.body.content;
  console.log(tittle, content);
});


module.exports = router;
