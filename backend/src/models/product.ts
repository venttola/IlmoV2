"use strict";
export function Product(db: any) {
	var product = db.define("Product", {
		name: { type: "text"},
		price: { type: "number" }
	});
};