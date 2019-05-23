

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

    const enrollAdmin3 = require('./enrollAdmin_org3.js')();
    for (const func in enrollAdmin3) ccC[func] = enrollAdmin3[func];

    const registerUser3 = require('./registerUser_org3.js')();
    for (const func in registerUser3) ccC[func] = registerUser3[func];


    ccC.init_user1 = function(callbackFunc){
        var testFolder = '../ccControl/wallet';
        var fs = require('fs');
        fs.readdir(testFolder, function(error, filelist){
            if(error!=null){
                //wallet 디렉토리가 없을 경우
            }
            if((filelist.indexOf('user1') == -1)){
                ccC.enrollAdmin(function(value){
                    if(value=='Success'){
                        ccC.registerUser();
                    }
                    else{
                        callbackFunc("False");
                    }
                });
            }

            if((filelist.indexOf('user3') == -1)){
                ccC.enrollAdmin3(function(value){
                    if(value=='Success'){
                        ccC.registerUser3();
                        callbackFunc("Success");
                    }
                    else{
                        callbackFunc("False");
                    }
                });
            }
            callbackFunc("Success");
        });
    };
    return ccC;
};
