// code that will run when the extension icon is clicked.

function showMsg() {
	document.getElementById("msg").innerHTML = "Hover over the malicious link and press A";

	setTimeout(function(){
	    document.getElementById("msg").innerHTML = '';
	}, 3000);
}

/*
function mouseCoordinate(e) {
    var x = e.pageX;
    var y = e.pageY;
    var el = document.elementFromPoint(x, y);
		console.log(el);
    //alert("User clicked at position (" + x + "," + y + ")")
};



document.onmousemove = function(e) {
	var x = e.pageX;
    var y = e.pageY;
    var el = document.elementFromPoint(x, y);
		console.log(el);
}
*/
document.addEventListener('DOMContentLoaded', function(e) {
	var button = document.getElementById("picker");
	var summary = document.getElementById("summary");
	var link = document.getElementById("link");
	button.addEventListener('click', function(e) {
		var descrip = summary.value;
		var url = link.value;
		document.getElementById("msg").innerHTML = "Processing your report...";
		setTimeout(function(){
	    	document.getElementById("msg").innerHTML = '';
		}, 3000);
				
	});

	button.addEventListener('keypress', function(e) {
	   	const tab = chrome.tabs.query({ active: true, currentWindow: true })[0];
		console.log(tab);
	   	invisibleBtn.click();
	});	

})