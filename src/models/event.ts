"use strict";

export = function (db: any) {
	var event = db.define("Event", {
		name: { type: "text", required: true },
		startDate: { type: "date", time: false, required: true }, // Check if there is a more elegant way.
		endDate: {type: "date", time: false, required: true},
		description: { type: "text" },
		registerationOpen: {type: "boolean", required: true }
	});
};