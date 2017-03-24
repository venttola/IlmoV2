"use strict";

export = function (db: any) {
	var event = db.define("Event", {
		name: { type: "text", required: true },
		startdate: { type: "date", time: true, required: true }, // Check if there is a more elegant way.
		description: { type: "text" }
	});
};