/**
 * Created by Gilles-Laptop on 3/03/2016.
 */


window.addEventListener("DOMContentLoaded", function () { init() });

//globale vars
    //Css
    var csspath = "css/FeedbackStyleV2.css";
    //path to img folder
    var img = "img/";
    //html2canvas library inladen
    var html2canvaspath = "js/html2canvas.js";

function init() {

    //css inladen
    loadcss();

    //button send feedback aanmaken
    createButton();

    //html2canvas inladen
    loadhtml2canvas();

    //button done highlighting aanmaken
    readyButton();

    //ophalen van alle achtergrondinformatie
    getBackgroundinfo();


    document.getElementById("feedbackbtn").onclick = function () {



        var myElem = document.getElementById('feedbackmodal');
        if (myElem === null) {

            //Add overlay div to the html
            var feedbackmodal = document.createElement("div");
            feedbackmodal.id = "feedbackmodal";
            feedbackmodal.className = "feedbackmodal";
            document.body.appendChild(feedbackmodal);
            document.getElementById("feedbackmodal").style.visibility = "visible";

        } else {
            document.getElementById("feedbackmodal").style.visibility = "visible";
        }

        //Put html code in the feedbackmodal div
        document.getElementById("feedbackmodal").innerHTML = "" +
            "<div id='modalcontent'>" +
            "<div class='modalHeader'>Feedback</div>" +
            "<form method='post' id='feedbackform' novalidate>" +
            "<div class='modalContent'>" +
            "<label for='Subject'>Subject</label>" +
            "<input type='text' id='Subject' name='Subject' placeholder='Subject' required />" +

            "<label for='Subject'>Description</label>" +
            "<textarea rows='5' id='Description' name='Description' placeholder='Description' required></textarea>" +

            "<label for='Type'>Type</label>" +
            "<select id='Type' name='Type'>" +
            "<option value='Question'>Question</option>" +
            "<option value='Bug' selected>Problem/Bug</option>" +
            "<option value='Request'>Request</option>" +
            "</select>" +

            "<label for='Priority'>Priority</label>" +
            "<select id='Priority' name='Priority'>" +
            "<option value='Blocking'>Blocking</option>" +
            "<option value='Critical'>Critical</option>" +
            "<option value='High'>High</option>" +
            "<option value='Medium' selected>Medium</option>" +
            "<option value='Low'>Low</option>" +
            "</select>" +
            //"<div id='screenshotbutton' class='button'><img class='icon' src=" + img + "picture.png>Screenshot</div>" +
            //"<div id='highlitebutton' class='button'><img class='icon' src=" + img + "pencil.png>Highlight</div>" +
            "<div id='screenshotsContainer'></div>" +
            "</div>" +
            "<div class='modalFooter'>" +
            "<div id='closeModal' class='button'>Close</div>" +
            "<button type='submit' id='submitModal' class='button buttonprimary'>Send</button>" +
            "</div>" +
            "</form>" +
            "</div>";

        //place current body classes in var
        //add "overflow: hidden;" to the body element
        bodystate = document.body.className;
        document.body.className += " bodyoverflowclass";




        document.getElementById("closeModal").onclick = function () {
            document.getElementById("feedbackmodal").style.visibility = "hidden";
            document.body.className = bodystate;
        };
        document.getElementById("submitModal").onclick = function () {
            document.getElementById("feedbackmodal").style.visibility = "hidden";
            document.body.className = bodystate;
        };



        getscreenshots();
        //document.getElementById("screenshotbutton").onclick = function () {
        function getscreenshots(){
            document.body.className = bodystate;

            document.getElementById("feedbackmodal").style.visibility = "hidden";
            document.getElementById("feedbackbtn").style.visibility = "hidden";

            //use html2canvas library to generate the html page on a canvas
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    canvas.id = "screenshotcanvasPartial";
                    var partialContainer = document.createElement("div");
                    partialContainer.id = "partialContainer";
                    partialContainer.className = "screenshot";
                    document.getElementById("screenshotsContainer").appendChild(partialContainer);
                    var partialoverlay = document.createElement("div");
                    partialoverlay.id = "partialoverlay";
                    partialoverlay.className = "partialoverlay";
                    document.getElementById("partialContainer").appendChild(partialoverlay);

                    document.getElementById("partialoverlay").innerHTML += "<img src=" + img + "pencilWhite.png><p>Click to edit</p>";

                    document.getElementById("partialContainer").innerHTML += "<p>Screenshot from the current view</p>";
                    document.getElementById("partialContainer").appendChild(canvas);

                    var ctx=canvas.getContext("2d");
                    var content = ctx.getImageData(0,document.body.scrollTop,canvas.width, document.body.clientHeight);
                    canvas.height = document.body.clientHeight;
                    ctx=canvas.getContext("2d");
                    ctx.putImageData(content, 0, 0);
                    //-----------partial screenshot in screenshotcontainer--------------------
                    //document.getElementById("screenshotsContainer").appendChild(canvas);
                    //var ctx=canvas.getContext("2d");
                    //var content = ctx.getImageData(0,document.body.scrollTop,canvas.width, document.body.clientHeight);
                    //canvas.height = document.body.clientHeight;
                    //ctx=canvas.getContext("2d");
                    //ctx.putImageData(content, 0, 0);

                    document.getElementById("partialContainer").onclick = function () {
                        console.log("click on thumbnail from part of site");
                        DrawOnCanvas(canvas);
                    };


                }
            });
            html2canvas(document.body, {
                    onrendered: function(canvas) {
                        canvas.id = "screenshotcanvasFull";
                        var fullContainer = document.createElement("div");
                        fullContainer.id = "fullContainer";
                        fullContainer.className = "screenshot";
                        document.getElementById("screenshotsContainer").appendChild(fullContainer);


                        var fulloverlay = document.createElement("div");
                        fulloverlay.id = "fulloverlay";
                        fulloverlay.className = "fulloverlay";
                        document.getElementById("fullContainer").appendChild(fulloverlay);

                        document.getElementById("fulloverlay").innerHTML += "<img src=" + img + "pencilWhite.png><p>Click to edit</p>";

                        document.getElementById("fullContainer").innerHTML += "<p>Screenshot from the full website</p>";
                        document.getElementById("fullContainer").appendChild(canvas);

                        //-----------full screenshot in screenshotcontainer--------------------
                        //document.getElementById("screenshotsContainer").appendChild(canvas);


                        document.getElementById("fullContainer").onclick = function () {
                            console.log("click on thumbnail from fullsite");
                            DrawOnCanvas(canvas);
                        };


                    }
                });

            document.body.className += " bodyoverflowclass";
            document.getElementById("feedbackmodal").style.visibility = "visible";
            document.getElementById("feedbackbtn").style.visibility = "visible";




        };






        //document.getElementById("highlitebutton").onclick = function () {
        //    document.body.className = bodystate;
        //    document.getElementById("feedbackbtn").style.visibility = "hidden";
        //    document.getElementById("feedbackmodal").style.visibility = "hidden";
        //    document.getElementById("readyButton").style.visibility = "visible";
        //};

        document.getElementById("readyButton").onclick = function () {
            document.body.className += " bodyoverflowclass";
            //document.getElementById("feedbackbtn").style.visibility = "visible";
            document.getElementById("highlightmodal").style.visibility = "hidden";
            document.getElementById("readyButton").style.visibility = "hidden";
        };



    };
}


