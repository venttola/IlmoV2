"use strict";
//Maybe add createdDate as well?
export function GroupPayment(db: any) {
	var groupPayment = db.define("GroupPayment", {
		paidOn: {type: "date", allowNull: true},
		referenceNumber: { type: "text", required: true },
		isPaid: {type: "boolean"}
	});
	//Add a price function
};