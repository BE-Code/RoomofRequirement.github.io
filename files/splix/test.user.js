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

function resetPatterns() {
    boxPattern = false;
    crawlPattern = false;
}

(function() {
    $.noConflict();
    window.addEventListener("load", function(){

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

        var checkCrawlKey = false;
        window.addEventListener("keyup", function(e){
            resetPatterns();
            if(!checkCrawlKey) {
                if(e.keyCode == 66) boxPattern = true;
                else if(e.keyCode == 67) checkCrawlKey = true;
            }
            else {
                if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
                    crawlPattern = true; // left 2. up 3. right 0. down 1.
                }
                checkCrawlKey = false;
            }
        });

        var curRank = 333; //Arbitrary (anything higher than 100 works fine)
        var newRank = curRank;
        var numKills = 0;
        setInterval(function(){
            newRank = Number(document.getElementById("myRank").innerHTML);
            numKills = Number(document.getElementById("myKills").innerHTML);
            if ((newRank < curRank) && (newRank != 0) && (newRank < 10)) {
                curRank = newRank;
                //alert("rank up to " + newRank);
            }
        }, 1000);

        var timer = "";
        var flasher;
        window.onblur = function() {
            flasher = setInterval(function() {
                document.title = (document.title.startsWith("Kills: ")) ? ("Rank: " + newRank) : ("Kills: " + numKills);
            }, 30000);
        }
        window.onfocus=function() {
            clearInterval(flasher);
            document.title = "Splix.io";
        }
        //alert("Your rank was " + x);
    });
})();
