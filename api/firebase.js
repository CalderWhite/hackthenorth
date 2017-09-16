const admin = require("firebase-admin");
function Database(){
	// just using preset values for simplicity
	const DATABASEURL = "https://foodsnap-c4eaf.firebaseio.com";
	const SECERETSPATH = "./firebase_secerets.json";
	// initialization for a service account admin.
	// (Basically god mode)
	const serviceAccount = require(SECERETSPATH);
	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: DATABASEURL
	});
	this.db = admin.database();
	this.getDay = function(){
		// timestamp that defines today
		return (new Date()).toDateString();
	}
	this.getUser = function(id,callback){
		const day = this.getDay();
		const ref = this.db.ref("users/"+id.toString()+"/"+day.toString());
		ref.on("value", function(snapshot) {
			// assuming it returns one value...
			values = snapshot.val();
			callback(values)
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		return
	}
	this.update = function(id,data,callback){
		const day = this.getDay();
		const ref = this.db.ref("users").child(id.toString()+"/"+day.toString());
		ref.set(data)
		return
	}
}
// use this for testing
//const db = new Database();
/*
db.getUser("test",(data) =>{
	console.log(data);
})

db.update("test",{sugar:0,protein:0});

console.log("done.")
*/