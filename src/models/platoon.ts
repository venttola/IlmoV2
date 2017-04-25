"use strict";

export = function(db: any) {
	var platoon = db.define("Platoon", {
		name: { type: "text", required: true}
	});
};