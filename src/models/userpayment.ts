"use strict";

export function UserPayment(db: any) {
	var userPayment = db.define("UserPayment", {
		paidOn: {type: "date"},
		isPaid: {type: "boolean"}

	});
	//Add a price function
};