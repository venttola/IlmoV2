"use strict";
export function User(db: any) {
	var user = db.define("User", {
		email: { type: "text", required: true },
		password: { type: "text", required: true }, // Look into how to save this safely
		firstname: { type: "text", required: true },
		lastname: { type: "text", require: true },
		dob: { type: "date", time: false, required: true },
		allergies: { type: "text" },
		phone: { type: "text" }
	}, {
		methods: {
			fullName: function () {
				return this.firstname + " " + this.lastname;
			}
		}
	});
};