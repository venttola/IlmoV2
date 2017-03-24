"use strict";
export = function(db: any) {
	var product = db.define("Product", {
		name: { type: "text"},
		price: { type: "number" }
	});
};