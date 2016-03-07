/**
 * Created by Gilles-Laptop on 12/02/2016.
 */



window.addEventListener("DOMContentLoaded", function () { init() });

function init() {

    //-------------Globale vars, need to change!!!!-------------

    //css file
    var csspath = "css/feedbackStyle.css";
    var html2canvaspath = "js/html2canvas.js";

//<script src="js/html2canvas.js"></script>

    //img on feedback button
    var bimg = "img/Bazookas_Logo_b.png";
    var pinimg = "img/pin.png";



    //-------------inject css file in html-------------
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

    //-------------inject html2canvas file in html-------------

    var head  = document.getElementsByTagName('head')[0];
    var script   = document.createElement("script");
    script.type  = "text/javascript";
    script.src   = html2canvaspath;
    head.appendChild(script);
    document.body.appendChild(script);




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
    //);


    //-------------Create feedback button + form-------------
    //feedbackdiv
    var feedbackdiv = document.createElement("div");
    feedbackdiv.id = "feedbackdiv";
    feedbackdiv.className = "feedbackdiv";
    document.body.appendChild(feedbackdiv);

    //feedbackbutton
    var feedbackbtn = document.createElement("div");
    feedbackbtn.id = "feedbackbtn";
    feedbackbtn.className = "feedbackbtn";

    //feedbackform
    var feedbackform = document.createElement("div");
    feedbackform.id = "feedbackform";
    feedbackform.className = "feedbackform";


    //add elements to feedack div
    feedbackdiv.appendChild(feedbackbtn);
    feedbackbtn.innerHTML = "<img src=" + bimg + ">feedback<img id='togglepin' src=" + pinimg + ">";
    feedbackdiv.appendChild(feedbackform);
    feedbackform.innerHTML = "" +
        "<form method='post' id='feedbackform'>" +
            "<fieldset>" +
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

                "<input type='file' id='fileupload' multiple>" +

                "<input type='button' id='getScreenshot' value='Get Screenshot'>" +


                "<input type='submit' id='submitfeedback' value='Submit'>" +
            "</fieldset>" +
        "</form>";

    //-------------Click feedback button-------------
    document.getElementById("feedbackbtn").onclick = function () {
        //toggle the form between a pinned or not status
        var feedBack = document.getElementById('feedbackdiv');
        if(feedBack.className === "feedbackdiv"){
            feedBack.className = "feedbackdivPinned";
        }else if(feedBack.className === "feedbackdivPinned"){
            feedBack.className = "feedbackdiv";
        }
    };

    document.getElementById("submitfeedback").onclick = function () {
        //-------------display background info-------------

        alert(''
            +'Browser name  = '+browserName+'\n'
            +'Full version  = '+fullVersion+'\n'
            +'Major version = '+majorVersion+'\n'
            +'Browser width = '+x+'\n'
            +'Browser height = '+y+'\n'
            +'screen width = '+screen.width+'\n'
            +'screen height = '+screen.height+'\n'
            +'Location = '+window.location.href+'\n'
            +'Date = '+date+'\n'
            +'Timestamp = '+time+'\n'
            +'Platform = '+platform+'\n'
        );
    };

    //-------------render full site in canvas-------------
    function drawInCanvas(){
        //var c = document.getElementById("canvas");
        //var ctx = c.getContext("2d");
        //ctx.fillStyle = "#FF0000";
        //ctx.fillRect(0,0,150,75);



// Find the canvas element.
        canvas = document.getElementById('canvas');
        if (!canvas) {
            alert('Error: I cannot find the canvas element!');
            return;
        }

        if (!canvas.getContext) {
            alert('Error: no canvas.getContext!');
            return;
        }

        // Get the 2D canvas context.
        context = canvas.getContext('2d');
        if (!context) {
            alert('Error: failed to getContext!');
            return;
        }
        // Pencil tool instance.
        tool = new tool_pencil();

        // Attach the mousemove event handler
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mouseup',   ev_canvas, false);

// This painting tool works like a drawing pencil which tracks the mouse
        // movements.
        function tool_pencil () {
            var tool = this;
            this.started = false;

            // This is called when you start holding down the mouse button.
            // This starts the pencil drawing.
            this.mousedown = function (ev) {
                console.log(ev);
                context.beginPath();
                context.moveTo(ev._x, ev._y);
                tool.started = true;
            };

            // This function is called every time you move the mouse. Obviously, it only
            // draws if the tool.started state is set to true (when you are holding down
            // the mouse button).
            this.mousemove = function (ev) {
                if (tool.started) {
                    context.lineTo(ev._x, ev._y);
                    context.stroke();
                }
            };

            // This is called when you release the mouse button.
            this.mouseup = function (ev) {
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                }
            };
        }

        // The general-purpose event handler. This function just determines the mouse
        // position relative to the canvas element.
        function ev_canvas (ev) {
            if (ev.layerX || ev.layerX == 0) { // Firefox
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX == 0) { // Opera
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }

            ev._x *= (canvas.width / canvas.clientWidth);
            ev._y *= (canvas.height / canvas.clientHeight) + document.body.scrollTop;

            // Call the event handler of the tool.
            var func = tool[ev.type];
            if (func) {
                func(ev);
            }
        }
    }


    function overlay() {
        el = document.getElementById("overlay");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    }

    //-------------Action when users clicks the "get screenshot" button-------------
    document.getElementById("getScreenshot").onclick = function () {

        //Add overlay div to the html
        var overlay = document.createElement("div");
        overlay.id = "overlay";
        overlay.className = "overlay";
        document.body.appendChild(overlay);

        //Put html code in the overlay div
        overlay.innerHTML =  "" +
            "<div id='modalcontent'>" +
            "<p>Highlite parts of the image by drawing rectangles on it to help us locate the problem.</p>" +
            "<a href='#' id='closescreenshot'>CLOSE</a>" +
            "</div>";


        //hide feedbackstuff when taking screenshot
        document.getElementById("feedbackdiv").style.visibility = "hidden";

        //use html2canvas library to generate the html page on a canvas
        html2canvas(document.body, {
            onrendered: function(canvas) {
                //document.body.appendChild(canvas);

                var c = canvas;

                //document.getElementById("modalcontent").innerHTML = "";
                document.getElementById("modalcontent").appendChild(c);

                c.id = "canvas";
                var ctx=c.getContext("2d");

                //var xscale = (canvas.width / canvas.clientWidth);
                //var yscale = (canvas.height / canvas.clientHeight);

                var content = ctx.getImageData(0,document.body.scrollTop,canvas.width, document.body.clientHeight);
                //var content = ctx.getImageData(0,0,canvas.width, canvas.height);

                //canvas.width = canvas.clientWidth;
                //canvas.hieght = canvas.clientHeight;
                canvas.height = document.body.clientHeight;

                ctx=c.getContext("2d");
                ctx.putImageData(content, 0, 0);

                drawInCanvas();
            }
        });

        //show feedbackstuff after taking screenshot
        document.getElementById("feedbackdiv").style.visibility = "visible";

        //make the overlay div visible
        document.getElementById("overlay").style.visibility = "visible";

        //add "overflow: hidden;" to the body element
            //place current body classes in var
            bodystate = document.body.className;
        document.body.className += " bodyoverflowclass";

        //code to execute when closing modal
        document.getElementById("closescreenshot").onclick = function () {
            //make the overlay div invisible
            document.getElementById("overlay").style.visibility = "hidden";
            //Adding the original body classes to the body element
            document.body.className = bodystate;
        };
    };








}


//deel van site
//volledige site
//antekeningen maken op site
