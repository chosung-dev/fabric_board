var express = require('express');
var router = express.Router();
var path = require('path');

var ccControl = require(path.join(__dirname,'../ccControl/index.js'))();

/* GET home page. */
router.get('/', function(req, res) {

  ccControl.query_view(function(border_list){
    border_json = JSON.parse(border_list.toString());
    res.render('index', { title: 'Fabric Border', border_list: border_json});
  });
});

router.get('/createbord', function(req, res) {
  res.render('createbord', { title: 'Create Bord'});
});

router.get('/creatbord_submit', function(req, res) {
    var tittle = req.query.tittle;
    var content = req.query.content;

    ccControl.create_bord(tittle, content,function(border_list){
        ccControl.query_view(function(border_list){
            border_json = JSON.parse(border_list.toString());
            res.render('index', { title: 'Fabric Border', border_list: border_json});
        });
    });
});

router.get('/remove', function(req, res) {
    console.log(req.query.border_id);
});

router.get('/repair', function(req, res) {
    res.render('repairbord', { title: 'Change Bord',border_id: req.query.border_id, border_title: req.query.border_title, border_content:req.query.border_content});
});

router.get('/repairbord_submit', function(req, res) {
    var id = req.query.id;
    var tittle = req.query.tittle;
    var content = req.query.content;

    ccControl.repair_bord(id, tittle, content,function(border_list){
        ccControl.query_view(function(border_list){
            border_json = JSON.parse(border_list.toString());
            res.render('index', { title: 'Fabric Border', border_list: border_json});
        });
    });
});

module.exports = router;
