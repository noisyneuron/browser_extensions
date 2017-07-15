var myPort = browser.runtime.connect({name:"port-from-cs"});
var link = "";
// SEND CLICK MESSAGE
var a_elements = document.getElementsByTagName('a');
for(var i=0; i<a_elements.length; i++) {
  a_elements[i].onclick = function(e) {
    e.preventDefault();
    link = e.target.href;
    browser.runtime.sendMessage({'link' : e.target.href})
  }
};

// RECEIVE SCREENSHOT AND CLICKED LINK
myPort.onMessage.addListener(function(m) {
    // display the image!
    console.log("In content script, received message from background script: ");
    console.log(m);
    // threejs script goes here
    document.getElementsByTagName('html')[0].innerHTML = '<div id="container"></div>';
    setTimeout(function() {
      window.location = link;
    }, 3000)
    doThreeStuff(m.data);
});


// CREATE CANVAS AND APPLY SHADER
function doThreeStuff(imgStr) {
  var container;
  var camera, scene, renderer;
  var uniforms, material, mesh;
  var mouseX = 0, mouseY = 0,
  lat = 0, lon = 0, phy = 0, theta = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  init();
  var startTime = Date.now();
  animate();

  function init() {
    var imgTexture = THREE.ImageUtils.loadTexture( imgStr );
    container = document.getElementById( 'container' );
    camera = new THREE.Camera();
    camera.position.z = 1;
    scene = new THREE.Scene();
    uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      mouse: { type: "v2", value: new THREE.Vector2(mouseX,mouseY)}, 
      img: { type: "t", value: imgTexture},
      imgResolution: {type: "v2", value: new THREE.Vector2(imgTexture.image.width,imgTexture.image.height)}
    };
    material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: getVertexShader(),
      fragmentShader: getFragmentShader()
    });
    mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
    scene.add( mesh );
    renderer = new THREE.WebGLRenderer();
    container.appendChild( renderer.domElement );
    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    renderer.setSize( window.innerWidth, window.innerHeight );
    console.log(mouseX);
    console.log(mouseY);
  }



  function animate() {
    requestAnimationFrame( animate );
    render();
  }


  function render() {
    var elapsedMilliseconds = Date.now() - startTime;
    var elapsedSeconds = elapsedMilliseconds / 1000.;
    uniforms.time.value = 60. * elapsedSeconds;
    uniforms.mouse.value.x = mouseX;
    uniforms.mouse.value.y = mouseY;
    renderer.render( scene, camera );
  }
}


function getVertexShader() {
  return "uniform float time;\n"+
    "uniform vec2 resolution;\n"+
    "void main() {\n"+
    "  gl_Position = vec4( position, 1.0 );\n"+
    "}";
}


function getFragmentShader() {
  return "uniform float time;\n"+
  "uniform vec2 resolution;\n"+
  "uniform sampler2D img;\n"+
  "uniform vec2 mouse;\n"+
  "#define PI radians(180.)\n"+

  "vec2 swirl(vec2 pos, float r, float amt) {\n"+
  "  float r2 = r;\n"+
  "  return amt*vec2(pos.x*sin(r2) - pos.y*cos(r2), \n"+
  "              pos.x*cos(r2) + pos.y*sin(r2));\n"+
  "}\n"+
  "void main() {\n" +
  "  vec2 st = (gl_FragCoord.xy - resolution.xy*0.5)/max(resolution.x, resolution.y);\n" +
  "  st *= 2.;    \n" +
  "  vec2 mst = (mouse.xy - resolution.xy*0.5)/max(resolution.x, resolution.y);\n" +
  "  mst *= 2.;  \n" +
  "  float swirl_radius = PI/2.;\n" +
  "  float swirl_amt = 1.;\n" +
  "  float modtime = mod(time*0.04, 10.)/10.;\n" +
  "  st *= mat2(cos(modtime*2.), -sin(modtime*2.),\n" +
  "            sin(modtime*2.), cos(modtime*2.));\n" +
  "  st *= mix(1., 4., pow(modtime,2.));\n" +
  "  float f_rad = st.x*st.x + st.y*st.y;    \n" +
  "  swirl_radius = mix(PI/2., f_rad, modtime);\n" +
  "  vec2 imgCoords = swirl(st, swirl_radius, swirl_amt);\n" +
  "  imgCoords = imgCoords*0.5 + 0.5;\n" +
  "  vec4 imgCol = texture2D(img, imgCoords);\n" +
  "  vec2 inBounds = step(0., imgCoords) * 1. - step(1.00001, imgCoords);\n" +
  "  imgCol.rgb -= pow(modtime,2.);\n" +
  "  imgCol.rgb *= inBounds.x*inBounds.y;\n" +
  "  gl_FragColor = imgCol;\n" +
  "}"
}

