"use strict";

export = function(db: any) {
	var event = db.define("Event", {
		name: { type: "text", required: true},
		startdate: { type: "date", required: true}, //Check if there is a more elegant way.
		description: {type: "text"}
	});
	event.hasMany ("products", db.models.Product, {}, {reverse: "event"}); //Check if need more beef, or just plain works or even necessary at all.
	event.hasMany ("organizers", db.models.User);

};