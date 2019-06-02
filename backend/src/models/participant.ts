"use strict";
export function Participant(db: any) {
	var participant = db.define("Participant", {
		firstname: {type: "text", required: true},
		lastname: {type: "text", require: true},
		age: {type: "number", time: false, required: true},
		allergies: {type: "text"}
	}, {
		methods: {
			fullName: function () {
				return this.firstname + " " + this.lastname;
			}
		}
	});
};