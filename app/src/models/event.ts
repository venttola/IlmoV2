"use strict";

export = function(db: any) {
	var event = db.define("Event", {
		name: { type: "text"},
		startdate: { type: "date"} //Check if there is a more elegant way.
	});
	event.hasMany ("products", db.models.Product, {}, {reverse: "event"}); //Check if need more beef, or just plain works or even necessary at all.
	event.hasMany ("organizers", db.models.User);

};