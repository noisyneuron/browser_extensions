$(function() {
  var wh = $(window).height();
  var ww = $(window).width();
  var m = {x: 0, y: 0};
  var c = {x: 0, y: wh};
  var mouse_target = {x: 0, y: 0};
  var moving = false;
  var t = 1;
  var velocity = {x: 30, y: 30};
  var a = {x: 0, y: 1};
  var catSize = {x: 150, y: 184};
  var activateLaunchCat;
  var cursorMode = "hide";

  $(window).resize(function() {
    wh = $(window).height();
    ww = $(window).width();
  });

  var cat = new Image();
  cat.src = chrome.extension.getURL("cat.gif");
  cat.id = "cat";
  cat.style.width = '150px';
  cat.style.height = 'auto';
  cat.style.position = 'fixed';
  cat.style.top = '100%';
  cat.style["z-index"] = 100;
  cat.onload = function() {
    $('html').append(cat);
  }

  function positionCat() {
    $('#cat').css( {
      top: c.y+'px',
      left: c.x+'px'
    })
  }

  function outOfBounds() {
    return (c.x < -catSize.x || c.x > ww || c.y > wh || c.y < -catSize.y); 
  }

  function hideMouse() {
    var catArea = {x : c.x + .5*catSize.x, y: c.y + .25*catSize.y};
    if(Math.abs(m.x - catArea.x) < 15 || Math.abs(m.y - catArea.y) < 15) {
      var cursor = $('html').css('cursor');
      // if(cursorMode == "hide" &) {
      if(cursorMode == "hide" && cursor != 'none') {
        $('html').css({cursor: 'none'});
      
      } else {
        $('html').css({cursor: 'auto'});
      }
      
    } 
  }

  // get mouse coords not dependent on moving 
  $('html').mousemove(function(e) {
    m.x = e.pageX - $(window).scrollLeft();
    m.y = e.pageY - $(window).scrollTop();
  });


  activateLaunchCat = function() {
    if(!moving) {
      // console.log('activateLaunchCat');
      setTimeout(function() {
        // console.log('activateLaunchCat after timeout');
        moving = true;
        cursorMode = cursorMode == "hide" ? "show" : "hide";
        activateLaunchCat();
      }, 2001);
    }
  }


  positionCat();
  scalefactor = 10;

  function initCat() {
    // console.log(m);
    c.x = - catSize.x/2;
    c.y = wh;
    mouse_target.x = m.x;
    mouse_target.y = m.y;

    velocity.y = - Math.sqrt(-2 * (mouse_target.y - wh ) * a.y);
    velocity.x = (-a.y * mouse_target.x) / velocity.y;
  }

  setInterval(function() {
    if(moving) {
      if(t == 1) {
        initCat();
      } 

      c.x =  - catSize.x/2 + velocity.x * t;
      c.y = (wh - .25*catSize.y) + (velocity.y * t) + (1/2) * a.y * t*t;


      if( t > 20 && outOfBounds()) {
        moving = false;
        console.log('set moving to false');
        initCat();
        console.log('offpage');
      }

      hideMouse();
      positionCat();
      
      t+=3;

    } else {
      t = 1;
      activateLaunchCat();
    }
  }, 100);

  positionCat();
  activateLaunchCat();

})
