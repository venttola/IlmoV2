"use strict";

export = function(db: any) {
	var payment = db.define("Payment", {
		name: { type: "text", required: true},
		price: { type: "number", require: true}
	});
};