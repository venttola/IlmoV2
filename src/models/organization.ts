"use strict";
export function Organization (db: any) {
	var organization = db.define("Organization", {
		name: { type: "text", required: true},
		bankAccount: {type: "text", required: true}

	});
};