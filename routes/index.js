var express = require('express');
var router = express.Router();
var path = require('path');
var user = 'user1';
var ccControl = require(path.join(__dirname,'../ccControl/index.js'))();
var by = function(name) {
    return function(o, p) {
        var a, b;
        if (typeof o === 'object' && typeof p === 'object' && o && p) {
            a = Number(o[name].substring(5));
            b = Number(p[name].substring(5));
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        } else {
            throw {
                name : 'Error',
                message : 'Expected an object when sorting by ' + name
            };
        }
    };
};

/* GET home page. */
router.get('/', function(req, res) {
  if(req.query.user!=null){
      user = req.query.user;
  }
  ccControl.query_view(user, function(board_list){
      board_json = JSON.parse(board_list.toString()).sort(by('Key'));
      res.render('index', { title: 'Fabric Board', board_list: board_json, user:user});
  });
});


router.get('/createboard', function(req, res) {
  res.render('createboard', { title: 'Create Board'});
});

router.get('/creatboard_submit', function(req, res) {
    var tittle = req.query.tittle;
    var content = req.query.content;
    ccControl.create_board(user, tittle, content,function(value){
        ccControl.query_view(user, function(board_list){
            board_json = JSON.parse(board_list.toString()).sort(by('Key'));
            res.render('index', { title: 'Fabric Board', board_list: board_json, user:user});
        });
    });
});

router.get('/delete', function(req, res) {
    console.log(req.query.board_id);
    ccControl.delete_board(req.query.board_id, function(value){
        ccControl.query_view(user, function(board_list){
            board_json = JSON.parse(board_list.toString()).sort(by('Key'));
            res.render('index', { title: 'Fabric Board', board_list: board_json, user:user});
        });
    })
});

router.get('/repair', function(req, res) {
    res.render('repairboard', { title: 'Change Board',board_id: req.query.board_id, board_title: req.query.board_title, board_content:req.query.board_content, board_collection: req.query.board_collection});
});

router.get('/repairboard_submit', function(req, res) {
    var id = req.query.id;
    var tittle = req.query.tittle;
    var content = req.query.content;
    var collection = req.query.collection;
    ccControl.repair_board(user, id, tittle, content, collection,function(value){
        ccControl.query_view(user, function(board_list){
            board_json = JSON.parse(board_list.toString()).sort(by('Key'));
            res.render('index', { title: 'Fabric Board', board_list: board_json, user:user});
        });
    });
});

module.exports = router;

