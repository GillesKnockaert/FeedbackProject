// docReady function is defined in utilities.js. It ensures cross-browser compatible
// on document ready initialisation
docReady(function() {
  feedbackModule.init();
});

// module method
var feedbackModule = (function() {
  // save the email filled in by the user in bzk_feedbackModal
  var savedEmail;
	// canvas imgData
	var imgData;
	// canvas imgData fullContainer
  var imgDataFull;
  // canvas imgData fullContainer original / first ever 'bzk_screenshot'
  var imgDataFullOriginal;
  // canvas imgdata partialContainer
  var imgDataPartial;
  // canvas imgData partialContainer original / first ever 'bzk_screenshot'
  var imgDataPartialOriginal;
  // boolean to check if FullContainer has been clicked
  var imgDataFullBool;
  // boolean to check if PartialCOntainer has been clicked
  var imgDataPartialBool;
  // boolean to check if the canvas already has mouseEventListeners
  var hasEventListeners;
  // cssPath
	var cssPath = "css/FeedbackStyleV2.css",
    	img = "img/", //path to img folder
    	html2CanvasPath = "js/html2canvas.js", // path to html2canvas library
    	head; // head DOM element
    
	// loads css, html2canvas, bzk_feedbackButton
	function loadElements(){
    // loads the css file
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

    // loads the html2canvas 
    head = head || document.getElementsByTagName('head')[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = html2CanvasPath;
    head.appendChild(script);
    document.body.appendChild(script);

    // creates the bzk_feedbackButton
    var bzk_feedbackButton = document.createElement("div");
    bzk_feedbackButton.id = "bzk_feedbackButton";
    bzk_feedbackButton.className = "bzk_feedbackButton bzk_button";
    document.body.appendChild(bzk_feedbackButton);
    bzk_feedbackButton.innerHTML = "<img src=" + img + "Bazookas_Logo_b.png>Send Feedback";
	}

	// get browser background information
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

      var result = '';

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

  function getDomElement(element){
    // directly returns the element
  	return document.getElementById(element);
  }

  function createFeedbackModal(){
  	//Add overlay feedback div to the html
  	var bzk_feedbackModal = document.createElement("div");
  	bzk_feedbackModal.id = "bzk_feedbackModal";
  	bzk_feedbackModal.className = "bzk_feedbackModal";
  	document.body.appendChild(bzk_feedbackModal);

  	// fill/build with inner html
  	fillbzk_feedbackModal();

  	// validate form before submitting!
    getDomElement('feedbackForm').addEventListener("submit", submitForm);

    // add overflow hidden
  	bodystate = document.body.className;
  	document.body.className += " bzk_bodyOverflowClass";

    // onclick for close button
		getDomElement('closeModal').onclick = function(){
      savedEmail = getDomElement('email').value;

			getDomElement("bzk_feedbackModal").style.visibility = "hidden";
      document.body.className = bodystate;
		}
  }

  function createToolbox() {
      var toolbox = document.createElement("div");
      toolbox.id = "toolbox";
      toolbox.className = "toolbox";
      document.body.appendChild(toolbox);
      toolbox.innerHTML = "<p>toolbox</p><img src=" + img + "toolboxPencil.png id='drawFree'><img src=" + img + "drawRect.png id='drawRect'><img src=" + 
      					img + "erase.png id='erase'><img src=" + img + "check-mark-md.png id='bzk_readyButton'>";
  	  getDomElement("toolbox").style.visibility = "hidden";

    	getDomElement("drawFree").onclick = function() {
          getDomElement("drawFree").className = "";
          getDomElement("drawRect").className = "";
          getDomElement("erase").className = "";
          getDomElement("drawFree").className += "toolboxItemClicked";
          drawFreeInCanvas(hasEventListeners, 'pencil');
        };

      getDomElement("drawRect").onclick = function() {
        getDomElement("drawRect").className = "";
        getDomElement("drawFree").className = "";
        getDomElement("erase").className = "";
        getDomElement("drawRect").className += "toolboxItemClicked";
        drawFreeInCanvas(hasEventListeners, 'rectangle');
      };

      getDomElement("erase").onclick = function(){
        getDomElement("drawFree").className = "";
        getDomElement("drawRect").className = "";
        getDomElement("erase").className = "";
        getDomElement("drawFree").className += "toolboxItemClicked";
        if(imgDataFullBool){
          context.putImageData(imgDataFullOriginal, 0, 0);
        }
        if(imgDataPartialBool){
          context.putImageData(imgDataPartialOriginal, 0, 0);
        }

        drawFreeInCanvas(hasEventListeners, 'pencil');
      }

      getDomElement("bzk_readyButton").onclick = function() {
        if(imgDataPartialBool){imgDataPartial = context.getImageData(0, 0, canvas.width, document.body.clientHeight);}
        if(imgDataFullBool){imgDataFull = context.getImageData(0, 0, canvas.width, canvas.height);}

        document.body.className += " bzk_bodyOverflowClass";

        getDomElement("bzk_highlightModal").style.visibility = "hidden";
        getDomElement("bzk_readyButton").style.visibility = "hidden";
        getDomElement("toolbox").style.visibility = "hidden";

        getDomElement("drawFree").className = "";
        getDomElement("drawRect").className = "";
        getDomElement("erase").className = "";

        imgDataFullBool = false;
        imgDataPartialBool = false;
      };
  }

  // Put html code in the bzk_feedbackModal div using innerHTML
  function fillbzk_feedbackModal(){
      document.getElementById("bzk_feedbackModal").innerHTML = "" +
        "<div id='bzk_modalContent'>" +
        "<div class='bzk_modalHeader'>Feedback</div>" +
        "<form method='post' id='feedbackForm' novalidate>" +
        "<div class='bzk_modalBody'>" +
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

        "<input type='hidden' name='params' id='params' required />" +

        "<label for='Priority'>Priority</label>" +
        "<select id='Priority' name='Priority'>" +
        "<option value='1'>Laag</option>" +
        "<option value='2' selected>Gemiddeld</option>" +
        "<option value='3'>Hoog</option>" +
        "<option value='4'>Urgent</option>" +
        "</select>" +
        "<div id='bzk_screenshotsContainer'></div>" +
        "</div>" +
        "<div class='bzk_modalFooter'>" +
        "<div id='closeModal' class='bzk_button'>Close</div>" +
        "<button type='submit' id='submitModal' class='bzk_button bzk_buttonPrimary'>Send</button>" +
        "</div>" +
        "</form>" +
        "</div>";

        if(savedEmail){
          getDomElement('email').value = savedEmail;
        }
  }

  // create submitModal for success/error submit ticket
  function createSubmitModal(){
  	// TODO moet nog verzet worden
    var bzk_submit_result = document.createElement('div');
    bzk_submit_result.id = "bzk_submit_result";
    document.body.appendChild(bzk_submit_result);

    bzk_submit_result.style.visibility = "hidden";

    bzk_submit_result.onclick = function(){
      bzk_submit_result.style.visibility = "hidden";
    }
  }

  // creates the partial container for bzk_screenshots
  function createContainer(container, canvas){
  	if(container == 'partialContainer')
  	{
  		canvas.id = "bzk_screenshotcanvasPartial";
	    var partialContainer = document.createElement("div");
	    partialContainer.id = "partialContainer";
	    partialContainer.className = "bzk_screenshot";
	    getDomElement("bzk_screenshotsContainer").appendChild(partialContainer);

	    var partialOverlay = document.createElement("div");
      partialOverlay.id = "partialOverlay";
      partialOverlay.className = "partialOverlay";
      getDomElement("partialContainer").appendChild(partialOverlay);

      getDomElement("partialOverlay").innerHTML += "<img src=" + img + "pencilWhite.png><p>Click to edit</p>";
      getDomElement("partialContainer").innerHTML += "<p>Screenshot from the current view</p>";
      getDomElement("partialContainer").appendChild(canvas);
  	}
  	else {
  		canvas.id = "bzk_screenshotCanvasFull";
      var fullContainer = document.createElement("div");
      fullContainer.id = "fullContainer";
      fullContainer.className = "bzk_screenshot";
      getDomElement("bzk_screenshotsContainer").appendChild(fullContainer);

      var fullOverlay = document.createElement("div");
      fullOverlay.id = "fullOverlay";
      fullOverlay.className = "fullOverlay";
      getDomElement("fullContainer").appendChild(fullOverlay);

      getDomElement("fullOverlay").innerHTML += "<img src=" + img + "pencilWhite.png><p>Click to edit</p>";
      getDomElement("fullContainer").innerHTML += "<p>Screenshot from the full website</p>";
      getDomElement("fullContainer").appendChild(canvas);
  	}
  }

  function takeScreenshot(container, canvas){
  	if(container == 'partialContainer'){
  		var ctx = canvas.getContext("2d");
      var content = ctx.getImageData(0, document.body.scrollTop, canvas.width, document.body.clientHeight);
      canvas.height = document.body.clientHeight;

      ctx = canvas.getContext("2d");
      ctx.putImageData(content, 0, 0);

      imgDataPartialOriginal = content;
  	}
  	else{
	    var ctx = canvas.getContext("2d");
      if(imgDataFull != null)
      {
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
  	}
  }

  function createHighlightModal(bzk_highlightModal){
      bzk_highlightModal.id = "bzk_highlightModal";
      bzk_highlightModal.className = "bzk_highlightModal";
      document.body.appendChild(bzk_highlightModal);
  }

  // creates the X close button on bzk_highlightModal
  function createXClose(bzk_highlightModal){
  	  var bzk_xClose = document.createElement("div");
      bzk_xClose.id = "bzk_xClose";
      bzk_xClose.className = "bzk_xClose";
      bzk_xClose.innerHTML = "<img src=" + img + "x-close.png>";
      bzk_highlightModal.appendChild(bzk_xClose);

      bzk_xClose.onclick = function(){
        eventFire(getDomElement('erase'), 'click');
        eventFire(getDomElement('bzk_readyButton'), 'click');
      }
  }

  // the actual div you draw on
  function createHighlightModalInnerDiv(bzk_highlightModal, bzk_highlightModalInnerdiv){
      bzk_highlightModalInnerdiv.id = "bzk_highlightModalInnerdiv";
      bzk_highlightModalInnerdiv.className = "bzk_highlightModalInnerdiv";
      bzk_highlightModal.appendChild(bzk_highlightModalInnerdiv);
  }

  // enables the ability to draw on canvas
  function DrawOnCanvas(canvas){
    var myElem = document.getElementById('bzk_highlightModal');
    if (myElem === null ) 
    {
    	var bzk_highlightModal = document.createElement("div");
    	var bzk_highlightModalInnerdiv = document.createElement("div");
      // creates/fixes the bzk_highlightModal
      createHighlightModal(bzk_highlightModal);
      // creates/fixes the bzk_xClose div
      createXClose(bzk_highlightModal);
      // creates/fixes the inner div you draw on
      createHighlightModalInnerDiv(bzk_highlightModal, bzk_highlightModalInnerdiv);

      var copiedCanvas = cloneCanvas(canvas);
      bzk_highlightModalInnerdiv.appendChild(copiedCanvas);
    }
    else{
      var modalInnerDiv = getDomElement("bzk_highlightModalInnerdiv");
      modalInnerDiv.removeChild(getDomElement("bzk_zoomedCanvas"));

      var copiedCanvas = cloneCanvas(canvas);
      modalInnerDiv.appendChild(copiedCanvas);
    }
    getDomElement("bzk_highlightModal").style.visibility = "visible";
    getDomElement("bzk_readyButton").style.visibility = "visible";
  }

  // clone a canvas 
	function cloneCanvas(oldCanvas) {
	  //create a new canvas
	  var newCanvas = document.createElement('canvas');
	  var context = newCanvas.getContext('2d');

	  //set dimensions
	  newCanvas.width = oldCanvas.width;
	  newCanvas.height = oldCanvas.height;
	  newCanvas.id = "bzk_zoomedCanvas";

	  //apply the old canvas to the new one
	  context.drawImage(oldCanvas, 0, 0);

	  //return the new canvas
	  return newCanvas;
	}

  // this is the draw behaviour
  function drawFreeInCanvas(hasEventListeners, tool){
    canvas = getDomElement('bzk_zoomedCanvas');
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
    // set tool with pencil or rectangle behaviour
    //tool = new tool_behaviour(tool);

    if(tool == 'pencil'){
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
    if(tool == 'rectangle'){
    	var tool = this;
	    this.started = false;

	    this.mousedown = function (ev) {
	      console.log("mousedown rectangle");
	      //else {
	      //  var d = document.getElementById('bzk_temporaryRectangle');
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

	      var myElem = document.getElementById('bzk_temporaryRectangle');
	      if (!myElem) {
	        var bzk_temporaryRectangle = document.createElement("div");
	        bzk_temporaryRectangle.id = "bzk_temporaryRectangle";
	        bzk_temporaryRectangle.className = "bzk_temporaryRectangle";
	        getDomElement('bzk_highlightModalInnerdiv').appendChild(bzk_temporaryRectangle);
	        myElem = document.getElementById('bzk_temporaryRectangle');
	      }

	      myElem.style.left = x * (canvas.clientWidth / canvas.width) + 'px';
	      myElem.style.top = y * (canvas.clientHeight / canvas.height) + 'px';
	      myElem.style.width = w * (canvas.clientWidth / canvas.width) + 'px';
	      myElem.style.height = h * (canvas.clientHeight / canvas.height) + 'px';


	      if (!w || !h) {
	        return;
	      }

	    };

	    this.mouseup = function (ev) {
	    	console.log('mouseup rectangle');
	      // call here instead of at the end op 'mouseup' => otherwise he ccalls mousemove twice and you get double rectangles when drawing quickly!
	      if (tool.started) {
	        tool.mousemove(ev);
	        tool.started = false;
	        //img_update();
	      }

	      var myElem = getDomElement('bzk_temporaryRectangle');
	      if (myElem) {
	        var parent = getDomElement("bzk_highlightModalInnerdiv");
	        parent.removeChild(myElem);
	      }

	      //console.log(x + " " + y+ " " + w+ " " + h)
	      context.strokeStyle="magenta";
	      context.lineWidth=5;
	      // here you draw the rectangle // x + the line width /2 => so that you draw nicely in the center of your border, rather than outer/inner border // same for y, w & h
	      context.strokeRect(x+context.lineWidth/2, y+context.lineWidth/2, w-context.lineWidth, h-context.lineWidth);
	    };
    }
    
    if(hasEventListeners){
    	console.log('removing event listeners')
  	  canvas.removeEventListener('mousedown', ev_canvas, false);
  	  canvas.removeEventListener('mousemove', ev_canvas, false);
  	  canvas.removeEventListener('mouseup',   ev_canvas, false);
  	}

    // Attach the mouse eventlisteners
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);

    hasEventListeners = true;

    // determines the mouse position relative to the canvas element
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
    } // end ev_canvas
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

	// creates a ticket in the freshService
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
            getDomElement("bzk_feedbackModal").style.visibility = "hidden";
            document.body.className = bodystate;
            getDomElement('bzk_submit_result').style.visibility = "visible";
            //getDomElement('bzk_submit_result').className += "success_result";
            getDomElement('bzk_submit_result').innerHTML = "Succes sending feedback!";
            eventFire(getDomElement('closeModal'), 'click');
          } else if (jsonResponse.status == "error") {
            getDomElement("bzk_submit_result").className += "bzk_error_result";
            getDomElement("bzk_submit_result").innerText = jsonResponse.message;
            getDomElement("submitModal").innerText = "Retry";
          }
        }
      };
      http.send(params);
  }

  // submits the form
  function submitForm(e) {
      savedEmail = getDomElement('email').value;

	    e.preventDefault();
	    document.getElementById("params").value = feedbackModule.getBackgroundInfo();
	    var data = serializeFormData();
	    feedbackModule.createTicket(data);
	}

	// returns formData in a String
	function serializeFormData() {
	    return ''
	        + 'description=' + document.getElementById('Description').value + '&'
	        + 'subject=' + document.getElementById('Subject').value + '&'
	        + 'email=' + document.getElementById('email').value + '&'
	        + 'priority=' + document.getElementById('Priority').value + '&'
	        + 'type=' + document.getElementById('Type').value + '&'
	        + 'params=' + document.getElementById('params').value;
	}

  // gets bzk_screenshots from your page
  function getScreenshot(container){
  	document.body.className = bodystate;

  	// hide modal & button so you can take bzk_screenshot
  	getDomElement("bzk_feedbackModal").style.visibility = "hidden";
      getDomElement("bzk_feedbackButton").style.visibility = "hidden";
      if(container == 'partialContainer'){
      	//use html2canvas library to generate the html page on a canvas
          html2canvas(document.body, {
            onrendered: function(canvas) {
         	  createContainer(container, canvas);
        	  takeScreenshot(container, canvas);
          
              getDomElement("partialContainer").onclick = function() {
                imgDataPartialBool = true;
                imgDataFullBool = false;
                getDomElement("toolbox").style.visibility = "visible";
                getDomElement("drawFree").className += "toolboxItemClicked";
                DrawOnCanvas(canvas);
                drawFreeInCanvas(hasEventListeners, 'pencil');

                if(imgDataPartial != null){
                  context.putImageData(imgDataPartial, 0, 0);
                }
              }; // en onclick partialContainer
            } // end onrendered
          }); // end html2canvas partialcontainer
      } // end if partial or full
      else {
	    html2canvas(document.body, {
	        onrendered: function(canvas) {
	          createContainer(container, canvas);
        	  takeScreenshot(container, canvas);

	          getDomElement("fullContainer").onclick = function() {
	            imgDataFullBool = true;
	            imgDataPartialBool = false;
	            getDomElement("toolbox").style.visibility = "visible";
	            getDomElement("drawFree").className += "toolboxItemClicked";
	            DrawOnCanvas(canvas);
	            drawFreeInCanvas(hasEventListeners, 'pencil');

	            if(imgDataFull){
	              context.putImageData(imgDataFull, 0, 0);
	            }
	          }; // end onclick fullContainer
	        } // end onrendered
	      }); // end html2canvas fullcontainer
      } // end if-else partial or full
      document.body.className += " bzk_bodyOverflowClass";
      // bzk_feedbackModal and button can be visible again
      getDomElement("bzk_feedbackModal").style.visibility = "visible";
      getDomElement("bzk_feedbackButton").style.visibility = "visible";
  }

  // initialize function called on docReady
	function init(){
		loadElements();
		getBackgroundInfo();
    createSubmitModal();
		getDomElement('bzk_feedbackButton').onclick = function(){
		  	createFeedbackModal();
		  	getScreenshot('partialContainer');
		  	getScreenshot('fullContainer');
		  	createToolbox();
		};
	}

	return {
      init: init,
      getBackgroundInfo : getBackgroundInfo,
      createTicket: createTicket
    };
})(); // end feedbackModule