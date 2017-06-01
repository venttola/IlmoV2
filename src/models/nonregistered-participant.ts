"use strict";
export function NonregisteredParticipant(db: any) {
	var user = db.define("NonregisteredParticipant", {
		firstname: {type: "text", required: true},
		lastname: {type: "text", require: true},
		age: {type: "date", time: false, required: true},
		allergies: {type: "text"}
	});
};