function loadcss(){
    var cssId = 'myCss';
    if (!document.getElementById(cssId))
    {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = csspath;
        link.media = 'all';
        head.appendChild(link);
    }
}
function loadhtml2canvas() {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = html2canvaspath;
    head.appendChild(script);
    document.body.appendChild(script);
}
function createButton(){
    var feedbackbtn = document.createElement("div");
    feedbackbtn.id = "feedbackbtn";
    feedbackbtn.className = "feedbackbtn button";
    document.body.appendChild(feedbackbtn);
    feedbackbtn.innerHTML = "<img src=" + img + "Bazookas_Logo_b.png>Send Feedback";
}
function readyButton(){
    var readyButton = document.createElement("div");
    readyButton.id = "readyButton";
    readyButton.className = "feedbackbtn button";
    document.body.appendChild(readyButton);
    readyButton.innerHTML = "Done Highlighting";
}

function DrawOnCanvas(canvas){
    //console.log(canvas);

    var myElem = document.getElementById('highlightmodal');
    if (myElem === null) {
        var highlightmodal = document.createElement("div");
        highlightmodal.id = "highlightmodal";
        highlightmodal.className = "highlightmodal";
        document.body.appendChild(highlightmodal);

        var highlightmodalinnerdiv = document.createElement("div");
        highlightmodalinnerdiv.id = "highlightmodalinnerdiv";
        highlightmodalinnerdiv.className = "highlightmodalinnerdiv";
        highlightmodal.appendChild(highlightmodalinnerdiv);


        highlightmodalinnerdiv.appendChild(canvas);
        //console.log(canvas)
    }
    document.getElementById("highlightmodal").style.visibility = "visible";
    document.getElementById("readyButton").style.visibility = "visible";
}














function getBackgroundinfo(){
    //-------------Get background information-------------
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;
    var platform = navigator.platform;

    // In Opera 15+, the true version is after "OPR/"
    if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4);
    }
    // In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!
    var yyyy = date.getFullYear();

    m = checkNumber(m);
    s = checkNumber(s);
    dd = checkNumber(dd);
    mm = checkNumber(mm);

    function checkNumber(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    date = dd + '/' + mm + '/' + yyyy;
    time = h + ":" + m + ":" + s;


    //-------------display background info-------------

    //alert(''
    //    +'Browser name  = '+browserName+'\n'
    //    +'Full version  = '+fullVersion+'\n'
    //    +'Major version = '+majorVersion+'\n'
    //    +'Browser width = '+x+'\n'
    //    +'Browser height = '+y+'\n'
    //    +'screen width = '+screen.width+'\n'
    //    +'screen height = '+screen.height+'\n'
    //    +'Location = '+window.location.href+'\n'
    //    +'Date = '+date+'\n'
    //    +'Timestamp = '+time+'\n'
    //    +'Platform = '+platform+'\n'
    //)





}




