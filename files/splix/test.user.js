// ==UserScript==
// @name         test
// @description  testing features for splibo
// @namespace    roomofrequirement.gq
// @author       BE-Code
// @version      1.1
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        *://splix.io/*
// ==/UserScript==

(function() {
    $.noConflict();
    window.addEventListener("load", function(){
        var paused = false;
        var loop = setInterval(function(){
            if(paused) {
                sendDir((myPlayer.dir + 1)%4);
            }
        }, 100);

        window.addEventListener("keyup", function(e){
            if(e.keyCode == 86) paused ^= true;
        });

        var curRank = 333; //Arbitrary (anything higher than 100 works fine)
        var newRank = curRank;
        setInterval(function(){
            newRank = Number(document.getElementById("myRank").innerHTML);
            if ((newRank < curRank) && (newRank != 0) && (newRank < 10)) {
                curRank = newRank;
                alert("rank up to " + newRank);
            }
        }, 10000);
    });
    //alert("Your rank was " + x);
})();
