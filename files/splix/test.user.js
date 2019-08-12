// ==UserScript==
// @name         test
// @description  testing features for splibo
// @namespace    roomofrequirement.gq
// @author       BE-Code
// @version      1.1
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        *://splix.io/*
// ==/UserScript==

var boxPattern = false;
var crawlPattern = false;
var freeCrawl = false;

function resetPatterns() {
    boxPattern = false;
    crawlPattern = false;
    freeCrawl = false;
}


(function() {
    $.noConflict();
    window.addEventListener("load", function(){


        // Define Patterns
        setInterval(function(){
            if(boxPattern) {
                sendDir((myPlayer.dir + 1) % 4);
            }
        }, 100);

        setInterval(function(){
            if(crawlPattern) {
                sendDir((myPlayer.dir + 1) % 4);
                setTimeout(function(){
                    sendDir((myPlayer.dir + 1) % 4);
                }, 100);
            }
        }, 450);

        var freeCrawlDir = 0;
        setInterval(function(){
            if(freeCrawl) {
                sendDir(4);
                setTimeout(function(){
                    sendDir((freeCrawlDir + 1) % 4);
                }, 100);
            }
        }, 30000);


        // Check Keys
        var checkCrawlKey = false;
        window.addEventListener("keyup", function(e){
            if (e.keyCode != 79) resetPatterns();
            if (!checkCrawlKey) {
                if (e.keyCode == 80) sendDir(4);
                else if (e.keyCode == 66) boxPattern = true;
                else if (e.keyCode == 67) checkCrawlKey = true;
            }
            else {
                if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) crawlPattern = true; // left 2. up 3. right 0. down 1.
                else if (e.keyCode == 67) {
                    crawlPattern = true;
                    freeCrawl = true;
                }
                checkCrawlKey = false;
            }
        });


        // Title Bar
        var curRank = 0;
        var totalRanks = 0;
        var numKills = 0;
        setInterval(function() {
            curRank = Number(document.getElementById("myRank").innerHTML);
            totalRanks = Number(document.getElementById("totalPlayers").innerHTML);
            numKills = Number(document.getElementById("myKills").innerHTML);
            document.title = (document.title.startsWith("Kills: ")) ? ("Rank: " + curRank + " / " + totalRanks) : ("Kills: " + numKills);
        }, 10000);
        //on death notify ("Your rank was " + x);
    });
})();
