// code that will run when the extension icon is clicked.


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
		}, 1000);

		chrome.runtime.sendMessage({
          "title":descrip,
          "url":url
        },function(res){
          if(res === null){
            console.log(res);
            //alert("An error occurred in background.js");
          } else{
          	document.getElementById("msg").innerHTML = "Report Sent!";
			setTimeout(function(){
		    	document.getElementById("msg").innerHTML = '';
			}, 2000);
          }
        })
				
	});


})