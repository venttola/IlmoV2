"use strict";

export = function(db: any) {
	var groupPayment = db.define("GroupPayment", {
		paidOn: {type: "date", required: true}
	});
	//Add a price function
};