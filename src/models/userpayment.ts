"use strict";

export = function(db: any) {
	var userPayment = db.define("UserPayment", {
		paidOn: {type: "date"},
		isPaid: {type: "boolean"}

	});
	//Add a price function
};