// docReady function is defined in utilities.js. It ensures cross-browser compatible
// on document ready initialisation
docReady(function() {
  feedbackModule.init();
});

var feedbackModule = (function() {
    var cssPath = "css/FeedbackStyleV2.css",
        img = "img/", //path to img folder
        html2CanvasPath = "js/html2canvas.js", // path to html2canvas library
        head; // head DOM element

    function loadCss() {
      var cssId = 'myCss';
      if (!document.getElementById(cssId)) {
        head = head || document.getElementsByTagName('head')[0];

        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssPath;
        link.media = 'all';
        head.appendChild(link);
      }
    }

    function loadHtml2Canvas() {
      head = head || document.getElementsByTagName('head')[0];
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = html2CanvasPath;
      head.appendChild(script);
      document.body.appendChild(script);
    }

    function createButton() {
      var feedbackBtn = document.createElement("div");
      feedbackBtn.id = "feedbackBtn";
      feedbackBtn.className = "feedbackBtn button";
      document.body.appendChild(feedbackBtn);
      feedbackBtn.innerHTML = "<img src=" + img + "Bazookas_Logo_b.png>Send Feedback";
    }

    function createReadyButton() {
      var readyButton = document.createElement("div");
      readyButton.id = "readyButton";
      readyButton.className = "feedbackBtn button";
      document.body.appendChild(readyButton);
      readyButton.innerHTML = "Done Highlighting";
    }


    //function DrawOnCanvas(canvas) {
    //  var myElem = document.getElementById('highlightModal');
    //  if (myElem === null) {
    //    var highlightModal = document.createElement("div");
    //    highlightModal.id = "highlightModal";
    //    highlightModal.className = "highlightModal";
    //    document.body.appendChild(highlightModal);
//
    //    var highlightModalInnerdiv = document.createElement("div");
    //    highlightModalInnerdiv.id = "highlightModalInnerdiv";
    //    highlightModalInnerdiv.className = "highlightModalInnerdiv";
    //    highlightModal.appendChild(highlightModalInnerdiv);
//
//
    //    highlightModalInnerdiv.appendChild(canvas);
    //  }
    //  document.getElementById("highlightModal").style.visibility = "visible";
    //  document.getElementById("readyButton").style.visibility = "visible";
    //}

    function DrawOnCanvas(canvas){
      var myElem = document.getElementById('highlightModal');
      if (myElem === null ) {
        var highlightModal = document.createElement("div");
        highlightModal.id = "highlightModal";
        highlightModal.className = "highlightModal";
        document.body.appendChild(highlightModal);

        var highlightModalInnerdiv = document.createElement("div");
        highlightModalInnerdiv.id = "highlightModalInnerdiv";
        highlightModalInnerdiv.className = "highlightModalInnerdiv";
        highlightModal.appendChild(highlightModalInnerdiv);

        var copiedCanvas = cloneCanvas(canvas);
        highlightModalInnerdiv.appendChild(copiedCanvas);


      }else{
        var modalInnerDiv = document.getElementById("highlightModalInnerdiv");
        modalInnerDiv.removeChild(document.getElementById("zoomedCanvas"));
        var copiedCanvas = cloneCanvas(canvas);

        modalInnerDiv.appendChild(copiedCanvas);
      }
      function cloneCanvas(oldCanvas) {

        //create a new canvas
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');

        //set dimensions
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        newCanvas.id = "zoomedCanvas";

        //apply the old canvas to the new one
        context.drawImage(oldCanvas, 0, 0);

        //return the new canvas
        return newCanvas;
      }
      document.getElementById("highlightModal").style.visibility = "visible";
      document.getElementById("readyButton").style.visibility = "visible";
    }




    function getBackgroundInfo() {
      //-------------Get background information-------------
      //var browserVersion = navigator.appVersion; // TODO betere variabele namen. Code moet leesbaar zijn, nVer zegt niets. DONE
      var userAgent = navigator.userAgent; // TODO zelfde als hierboven DONE
      var browserName = navigator.appName;
      var fullVersion = '' + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset;
      //var ix; // TODO ix? DONE
      var platform = navigator.platform;

      // In Opera 15+, the true version is after "OPR/"
      if ((verOffset = userAgent.indexOf("OPR/")) != -1) {
        browserName = "Opera";
        fullVersion = userAgent.substring(verOffset + 4);
      }
      // In older Opera, the true version is after "Opera" or after "Version"
      else if ((verOffset = userAgent.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = userAgent.substring(verOffset + 6);
        if ((verOffset = userAgent.indexOf("Version")) != -1)
          fullVersion = userAgent.substring(verOffset + 8);
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset = userAgent.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = userAgent.substring(verOffset + 5);
      }
      // In Chrome, the true version is after "Chrome"
      else if ((verOffset = userAgent.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = userAgent.substring(verOffset + 7);
      }
      // In Safari, the true version is after "Safari" or after "Version"
      else if ((verOffset = userAgent.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = userAgent.substring(verOffset + 7);
        if ((verOffset = userAgent.indexOf("Version")) != -1)
          fullVersion = userAgent.substring(verOffset + 8);
      }
      // In Firefox, the true version is after "Firefox"
      else if ((verOffset = userAgent.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = userAgent.substring(verOffset + 8);
      }
      // In most other browsers, "name/version" is at the end of userAgent
      else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) <
        (verOffset = userAgent.lastIndexOf('/'))) {
        browserName = userAgent.substring(nameOffset, verOffset);
        fullVersion = userAgent.substring(verOffset + 1);
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

      // TODO better variable names. Why use d = document here when you use document without this variable elsewhere in this file?
      // Also, read up on variable hoisting in javascript. Better to declare all variables at the top of this scope. (function block)
      // read: http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html
      // I've replaced all your below code with a more concise example, but kept the old version in comment so you
      // could compare. 12 less variables. Code becomes a bit less readable, but a comment can fix that.
      // Note: For an even more concise solution, you could just use the build-in toString method, which will return
      // a date/time in the format DDD MMM dd yyyy hh:mm:ss Z. For example: Wed Jul 28 1993 14:39:07 GMT-0600 (PDT)

      /*
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

      // TODO you only check these four variables. Why declare the other variables above?
      // I've added a much smaller, faster way below to get the same result
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
      */

      var date = new Date();
      function checkNumber(i) {
        return (i < 10) ? '0' + i : i;
      }

      // Format the current time in the following format: hh:mm:ss
      time = date.getHours() + ':' + checkNumber(date.getMinutes()) + ':' + checkNumber(date.getSeconds());
      // Format the current date in the following format: dd/mm/yyyy
      date = checkNumber(date.getDate()) + '/' + checkNumber(date.getMonth() + 1) + '/' + date.getFullYear();

      var BrowserWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
      var BrowserHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

      alert(''
        +'Browser name  = '+browserName+'\n'
        +'Full version  = '+fullVersion+'\n'
        +'Major version = '+majorVersion+'\n'
        +'Browser width = '+BrowserWidth+'\n'
        +'Browser height = '+BrowserHeight+'\n'
        +'screen width = '+screen.width+'\n'
        +'screen height = '+screen.height+'\n'
        +'Location = '+window.location.href+'\n'
        +'Date = '+date+'\n'
        +'Timestamp = '+time+'\n'
        +'Platform = '+platform+'\n'
      )

    }

    var init = function() {

      //css inladen
      loadCss(); // TODO Camelcasing! DONE

      //button send feedback aanmaken
      createButton();

      //html2canvas inladen
      loadHtml2Canvas(); // TODO Camelcasing! DONE

      //button done highlighting aanmaken
      createReadyButton();

      //ophalen van alle achtergrondinformatie
      getBackgroundInfo(); // TODO Camelcasing! DONE

      document.getElementById("feedbackBtn").onclick = function() {
        var myElem = document.getElementById('feedbackModal');
        if (myElem === null) {
          //Add overlay div to the html
          var feedbackModal = document.createElement("div");
          feedbackModal.id = "feedbackModal";
          feedbackModal.className = "feedbackModal";
          document.body.appendChild(feedbackModal);
        }
        document.getElementById("feedbackModal").style.visibility = "visible";

        //Put html code in the feedbackModal div
        document.getElementById("feedbackModal").innerHTML = "" +
          "<div id='modalContent'>" +
          "<div class='modalHeader'>Feedback</div>" +
          "<form method='post' id='feedbackForm' novalidate>" +
          "<div class='modalBody'>" +
          "<label for='Subject'>Subject</label>" +
          "<input type='text' id='Subject' name='Subject' placeholder='Subject' required />" +

          "<label for='Subject'>Description</label>" +
          "<textarea rows='5' id='Description' name='Description' placeholder='Description' required></textarea>" +

          "<label for='Type'>Type</label>" +
          "<select id='Type' name='Type'>" +
          "<option value='1' selected>Bug</option>" +
          "<option value='2'>New feature</option>" +
          "<option value='4'>Improvement</option>" +
          "<option value='10200'>Support</option>" +
          "<option value='10401'>Change</option>" +
          "</select>" +

          "<label for='Priority'>Priority</label>" +
          "<select id='Priority' name='Priority'>" +
          "<option value='1'>Highest</option>" +
          "<option value='2'>High</option>" +
          "<option value='3' selected>Medium</option>" +
          "<option value='4'>Low</option>" +
          "<option value='5'>Lowest</option>" +
          "<option value='10000'>On hold</option>" +
          "</select>" +
          //"<div id='screenshotbutton' class='button'><img class='icon' src=" + img + "picture.png>Screenshot</div>" +
          //"<div id='highlitebutton' class='button'><img class='icon' src=" + img + "pencil.png>Highlight</div>" +
          "<div id='screenshotsContainer'></div>" +
          "</div>" +
          "<div class='modalFooter'>" +
          "<div id='closeModal' class='button'>Close</div>" +
          "<button type='submit' id='submitModal' class='button buttonPrimary'>Send</button>" +
          "</div>" +
          "</form>" +
          "</div>";

        //place current body classes in var
        //add "overflow: hidden;" to the body element
        bodystate = document.body.className;
        document.body.className += " bodyOverflowClass";

        document.getElementById("closeModal").onclick = function() {
          document.getElementById("feedbackModal").style.visibility = "hidden";
          document.body.className = bodystate;
        };
        document.getElementById("submitModal").onclick = function() {
          document.getElementById("feedbackModal").style.visibility = "hidden";
          document.body.className = bodystate;
        };

        getScreenshots();
        //document.getElementById("screenshotbutton").onclick = function () {
        function getScreenshots() {  // TODO Camelcasing! DONE
          document.body.className = bodystate;

          document.getElementById("feedbackModal").style.visibility = "hidden";
          document.getElementById("feedbackBtn").style.visibility = "hidden";

          //use html2canvas library to generate the html page on a canvas
          html2canvas(document.body, {
            onrendered: function(canvas) {
              canvas.id = "screenshotcanvasPartial";
              var partialContainer = document.createElement("div");
              partialContainer.id = "partialContainer";
              partialContainer.className = "screenshot";
              document.getElementById("screenshotsContainer").appendChild(partialContainer);
              var partialOverlay = document.createElement("div");
              partialOverlay.id = "partialOverlay";
              partialOverlay.className = "partialOverlay";
              document.getElementById("partialContainer").appendChild(partialOverlay);

              document.getElementById("partialOverlay").innerHTML += "<img src=" + img + "pencilWhite.png><p>Click to edit</p>";

              document.getElementById("partialContainer").innerHTML += "<p>Screenshot from the current view</p>";
              document.getElementById("partialContainer").appendChild(canvas);

              var ctx = canvas.getContext("2d");
              var content = ctx.getImageData(0, document.body.scrollTop, canvas.width, document.body.clientHeight);
              canvas.height = document.body.clientHeight;
              ctx = canvas.getContext("2d");
              ctx.putImageData(content, 0, 0);
              document.getElementById("partialContainer").onclick = function() {
                DrawOnCanvas(canvas);
              };
            }
          });

          html2canvas(document.body, {
            onrendered: function(canvas) {
              canvas.id = "screenshotCanvasFull";
              var fullContainer = document.createElement("div");
              fullContainer.id = "fullContainer";
              fullContainer.className = "screenshot";
              document.getElementById("screenshotsContainer").appendChild(fullContainer);


              var fullOverlay = document.createElement("div");
              fullOverlay.id = "fullOverlay";
              fullOverlay.className = "fullOverlay";
              document.getElementById("fullContainer").appendChild(fullOverlay);

              document.getElementById("fullOverlay").innerHTML += "<img src=" + img + "pencilWhite.png><p>Click to edit</p>";

              document.getElementById("fullContainer").innerHTML += "<p>Screenshot from the full website</p>";
              document.getElementById("fullContainer").appendChild(canvas);

              //-----------full screenshot in screenshotcontainer--------------------
              //document.getElementById("screenshotsContainer").appendChild(canvas);
              document.getElementById("fullContainer").onclick = function() {
                DrawOnCanvas(canvas);
              };
            }
          });

          document.body.className += " bodyOverflowClass";
          document.getElementById("feedbackModal").style.visibility = "visible";
          document.getElementById("feedbackBtn").style.visibility = "visible";
        }

        //document.getElementById("highlitebutton").onclick = function () {
        //    document.body.className = bodystate;
        //    document.getElementById("feedbackBtn").style.visibility = "hidden";
        //    document.getElementById("feedbackModal").style.visibility = "hidden";
        //    document.getElementById("readyButton").style.visibility = "visible";
        //};

        document.getElementById("readyButton").onclick = function() {
          document.body.className += " bodyOverflowClass";
          //document.getElementById("feedbackBtn").style.visibility = "visible";
          document.getElementById("highlightModal").style.visibility = "hidden";
          document.getElementById("readyButton").style.visibility = "hidden";
        };
      };
    };

    return {
      init: init
    };
  })();
