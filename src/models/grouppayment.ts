"use strict";

export = function(db: any) {
	var groupPayment = db.define("GroupPayment", {
		paidOn: {type: "date"}
	});
	//Add a price function
};