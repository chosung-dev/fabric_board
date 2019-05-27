var express = require('express');
var router = express.Router();
var path = require('path');
var user = 'user1';
var ccControl = require(path.join(__dirname,'../ccControl/index.js'))();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.query.user!=null){
      user = req.query.user;
  }
  ccControl.query_view(user, function(board_list){
    board_json = JSON.parse(board_list.toString());
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
            board_json = JSON.parse(board_list.toString());
            res.render('index', { title: 'Fabric Board', board_list: board_json, user:user});
        });
    });
});

router.get('/delete', function(req, res) {
    console.log(req.query.board_id);
    ccControl.delete_board(req.query.board_id, function(value){
        ccControl.query_view(user, function(board_list){
            board_json = JSON.parse(board_list.toString());
            res.render('index', { title: 'Fabric Board', board_list: board_json, user:user});
        });
    })
});

router.get('/repair', function(req, res) {
    res.render('repairboard', { title: 'Change Board',board_id: req.query.board_id, board_title: req.query.board_title, board_content:req.query.board_content});
});

router.get('/repairboard_submit', function(req, res) {
    var id = req.query.id;
    var tittle = req.query.tittle;
    var content = req.query.content;
    ccControl.repair_board(id, tittle, content,function(value){
        ccControl.query_view(user, function(board_list){
            board_json = JSON.parse(board_list.toString());
            res.render('index', { title: 'Fabric Board', board_list: board_json, user:user});
        });
    });
});

module.exports = router;
