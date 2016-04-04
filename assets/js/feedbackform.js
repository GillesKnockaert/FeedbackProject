// module method
// TODO: Currently, images are not rendered in the locally hosted version of this
// feedback script. This is due to a CORS issue, which SHOULD be resolved once it's
// hosted on an actuall server. We need to check this before launching!
var feedbackModule = (function() {
  'use strict';
  // save the email filled in by the user in bzkFeedbackModal
  var savedEmail;

  // canvas imgData
  var imgData;

  // canvas imgData fullContainer
  var imgDataFull;

  // canvas imgData fullContainer original / first ever 'bzkScreenshot'
  var imgDataFullOriginal;

  // canvas imgdata partialContainer
  var imgDataPartial;

  // canvas imgData partialContainer original / first ever 'bzkScreenshot'
  var imgDataPartialOriginal;

  // boolean to check if FullContainer has been clicked
  var imgDataFullBool;

  // boolean to check if PartialCOntainer has been clicked
  var imgDataPartialBool;

  // boolean to check if the canvas already has mouseEventListeners
  var hasEventListeners;

  // path to img folder
  var img = 'img/';

  // Classname of the body element
  var bodystate;

  // loads css, html2canvas, bzkFeedbackButton
  function createFeedbackButton() {
    // creates the bzkFeedbackButton
    var bzkFeedbackButton = document.createElement('div');
    bzkFeedbackButton.id = 'bzkFeedbackButton';
    bzkFeedbackButton.className = 'bzkFeedbackButton bzkButton';
    document.body.appendChild(bzkFeedbackButton);
    bzkFeedbackButton.innerHTML = '<img src=' + img + 'Bazookas_Logo_b.png>Send Feedback';
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

    // In Opera 15+, the true version is after 'OPR/'
    if ((verOffset = userAgent.indexOf('OPR/')) != -1) {
      browserName = 'Opera';
      fullVersion = userAgent.substring(verOffset + 4);
    }

    // In older Opera, the true version is after 'Opera' or after 'Version'
    else if ((verOffset = userAgent.indexOf('Opera')) != -1) {
      browserName = 'Opera';
      fullVersion = userAgent.substring(verOffset + 6);
      if ((verOffset = userAgent.indexOf('Version')) != -1)
        fullVersion = userAgent.substring(verOffset + 8);
    }

    // In MSIE, the true version is after 'MSIE' in userAgent
    else if ((verOffset = userAgent.indexOf('MSIE')) != -1) {
      browserName = 'Microsoft Internet Explorer';
      fullVersion = userAgent.substring(verOffset + 5);
    }

    // In Chrome, the true version is after 'Chrome'
    else if ((verOffset = userAgent.indexOf('Chrome')) != -1) {
      browserName = 'Chrome';
      fullVersion = userAgent.substring(verOffset + 7);
    }

    // In Safari, the true version is after 'Safari' or after 'Version'
    else if ((verOffset = userAgent.indexOf('Safari')) != -1) {
      browserName = 'Safari';
      fullVersion = userAgent.substring(verOffset + 7);
      if ((verOffset = userAgent.indexOf('Version')) != -1)
        fullVersion = userAgent.substring(verOffset + 8);
    }

    // In Firefox, the true version is after 'Firefox'
    else if ((verOffset = userAgent.indexOf('Firefox')) != -1) {
      browserName = 'Firefox';
      fullVersion = userAgent.substring(verOffset + 8);
    }

    // In most other browsers, 'name/version' is at the end of userAgent
    else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) <
      (verOffset = userAgent.lastIndexOf('/'))) {
      browserName = userAgent.substring(nameOffset, verOffset);
      fullVersion = userAgent.substring(verOffset + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }

    var ix;
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) != -1)
      fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(' ')) != -1)
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
    var time = date.getHours() + ':' + checkNumber(date.getMinutes()) + ':' + checkNumber(date.getSeconds());

    // Format the current date in the following format: dd/mm/yyyy
    date = checkNumber(date.getDate()) + '/' + checkNumber(date.getMonth() + 1) + '/' + date.getFullYear();

    var BrowserWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    var BrowserHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

    var result = '';

    return 'Browser name  = ' + browserName + '\n' +
    'Full version  = ' + fullVersion + '\n' +
    'Major version = ' + majorVersion + '\n' +
    'Browser width = ' + BrowserWidth + '\n' +
    'Browser height = ' + BrowserHeight + '\n' +
    'screen width = ' + screen.width + '\n' +
    'screen height = ' + screen.height + '\n' +
    'Location = ' + window.location.href + '\n' +
    'Date = ' + date + '\n' +
    'Timestamp = ' + time + '\n' +
    'Platform = ' + platform + '\n';
  }

  function getDomElement(element) {
    // directly returns the element
    return document.getElementById(element);
  }

  function createFeedbackModal() {
    // fixes the scroll issue to top
    document.body.style.top = -document.body.scrollTop + 'px';

    //Add overlay feedback div to the html
    var bzkFeedbackModal = document.createElement('div');
    bzkFeedbackModal.id = 'bzkFeedbackModal';
    bzkFeedbackModal.className = 'bzkFeedbackModal';
    document.body.appendChild(bzkFeedbackModal);

    // fill/build with inner html
    fillbzkFeedbackModal();

    // validate form before submitting!
    getDomElement('feedbackForm').addEventListener('submit', submitForm);

    // add overflow hidden
    bodystate = document.body.className;
    document.body.className += ' bzkBodyOverflowClass';

    // onclick for close button
    getDomElement('closeModal').onclick = function() {
      savedEmail = getDomElement('email').value;

      getDomElement('bzkFeedbackModal').style.visibility = 'hidden';
      document.body.className = bodystate;
    };
  }

  function createToolbox() {
    var toolbox = document.createElement('div');

    var resetToolboxSelection = function() {
      getDomElement('drawFree').className = '';
      getDomElement('drawRect').className = '';
      getDomElement('erase').className = '';
    };

    var makeToolboxSelection = function(selection) {
      resetToolboxSelection();
      getDomElement(selection).className += 'toolboxItemClicked';
    };

    toolbox.id = 'toolbox';
    toolbox.className = 'toolbox';
    document.body.appendChild(toolbox);
    toolbox.innerHTML = '<p>toolbox</p><img src=' + img +
      'toolboxPencil.png id="drawFree"><img src=' + img +
      'drawRect.png id="drawRect"><img src=' + img +
      'erase.png id="erase"><img src=' + img +
      'check-mark-md.png id="bzkReadyButton">';
    getDomElement('toolbox').style.visibility = 'hidden';

    getDomElement('drawFree').onclick = function() {
      makeToolboxSelection('drawFree');
      drawFreeInCanvas(hasEventListeners, 'pencil');
    };

    getDomElement('drawRect').onclick = function() {
      makeToolboxSelection('drawRect');
      drawFreeInCanvas(hasEventListeners, 'rectangle');
    };

    getDomElement('erase').onclick = function() {
      makeToolboxSelection('drawFree');
      if (imgDataFullBool) {
        context.putImageData(imgDataFullOriginal, 0, 0);
      }

      if (imgDataPartialBool) {
        context.putImageData(imgDataPartialOriginal, 0, 0);
      }

      drawFreeInCanvas(hasEventListeners, 'pencil');
    };

    getDomElement('bzkReadyButton').onclick = function() {
      if (imgDataPartialBool) {
        imgDataPartial = context.getImageData(0, 0, canvas.width, document.body.clientHeight);
      }
      else {
        imgDataFull = context.getImageData(0, 0, canvas.width, canvas.height);
      }

      document.body.className += ' bzkBodyOverflowClass';

      getDomElement('bzkHighlightModal').style.visibility = 'hidden';
      getDomElement('bzkReadyButton').style.visibility = 'hidden';
      getDomElement('toolbox').style.visibility = 'hidden';

      resetToolboxSelection();

      imgDataFullBool = false;
      imgDataPartialBool = false;
    };
  }

  // Put html code in the bzkFeedbackModal div using innerHTML
  var feedbackModalInitialized = false;

  function fillbzkFeedbackModal() {
    if (!feedbackModalInitialized) {
      document.getElementById('bzkFeedbackModal').innerHTML = '' +
      '<div id="bzkModalContent">' +
      '<div class="bzkModalHeader">Feedback</div>' +
      '<form method="post" id="feedbackForm" novalidate>' +
      '<div class="bzkModalBody">' +
      '<label for="email">email</label>' +
      '<input type="email" id="email" name="email" value="' +
      ((savedEmail) ? savedEmail : '') +
      '" placeholder="example@provider.com" required />' +

      '<label for="Subject">Subject</label>' +
      '<input type="text" id="Subject" name="Subject" placeholder="Subject" required />' +

      '<label for="Subject">Description</label>' +
      '<textarea rows="5" id="Description" name="Description" placeholder="Description" required></textarea>' +

      '<label for="Type">Type</label>' +
      '<select id="Type" name="Type">' +
      '<option value="Incident" selected>Incident</option>' +
      '<option value="Service Request">Service Request</option>' +
      '</select>' +

      '<input type="hidden" name="params" id="params" required />' +

      '<label for="Priority">Priority</label>' +
      '<select id="Priority" name="Priority">' +
      '<option value="1">Laag</option>' +
      '<option value="2" selected>Gemiddeld</option>' +
      '<option value="3">Hoog</option>' +
      '<option value="4">Urgent</option>' +
      '</select>' +
      '<div id="bzkScreenshotsContainer"></div>' +
      '</div>' +
      '<div class="bzkModalFooter">' +
      '<div id="closeModal" class="bzkButton">Close</div>' +
      '<button type="submit" id="submitModal" class="bzkButton bzkButtonPrimary">Send</button>' +
      '</div>' +
      '</form>' +
      '</div>';

      feedbackModalInitialized = true;
    }
  }

  // create submitModal for success/error submit ticket
  function createSubmitModal() {
    // TODO moet nog verzet worden
    var bzkSubmitResult = document.createElement('div');
    bzkSubmitResult.id = 'bzkSubmitResult';
    document.body.appendChild(bzkSubmitResult);

    bzkSubmitResult.style.visibility = 'hidden';

    bzkSubmitResult.onclick = function() {
      bzkSubmitResult.style.visibility = 'hidden';
    };
  }

  // creates the partial container for bzkScreenshots
  // @param container is either 'partial' or 'full'
  // We'll use these variables to create several DOM elements with the correct
  // id/classname
  function createContainer(container, canvas) {
    container = container.replace('Container', '');
    console.log('container: ', container);
    var upperCaseContainer = container.charAt(0).toUpperCase() + container.slice(1);

    canvas.id = 'bzkScreenshotcanvas' + upperCaseContainer;
    var containerElement = document.createElement('div');
    containerElement.id = container + 'Container';
    containerElement.className = 'bzkScreenshot';
    getDomElement('bzkScreenshotsContainer').appendChild(containerElement);

    var overlay = document.createElement('div');
    overlay.id = container + 'Overlay';
    overlay.className = container + 'Overlay';
    getDomElement(container + 'Container').appendChild(overlay);

    getDomElement(container + 'Overlay').innerHTML += '<img src=' + img + 'pencilWhite.png><p>Click to edit</p>';
    getDomElement(container + 'Container').innerHTML += '<p>Screenshot from the current view</p>';
    getDomElement(container + 'Container').appendChild(canvas);
  }

  function takeScreenshot(container, canvas, callback) {
    var ctx, content;
    if (container === 'partialContainer') {
      ctx = canvas.getContext('2d');
      content = ctx.getImageData(0, document.body.scrollTop, canvas.width, document.body.clientHeight);
      canvas.height = document.body.clientHeight;

      ctx = canvas.getContext('2d');
      ctx.putImageData(content, 0, 0);

      imgDataPartialOriginal = content;
    }
    else if (container === 'fullContainer') {
      ctx = canvas.getContext('2d');
      content = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(content, 0, 0);
      imgDataFullOriginal = content;
    }

    callback();
  }

  function createHighlightModal(bzkHighlightModal) {
    bzkHighlightModal.id = 'bzkHighlightModal';
    bzkHighlightModal.className = 'bzkHighlightModal';
    document.body.appendChild(bzkHighlightModal);
  }

  // creates the X close button on bzkHighlightModal
  function createXClose(bzkHighlightModal) {
    var bzkCloseWithX = document.createElement('div');
    bzkCloseWithX.id = 'bzkCloseWithX';
    bzkCloseWithX.className = 'bzkCloseWithX';
    bzkCloseWithX.innerHTML = '<img src=' + img + 'x-close.png>';
    bzkHighlightModal.appendChild(bzkCloseWithX);

    bzkCloseWithX.onclick = function() {
      eventFire(getDomElement('erase'), 'click');
      eventFire(getDomElement('bzkReadyButton'), 'click');
    };
  }

  // the actual div you draw on
  function createHighlightModalInnerDiv(bzkHighlightModal, bzkHighlightModalInnerdiv) {
    bzkHighlightModalInnerdiv.id = 'bzkHighlightModalInnerdiv';
    bzkHighlightModalInnerdiv.className = 'bzkHighlightModalInnerdiv';
    bzkHighlightModal.appendChild(bzkHighlightModalInnerdiv);
  }

  // enables the ability to draw on canvas
  function DrawOnCanvas(canvas) {
    var myElem = document.getElementById('bzkHighlightModal'),
        copiedCanvas;
    if (myElem === null) {
      var bzkHighlightModal = document.createElement('div');
      var bzkHighlightModalInnerdiv = document.createElement('div');
      // creates/fixes the bzkHighlightModal
      createHighlightModal(bzkHighlightModal);
      // creates/fixes the bzkCloseWithX div
      createXClose(bzkHighlightModal);
      // creates/fixes the inner div you draw on
      createHighlightModalInnerDiv(bzkHighlightModal, bzkHighlightModalInnerdiv);

      copiedCanvas = cloneCanvas(canvas);
      bzkHighlightModalInnerdiv.appendChild(copiedCanvas);
    }
    else {
      var modalInnerDiv = getDomElement('bzkHighlightModalInnerdiv');
      modalInnerDiv.removeChild(getDomElement('bzkZoomedCanvas'));

      copiedCanvas = cloneCanvas(canvas);
      modalInnerDiv.appendChild(copiedCanvas);
    }

    getDomElement('bzkHighlightModal').style.visibility = 'visible';
    getDomElement('bzkReadyButton').style.visibility = 'visible';
  }

  // clone a canvas
  function cloneCanvas(oldCanvas) {
    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;
    newCanvas.id = 'bzkZoomedCanvas';

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
  }

  // this is the draw behaviour
  function drawFreeInCanvas(hasEventListeners, tool) {
    var canvas = getDomElement('bzkZoomedCanvas');
    if (!canvas) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvas.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    var context = canvas.getContext('2d');
    if (!context) {
      alert('Error: failed to getContext!');
      return;
    }
    // set tool with pencil or rectangle behaviour
    //tool = new tool_behaviour(tool);

    console.log('this: ', this);
    if (tool === 'pencil') {
      tool = this;
      console.log(tool);
      tool.started = false;

      // This is called when you start holding down the mouse button.
      // This starts the pencil drawing.
      tool.mousedown = function(ev) {
        context.strokeStyle = 'magenta';
        context.lineWidth = '5';
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
      };

      // This function is called every time you move the mouse. Obviously, it only
      // draws if the tool.started state is set to true (when you are holding down
      // the mouse button).
      tool.mousemove = function(ev) {
        if (tool.started) {
          context.lineTo(ev._x, ev._y);
          context.stroke();
        }
      };

      // This is called when you release the mouse button.
      tool.mouseup = function(ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
        }
      };
    }

    if (tool === 'rectangle') {
      tool = this;
      console.log(tool);
      tool.started = false;

      tool.mousedown = function(ev) {
        //else {
        //  var d = document.getElementById('bzkTemporaryRectangle');
        //  d.style.position = 'absolute';
        //  d.style.left = x;
        //  d.style.top = y;
        //  console.log(x + ' ' + y);
        //}

        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      var x, y, w, h;

      tool.mousemove = function(ev) {
        if (!tool.started) {
          return;
        }

        x = Math.min(ev._x, tool.x0);
        y = Math.min(ev._y, tool.y0);
        w = Math.abs(ev._x - tool.x0);
        h = Math.abs(ev._y - tool.y0);

        var myElem = document.getElementById('bzkTemporaryRectangle');
        if (!myElem) {
          var bzkTemporaryRectangle = document.createElement('div');
          bzkTemporaryRectangle.id = 'bzkTemporaryRectangle';
          bzkTemporaryRectangle.className = 'bzkTemporaryRectangle';
          getDomElement('bzkHighlightModalInnerdiv').appendChild(bzkTemporaryRectangle);
          myElem = document.getElementById('bzkTemporaryRectangle');
        }

        myElem.style.left = x * (canvas.clientWidth / canvas.width) + 'px';
        myElem.style.top = y * (canvas.clientHeight / canvas.height) + 'px';
        myElem.style.width = w * (canvas.clientWidth / canvas.width) + 'px';
        myElem.style.height = h * (canvas.clientHeight / canvas.height) + 'px';

        if (!w || !h) {
          return;
        }
      };

      tool.mouseup = function(ev) {
        // call here instead of at the end op 'mouseup' => otherwise he ccalls mousemove twice and you get double rectangles when drawing quickly!
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
          //img_update();
        }

        var myElem = getDomElement('bzkTemporaryRectangle');
        if (myElem) {
          var parent = getDomElement('bzkHighlightModalInnerdiv');
          parent.removeChild(myElem);
        }

        //console.log(x + ' ' + y+ ' ' + w+ ' ' + h)
        context.strokeStyle = 'magenta';
        context.lineWidth = 5;
        // here you draw the rectangle // x + the line width /2 => so that you draw nicely in the center of your border, rather than outer/inner border // same for y, w & h
        context.strokeRect(x + context.lineWidth / 2, y + context.lineWidth / 2, w - context.lineWidth, h - context.lineWidth);
      };
    }

    // determines the mouse position relative to the canvas element
    function evCanvas(ev) {
      if (ev.layerX || ev.layerX === 0) { // Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX === 0) { // Opera
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

    if (hasEventListeners) {
      canvas.removeEventListener('mousedown', evCanvas, false);
      canvas.removeEventListener('mousemove', evCanvas, false);
      canvas.removeEventListener('mouseup',   evCanvas, false);
    }

    // Attach the mouse eventlisteners
    canvas.addEventListener('mousedown', evCanvas, false);
    canvas.addEventListener('mousemove', evCanvas, false);
    canvas.addEventListener('mouseup',   evCanvas, false);

    hasEventListeners = true;
  }

  // simulate click event in JS
  function eventFire(el, etype) {
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
    var url = 'http://localhost:8000/api/post/ticket';
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {//Call a function when the state changes.
      if (http.readyState == XMLHttpRequest.DONE) {
        var jsonResponse = JSON.parse(http.response);

        if (jsonResponse.status == 'success') {
          console.log('setting hidden after success');
          getDomElement('bzkFeedbackModal').style.visibility = 'hidden';
          document.body.className = bodystate;
          getDomElement('bzkSubmitResult').style.visibility = 'visible';
          //getDomElement('bzkSubmitResult').className += 'success_result';
          getDomElement('bzkSubmitResult').innerHTML = 'Succes sending feedback!';
          eventFire(getDomElement('closeModal'), 'click');
        } else if (jsonResponse.status == 'error') {
          getDomElement('bzkSubmitResult').className += 'bzkErrorResult';
          getDomElement('bzkSubmitResult').innerText = jsonResponse.message;
          getDomElement('submitModal').innerText = 'Retry';
        }
      }
    };

    http.send(params);
  }

  // submits the form
  function submitForm(e) {
    savedEmail = getDomElement('email').value;

    e.preventDefault();
    document.getElementById('params').value = feedbackModule.getBackgroundInfo();
    var data = serializeFormData();
    feedbackModule.createTicket(data);
  }

  // returns formData in a String
  function serializeFormData() {
    return 'description=' + document.getElementById('Description').value + '&' +
    'subject=' + document.getElementById('Subject').value + '&' +
    'email=' + document.getElementById('email').value + '&' +
    'priority=' + document.getElementById('Priority').value + '&' +
    'type=' + document.getElementById('Type').value + '&' +
    'params=' + document.getElementById('params').value;
  }

  var bzkFeedbackModal, bzkFeedbackButton;
  function showFeedbackModal(show) {
    if (!bzkFeedbackModal) {
      bzkFeedbackModal = getDomElement('bzkFeedbackModal');
    }

    if (!bzkFeedbackButton) {
      bzkFeedbackButton = getDomElement('bzkFeedbackButton');
    }

    bzkFeedbackModal.style.visibility = show ? 'visible' : 'hidden';
    bzkFeedbackButton.style.visibility = show ? 'visible' : 'hidden';
  }

  // gets bzkScreenshots from your page
  function getScreenshots() {
    var screenshots = 0;

    // hide modal & button so you can take bzkScreenshot
    showFeedbackModal(false);

    function getScreenshotForContainer(container) {
      html2canvas(document.body, {
        onrendered: function(canvas) {
          createContainer(container, canvas);
          takeScreenshot(container, canvas, function() {
            screenshots++;
            checkIfScreenshotsTaken();
          });

          getDomElement(container).onclick = function() {
            imgDataPartialBool = (container === 'partialContainer');
            imgDataFullBool = (container !== 'partialContainer');
            getDomElement('toolbox').style.visibility = 'visible';
            getDomElement('drawFree').className += 'toolboxItemClicked';
            DrawOnCanvas(canvas);
            drawFreeInCanvas(hasEventListeners, 'pencil');

            if (imgDataPartial) {
              context.putImageData(imgDataPartial, 0, 0);
            }
          };
        }
      });
    }

    function checkIfScreenshotsTaken() {
      if (screenshots > 1) {
        showFeedbackModal(true);
      }
    }

    getScreenshotForContainer('partialContainer');
    getScreenshotForContainer('fullContainer');

    document.body.className += ' bzkBodyOverflowClass';
  }

  // initialize function called on docReady
  function init() {
    createFeedbackButton();
    getBackgroundInfo();
    createSubmitModal();
    getDomElement('bzkFeedbackButton').onclick = function() {
      createFeedbackModal();
      getScreenshots();
      createToolbox();
    };
  }

  return {
      init: init,
      getBackgroundInfo: getBackgroundInfo,
      createTicket: createTicket
    };
})(); // end feedbackModule
