// docReady function is defined in utilities.js. It ensures cross-browser compatible
// on document ready initialisation
docReady(function() {
  feedbackModule.init();
});

var feedbackModule = (function() {
    var imgData;
    var imgDataFull;
    var imgDataFullOriginal;
    var imgDataPartial;
    var imgDataPartialOriginal;
    var imgDataFullBool;
    var imgDataPartialBool;
    var hasEventListeners = false;

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

    /*function createReadyButton() {
      var readyButton = document.createElement("div");
      readyButton.id = "readyButton";
      readyButton.className = "feedbackBtn button feedbackBtnBackground";
      document.body.appendChild(readyButton);
      readyButton.innerHTML = "<img src=" + img + "check-mark-md.png>";
    }*/

    function createToolbox() {
      var Toolbox = document.createElement("div");
      Toolbox.id = "Toolbox";
      Toolbox.className = "Toolbox";
      document.body.appendChild(Toolbox);
      Toolbox.innerHTML = "<p>toolbox</p><img src=" + img + "toolboxPencil.png id='drawFree'><img src=" + img + "drawRect.png id='drawRect'><img src=" + img + "erase.png id='erase'><img src=" + img + "check-mark-md.png id='readyButton'>";
    }

    function DrawOnCanvas(canvas){
      var myElem = document.getElementById('highlightModal');
      if (myElem === null ) {
        var highlightModal = document.createElement("div");
        highlightModal.id = "highlightModal";
        highlightModal.className = "highlightModal";
        document.body.appendChild(highlightModal);

        /*var closeDiv = document.createElement("div");
        closeDiv.id = "closeDiv";
        closeDiv.className = "closeDiv";
        //highlightModal.appendChild(closeDiv);*/

        // X close button
        var xClose = document.createElement("div");
        xClose.id = "xClose";
        xClose.className = "xClose";
        xClose.innerHTML = "<img src=" + img + "x-close.png>";
        highlightModal.appendChild(xClose);

        document.getElementById('xClose').onclick = function(){
          eventFire(document.getElementById('erase'), 'click');
          eventFire(document.getElementById('readyButton'), 'click');
        }

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

      //alert(''
      //  +'Browser name  = '+browserName+'\n'
      //  +'Full version  = '+fullVersion+'\n'
      //  +'Major version = '+majorVersion+'\n'
      //  +'Browser width = '+BrowserWidth+'\n'
      //  +'Browser height = '+BrowserHeight+'\n'
      //  +'screen width = '+screen.width+'\n'
      //  +'screen height = '+screen.height+'\n'
      //  +'Location = '+window.location.href+'\n'
      //  +'Date = '+date+'\n'
      //  +'Timestamp = '+time+'\n'
      //  +'Platform = '+platform+'\n'
      //)

    }

    var init = function() {

      //css inladen
      loadCss(); // TODO Camelcasing! DONE

      //button send feedback aanmaken
      createButton();

      //html2canvas inladen
      loadHtml2Canvas(); // TODO Camelcasing! DONE

      //button done highlighting aanmaken
      //createReadyButton();

      //create the toolbox
      createToolbox();

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

          //document.getElementById("feedbackModal").innerHTML = tmpl("item_tmpl", dataObject);

        //place current body classes in var
        //add "overflow: hidden;" to the body element
        bodystate = document.body.className;
        document.body.className += " bodyOverflowClass";

        $('#feedbackForm').on('submit', submitForm);
        document.getElementById("closeModal").onclick = function() {
          document.getElementById("feedbackModal").style.visibility = "hidden";
          document.body.className = bodystate;
        };
        document.getElementById("submitModal").onclick = function() {
          document.getElementById("feedbackModal").style.visibility = "hidden";
          document.body.className = bodystate;
          $('feedbackForm').submit();
        };
        /*if(imgData == null){
          getScreenshots();
          console.log('took screenshots');
          console.log(imgData);
        }
        else
        {
          context.putImageData(imgData, 0, 0);
          console.log('put the image data');
          console.log(imgData);
        }*/

        /*if(imgDataFull === null && imgDataPartial === null){
          getScreenshots();
        }*/

        getScreenshots();


        //getScreenshots();
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
              if(imgDataPartial != null)
              {
                //var content = ctx.putImageData(imgDataPartial, 0, 0);
                ctx = canvas.getContext("2d");
                ctx.putImageData(imgDataPartial, 0, 0);
              }
              if(imgDataPartial == null)
              {
                var content = ctx.getImageData(0, document.body.scrollTop, canvas.width, document.body.clientHeight);
                canvas.height = document.body.clientHeight;
                ctx = canvas.getContext("2d");
                ctx.putImageData(content, 0, 0);
                imgDataPartialOriginal = content;
              }
              
              document.getElementById("partialContainer").onclick = function() {
                imgDataPartialBool = true;
                document.getElementById("Toolbox").style.visibility = "visible";
                document.getElementById("drawFree").className += "toolboxItemClicked";
                DrawOnCanvas(canvas);
                DrawfreeInCanvas(hasEventListeners);

                if(imgDataPartial){
                  context.putImageData(imgDataPartial, 0, 0);
                }   
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

              var ctx = canvas.getContext("2d");
              if(imgDataFull != null)
              {
                //var content = ctx.putImageData(imgDataFull, 0, 0);
                ctx = canvas.getContext("2d");
                ctx.putImageData(imgDataFull, 0, 0);
              }
              if(imgDataFull == null)
              {
                var content = ctx.getImageData(0, 0, canvas.width, canvas.height);
                ctx = canvas.getContext("2d");
                ctx.putImageData(content, 0, 0);
                imgDataFullOriginal = content;
              }

              //-----------full screenshot in screenshotcontainer--------------------
              //document.getElementById("screenshotsContainer").appendChild(canvas);
              document.getElementById("fullContainer").onclick = function() {
                imgDataFullBool = true;
                document.getElementById("Toolbox").style.visibility = "visible";
                document.getElementById("drawFree").className += "toolboxItemClicked";
                DrawOnCanvas(canvas);
                DrawfreeInCanvas(hasEventListeners);

                if(imgDataFull){
                  context.putImageData(imgDataFull, 0, 0);
                } 
              };
            }
          });

          document.body.className += " bodyOverflowClass";
          document.getElementById("feedbackModal").style.visibility = "visible";
          // Set line in comment 
          document.getElementById("feedbackBtn").style.visibility = "visible";
        } // end of getScreenshots()

        document.getElementById("readyButton").onclick = function() {
          if(imgDataPartialBool){imgDataPartial = context.getImageData(0, 0, canvas.width, canvas.height);}
          if(imgDataFullBool){imgDataFull = context.getImageData(0, 0, canvas.width, canvas.height);}
          document.body.className += " bodyOverflowClass";
          //document.getElementById("feedbackBtn").style.visibility = "visible";
          document.getElementById("highlightModal").style.visibility = "hidden";
          document.getElementById("readyButton").style.visibility = "hidden";
          document.getElementById("Toolbox").style.visibility = "hidden";


          document.getElementById("drawFree").className = "";
          document.getElementById("drawRect").className = "";
          document.getElementById("erase").className = "";

          imgDataFullBool = false;
          imgDataPartialBool = false;

          // simulate click event in JS

          eventFire(document.getElementById('closeModal'), 'click');
          eventFire(document.getElementById('feedbackBtn'), 'click');
        };

        document.getElementById("drawFree").onclick = function() {
          document.getElementById("drawFree").className = "";
          document.getElementById("drawRect").className = "";
          document.getElementById("erase").className = "";
          document.getElementById("drawFree").className += "toolboxItemClicked";
          DrawfreeInCanvas(hasEventListeners);
        };

        document.getElementById("drawRect").onclick = function() {
          document.getElementById("drawRect").className = "";
          document.getElementById("drawFree").className = "";
          document.getElementById("erase").className = "";
          document.getElementById("drawRect").className += "toolboxItemClicked";
          DrawfreeInCanvas2(hasEventListeners);
        };

        document.getElementById("erase").onclick = function(){
          document.getElementById("drawFree").className = "";
          document.getElementById("drawRect").className = "";
          document.getElementById("erase").className = "";
          document.getElementById("drawFree").className += "toolboxItemClicked";
          if(imgDataFullBool){
            context.putImageData(imgDataFullOriginal, 0, 0);
          }
          if(imgDataPartialBool){
            context.putImageData(imgDataPartialOriginal, 0, 0);
          }
          
          DrawfreeInCanvas(hasEventListeners);
        }


      };
    };

    return {
      init: init
    };
  })();




