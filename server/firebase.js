var admin = require("firebase-admin");

var serviceAccount = require("./foodsnap-c4eaf-firebase-adminsdk-bdtbv-8cbfa433fa.json");

function Database(){
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://foodsnap-c4eaf.firebaseio.com"
	});

	// As an admin, the app has access to read and write all data, regardless of Security Rules
	this.db = admin.database();
	this.ref = this.db.ref("domains");
	this.getDomain = function(domain,callback){
		const d = new Buffer(domain).toString('base64')
		var count = 0;
		var desc = [];
		this.ref.child(d).once("value", function(snapshot) {
			if(snapshot.val() != null && snapshot.val() != undefined){
				count=snapshot.val().count;
				for(i=0;i<count;i++){
					desc.push(snapshot.val().desc[i.toString()])
				}
			}
			callback({"count":count,"desc":desc})
		});
	}
	this.updateDomain = function(domain,description){
		const d = new Buffer(domain).toString('base64')
		this.getDomain(domain,(data) =>{
			var da = data;
			da.count++;
			da.desc.push(description);
			var userRef = this.ref.child(d);
			userRef.set(da);
		});
	}
}