"use strict";
export = function(db: any) {
	var user = db.define("User", {
		email: {type: "text"},
		password: {type: "text"}, //Look into how to save this safely
		name: {type: "text"},
		dob: {type: "date"},
		allergies: {type: "text"}
	});
	user.hasMany("products", db.models.Product);
	user.hasMany("moderatedGroups", db.models.ParticipantGroup, {}, {reverse: "moderator"});
};