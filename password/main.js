
$(document).ready(function(){
var secrets = [];
var readout = function(text){
	var msg = new SpeechSynthesisUtterance(text);
	window.speechSynthesis.speak(msg);
}
$("input[type = 'password']").keyup(function(e) {
	let readme = true;

	if(e.keyCode == 8){
		secrets.pop();
	}
	else if(e.key == "Enter"){
		submitted();
		readme = false;
	}
	else if(e.key.length == 1){
		secrets.push(e.key);
	}

	if(readme){
	readout(e.key);
	}
	
	console.log(e);
	console.log(secrets.join(""));
});


function submitted() {
	readout("Your password is, " + secrets.join(""));

	$("body").append("<p style='position: fixed; z-index: 999999; width: 100%; margin: 0px; text-align: center; font-size: 124px; font-family: \"Comic Sans MS\"; color: magenta; top: 30%; '>" + secrets.join("") + "</p>");
}

});