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

    function createToolbox() {
      var Toolbox = document.createElement("div");
      Toolbox.id = "Toolbox";
      Toolbox.className = "Toolbox";
      document.body.appendChild(Toolbox);
      Toolbox.innerHTML = "<p>toolbox</p><img src=" + img + "toolboxPencil.png id='drawFree'><img src=" + img + "drawRect.png id='drawRect'>";
      //Toolbox.innerHTML = "test";
    }

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


      } else {
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

    // function used to get background information about the user's visit (browser, datetime)
    function getBackgroundInfo() {
      var browserVersion = navigator.appVersion;
      var browserName = navigator.appName;
      var userAgent = navigator.userAgent;
      var fullVersion = '' + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset;
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

      // get current date + time
      var date = new Date();
      // used to determine the day & month
      function checkNumber(i) {
        return (i < 10) ? '0' + i : i;
      }

      // Format the current time in the following format: hh:mm:ss
      time = date.getHours() + ':' + checkNumber(date.getMinutes()) + ':' + checkNumber(date.getSeconds());
      // Format the current date in the following format: dd/mm/yyyy
      date = checkNumber(date.getDate()) + '/' + checkNumber(date.getMonth() + 1) + '/' + date.getFullYear();

      var BrowserWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
      var BrowserHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

      return 'Browser name  = ' + browserName + '\n'
            +'Full version  = ' + fullVersion + '\n'
            +'Major version = ' + majorVersion + '\n'
            +'Browser width = ' + BrowserWidth + '\n'
            +'Browser height = ' + BrowserHeight + '\n'
            +'screen width = ' + screen.width + '\n'
            +'screen height = ' + screen.height + '\n'
            +'Location = ' + window.location.href + '\n'
            +'Date = ' + date + '\n'
            +'Timestamp = ' + time + '\n'
            +'Platform = ' + platform + '\n';
    }

    function createTicket(params) {
      var http = new XMLHttpRequest();
      var url = "http://localhost:8000/api/post/ticket";
      http.open("POST", url, true);

      //Send the proper header information along with the request
      http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == XMLHttpRequest.DONE) {
          var jsonResponse = JSON.parse(http.response);

          if (jsonResponse.status == "success") {
            document.getElementById("feedbackModal").style.visibility = "hidden";
            document.body.className = bodystate;
            //TODO maybe 'thank you' modal that disappears after couple seconds?
          } else if (jsonResponse.status == "error") {
            document.getElementById("submit_result").className += " error_result";
            document.getElementById("submit_result").innerText = jsonResponse.message;
            document.getElementById("submitModal").innerText = "Retry";
          }
        }
      };
      http.send(params);
    }

    var init = function() {

      //css inladen
      loadCss();

      //button send feedback aanmaken
      createButton();

      //html2canvas inladen
      loadHtml2Canvas();

      //button done highlighting aanmaken
      createReadyButton();

      //create the toolbox
      createToolbox();

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
          "<label for='email'>email</label>" +
          "<input type='email' id='email' name='email' placeholder='example@provider.com' required />" +

          "<label for='Subject'>Subject</label>" +
          "<input type='text' id='Subject' name='Subject' placeholder='Subject' required />" +

          "<label for='Subject'>Description</label>" +
          "<textarea rows='5' id='Description' name='Description' placeholder='Description' required></textarea>" +

          "<label for='Type'>Type</label>" +
          "<select id='Type' name='Type'>" +
          "<option value='Incident' selected>Incident</option>" +
          "<option value='Service Request'>Service Request</option>" +
          "</select>" +

          "<label for='Priority'>Priority</label>" +
          "<select id='Priority' name='Priority'>" +
          "<option value='1'>Laag</option>" +
          "<option value='2' selected>Gemiddeld</option>" +
          "<option value='3'>Hoog</option>" +
          "<option value='4'>Urgent</option>" +
          "</select>" +

          "<input type='hidden' name='params' id='params' required />" +

          //"<div id='screenshotbutton' class='button'><img class='icon' src=" + img + "picture.png>Screenshot</div>" +
          //"<div id='highlitebutton' class='button'><img class='icon' src=" + img + "pencil.png>Highlight</div>" +
          "<div id='screenshotsContainer'></div>" +
          "</div>" +
          "<div class='modalFooter'>" +
          "<div id='submit_result'></div>" +
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
        // TODO validate form before submitting!
        document.getElementById('feedbackForm').addEventListener("submit", submitForm);

        getScreenshots();
        //document.getElementById("screenshotbutton").onclick = function () {
        function getScreenshots() {
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
                document.getElementById("Toolbox").style.visibility = "visible";
                document.getElementById("drawFree").className += "toolboxItemClicked";
                DrawOnCanvas(canvas);
                DrawfreeInCanvas();
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
                document.getElementById("Toolbox").style.visibility = "visible";
                document.getElementById("drawFree").className += "toolboxItemClicked";
                DrawOnCanvas(canvas);
                DrawfreeInCanvas();
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
          document.getElementById("Toolbox").style.visibility = "hidden";
        };

        document.getElementById("drawFree").onclick = function() {
          document.getElementById("drawFree").className = "";
          document.getElementById("drawRect").className = "";
          document.getElementById("drawFree").className += "toolboxItemClicked";
          DrawfreeInCanvas();
        };

        document.getElementById("drawRect").onclick = function() {
          document.getElementById("drawRect").className = "";
          document.getElementById("drawFree").className = "";
          document.getElementById("drawRect").className += "toolboxItemClicked"
          DrawfreeInCanvas2();
        };


      };
    };

    return {
      init: init,
      getBackgroundInfo: getBackgroundInfo,
      createTicket: createTicket
    };
  })();




