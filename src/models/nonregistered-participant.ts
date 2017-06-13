"use strict";
export function NonregisteredParticipant(db: any) {
	var nonregisteredParticipant = db.define("NonregisteredParticipant", {
		firstname: {type: "text", required: true},
		lastname: {type: "text", require: true},
		age: {type: "number", time: false, required: true},
		allergies: {type: "text"}
	});
};