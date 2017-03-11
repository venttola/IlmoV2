"use strict";
export = function(db: any) {
	var user = db.define("User", {
		email: {type: "text", required: true},
		password: {type: "text", required: true}, //Look into how to save this safely
		firstname: {type: "text", required: true},
		lastname: {type: "text", require: true},
		dob: {type: "date", time: false, required: true},
		allergies: {type: "text"}
	});

	user.hasMany("products", db.models.Product);
	//user.hasMany("moderatedGroups", db.models.ParticipantGroup, {}, {reverse: "moderator"});
	user.hasMany("payments", db.models.Payment, {}, {reverse: "payee"});
};