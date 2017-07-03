var myPort = browser.runtime.connect({name:"port-from-cs"});

myPort.onMessage.addListener(function(m) {
    // display the image!
      console.log("In content script, received message from background script: ");
      console.log(m);
      document.getElementsByTagName('html')[0].innerHTML = '<img src="' + m.data + '" />'
});
