"use strict";

export function Platoon(db: any) {
	var platoon = db.define("Platoon", {
		name: { type: "text", required: true}
	});
};