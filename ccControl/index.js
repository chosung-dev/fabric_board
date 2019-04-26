
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
    return ccC;
};