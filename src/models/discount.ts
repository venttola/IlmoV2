"use strict";
export = function(db: any) {
	var discount = db.define("Discount", {
		name: { type: "text", required: true},
		amount: { type: "number", required: true}
	});
};