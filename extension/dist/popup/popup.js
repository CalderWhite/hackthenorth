// code that will run when the extension icon is clicked.

function showMsg() {
	document.getElementById("msg").innerHTML = "Hover over the malicious link and press A";

	setTimeout(function(){
	    document.getElementById("msg").innerHTML = '';
	}, 3000);
}

var x, y = null;
	
function handleWindowClose(e) {
   	e = window.event || e;
 	x = event.clientX;
   	y = event.clientY; 
}

document.addEventListener('DOMContentLoaded', function() {
	var button = document.getElementById("picker");
	
	button.addEventListener('click', function() {
		document.getElementById("msg").innerHTML = "Hover over a malicious link and press A";

		setTimeout(function(){
	    document.getElementById("msg").innerHTML = '';
	}, 3000);
	});
	


	button.addEventListener('keypress', function() {
		//var x = event.clientX, y = event.clientY,
	    window.onbeforeunload = handleWindowClose;
	    elementMouseIsOver = document.elementFromPoint(x, y);
	    console.log(elementMouseIsOver);
	    console.log(x, y);
	})	

})