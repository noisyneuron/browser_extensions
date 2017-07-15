var myPort = browser.runtime.connect({name:"port-from-cs"});

browser.runtime.onMessage.addListener(function(m) {
    // display the image!
      console.log("In content script, received message from background script: ");
      console.log(m);
      // threejs script goes here
      document.getElementsByTagName('html')[0].innerHTML = '<img src="' + m.data + '" />'
});

var a_elements = document.getElementsByTagName('a');

for(var i=0; i<a_elements.length; i++) {
  a_elements[i].onclick = function(e) {
    e.preventDefault();
    browser.runtime.sendMessage({'link' : e.target.href})
  }
}

// window.addEventListener("beforeunload", function(e) {
//   console.log("unloading");
//   browser.runtime.sendMessage({"data":"MOO"});
//   setTimeout(function() {
//     e.returnValue = "\o/";
//   }, 2000);
// })
