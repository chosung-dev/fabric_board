
module.exports = function(){
    var ccC = {};



    // --------------------------------------------------------------------------------
    // 모든 기능을 ccC 객체에 흡수
    // --------------------------------------------------------------------------------
    const query_view = require('./parts/query_view.js')();
    for (const func in query_view) ccC[func] = query_view[func];

    const repair_bord = require('./parts/repair_bord.js')();
    for (const func in repair_bord) ccC[func] = repair_bord[func];

    return ccC;
};