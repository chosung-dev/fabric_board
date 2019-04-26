

module.exports = function(){
    var ccC = {};

    // --------------------------------------------------------------------------------
    // 모든 기능을 ccC 객체에 흡수
    // --------------------------------------------------------------------------------
    const query_view = require('./parts/query_view.js')();
    for (const func in query_view) ccC[func] = query_view[func];

    const repair_board = require('./parts/repair_board.js')();
    for (const func in repair_board) ccC[func] = repair_board[func];

    const delete_board = require('./parts/delete_board.js')();
    for (const func in delete_board) ccC[func] = delete_board[func];

    const create_board = require('./parts/create_board.js')();
    for (const func in create_board) ccC[func] = create_board[func];

    const enrollAdmin = require('./enrollAdmin.js')();
    for (const func in enrollAdmin) ccC[func] = enrollAdmin[func];

    const registerUser = require('./registerUser.js')();
    for (const func in registerUser) ccC[func] = registerUser[func];


    ccC.init_user1 = function(callbackFunc){
        var testFolder = '../ccControl/wallet';
        var fs = require('fs');

        fs.readdir(testFolder, function(error, filelist){
            if(error==null){
                if(filelist.indexOf('user1')!= -1){
                    callbackFunc("Sucess");
                    return;
                }
            }
            ccC.enrollAdmin(function(value){
                ccC.registerUser();
                callbackFunc("Sucess");
            });
        });
    };

    return ccC;
};