function DrawfreeInCanvas(){
// Find the canvas element.
    canvas = document.getElementById('zoomedCanvas');
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
            context.strokeStyle="magenta";
            context.lineWidth = "5";
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
        //ev._y *= (canvas.height / canvas.clientHeight) + document.body.scrollTop;
        ev._y = (ev._y * (canvas.height / canvas.clientHeight)) - (document.body.scrollTop * (canvas.height / canvas.clientHeight));
        // Call the event handler of the tool.
        var func = tool[ev.type];
        if (func) {
            func(ev);
        }
    }
}

function DrawfreeInCanvas2() {
// Find the canvas element.
  canvas = document.getElementById('zoomedCanvas');
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
  canvas.addEventListener('mouseup', ev_canvas, false);

// This painting tool works like a drawing pencil which tracks the mouse
  // movements.
  function tool_pencil() {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    var x, y, w, h;

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }

      x = Math.min(ev._x, tool.x0);
      y = Math.min(ev._y, tool.y0);
      w = Math.abs(ev._x - tool.x0);
      h = Math.abs(ev._y - tool.y0);

      var myElem = document.getElementById('temporaryRectangle');
      if (!myElem) {
        var temporaryRectangle = document.createElement("div");
        temporaryRectangle.id = "temporaryRectangle";
        temporaryRectangle.className = "temporaryRectangle";
        document.getElementById('highlightModalInnerdiv').appendChild(temporaryRectangle);
        myElem = document.getElementById('temporaryRectangle');
      }

      myElem.style.left = x * (canvas.clientWidth / canvas.width) + 'px';
      myElem.style.top = y * (canvas.clientHeight / canvas.height) + 'px';
      myElem.style.width = w * (canvas.clientWidth / canvas.width) + 'px';
      myElem.style.height = h * (canvas.clientHeight / canvas.height) + 'px';

      if (!w || !h) {
        return;
      }
      //context.globalAlpha=0.2
      //context.fillStyle="magenta";
      //context.fillRect(x, y, w, h);
      //context.strokeRect(x, y, w, h);
    };

    this.mouseup = function (ev) {
      var myElem = document.getElementById('temporaryRectangle');
      if (myElem) {
        var parent = document.getElementById("highlightModalInnerdiv");
        var child = document.getElementById("temporaryRectangle");
        parent.removeChild(child);
      }

      //console.log(x + " " + y+ " " + w+ " " + h)
      context.strokeStyle="magenta";
      context.lineWidth=5;
      context.strokeRect(x, y, w, h);
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        //img_update();
      }
    };
  }

  // The general-purpose event handler. This function just determines the mouse
  // position relative to the canvas element.
  function ev_canvas(ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

    ev._x *= (canvas.width / canvas.clientWidth);
    //ev._y *= (canvas.height / canvas.clientHeight) + document.body.scrollTop;
    ev._y = (ev._y * (canvas.height / canvas.clientHeight)) - (document.body.scrollTop * (canvas.height / canvas.clientHeight));
    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
      func(ev);
    }
  }
}

function submitForm(e) {
  e.preventDefault();
  document.getElementById("params").value = feedbackModule.getBackgroundInfo();
  var data = serializeFormData();
  feedbackModule.createTicket(data);
}

function serializeFormData() {
  return ''
      + 'description=' + document.getElementById('Description').value + '&'
      + 'subject=' + document.getElementById('Subject').value + '&'
      + 'email=' + document.getElementById('email').value + '&'
      + 'priority=' + document.getElementById('Priority').value + '&'
      + 'type=' + document.getElementById('Type').value + '&'
      + 'params=' + document.getElementById('params').value;
}