function DrawfreeInCanvas(hasEventListeners){
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
    // if false then ...
    // Pencil tool instance.
    tool = new tool_pencil();

    if(hasEventListeners){
    canvas.removeEventListener('mousedown', ev_canvas, false);
    canvas.removeEventListener('mousemove', ev_canvas, false);
    canvas.removeEventListener('mouseup',   ev_canvas, false);
  }

    // Attach the mouse eventlisteners
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);

    hasEventListeners = true;


// This painting tool works like a drawing pencil which tracks the mouse
    // movements.
      function tool_pencil () {

        var tool = this;
        this.started = false;

        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function (ev) {
            console.log("mousedown pencil");
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
          console.log("mouseup pencil");
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


function submitForm(e) {
  e.preventDefault();
  var data = convertFormData($(this).serializeArray());
  console.log(data);
}

function convertFormData(formdata) {
  var json = {};
  $.each(formdata, function () {
    if (json[this.name] !== undefined) {
      if (!json[this.name].push) {
        json[this.name] = [json[this.name]];
      }
      json[this.name].push(this.value || '');
    } else {
      json[this.name] = this.value || '';
    }
  });
  return json;
}





function DrawfreeInCanvas2(hasEventListeners) {
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
  // if false then ...
  // Pencil tool instance.
  tool = new tool_pencil();

    if(hasEventListeners){
    // Attach the mouse eventlisteners
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false)
  }

// This painting tool works like a drawing pencil which tracks the mouse
  // movements.
    function tool_pencil() {

    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
      console.log("mousedown rectangle");
      //else {
      //  var d = document.getElementById('temporaryRectangle');
      //  d.style.position = "absolute";
      //  d.style.left = x;
      //  d.style.top = y;
      //  console.log(x + " " + y);
      //}

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
      console.log("mouseup rectangle");
      // call here instead of at the end op 'mouseup' => otherwise he ccalls mousemove twice and you get double rectangles when drawing quickly!
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        //img_update();
      }

      var myElem = document.getElementById('temporaryRectangle');
      if (myElem) {
        var parent = document.getElementById("highlightModalInnerdiv");
        parent.removeChild(myElem);
      }

      //console.log(x + " " + y+ " " + w+ " " + h)
      context.strokeStyle="magenta";
      context.lineWidth=5;
      // here you draw the rectangle // x + the line width /2 => so that you draw nicely in the center of your border, rather than outer/inner border // same for y, w & h
      context.strokeRect(x+context.lineWidth/2, y+context.lineWidth/2, w-context.lineWidth, h-context.lineWidth);
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

// simulate click event in JS
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
/*
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();*/

/*$(function(){

  var dataObject = {
    "" +
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
    //"<div id='screenshotbutton' class='button'><img class='icon' src=" + img + "picture.png>Screenshot</div>" +
    //"<div id='highlitebutton' class='button'><img class='icon' src=" + img + "pencil.png>Highlight</div>" +
    "<div id='screenshotsContainer'></div>" +
    "</div>" +
    "<div class='modalFooter'>" +
    "<div id='closeModal' class='button'>Close</div>" +
    "<button type='submit' id='submitModal' class='button buttonPrimary'>Send</button>" +
    "</div>" +
    "</form>" +
    "</div>"
  }; // -> End of dataObject

  document.getElementById("feedbackModal").innerHTML = tmpl("item_tmpl", dataObject);

});*/
