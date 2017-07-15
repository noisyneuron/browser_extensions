

var portFromCS;

function connected(p) {
   portFromCS = p;
}

browser.runtime.onConnect.addListener(connected);

function onCaptured(imageUri) {
    console.log(imageUri);
    portFromCS.postMessage({"data": imageUri});
}

function onError(error) {
    console.log(`Error: ${error}`);
}

browser.runtime.onMessage.addListener(function(d) {
   console.log(d);
   var capturing = browser.tabs.captureVisibleTab();
   capturing.then(onCaptured, onError);
});

