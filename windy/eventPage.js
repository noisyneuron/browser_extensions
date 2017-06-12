var num = 1;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    num++;
    console.log(num);
    for(var i=0; i<3; i++) {
      chrome.tabs.create({url: request.goToPage});
    }
    console.log(sender);
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    sendResponse({farewell: "mooo"});
  });