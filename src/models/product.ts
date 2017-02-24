"use strict";
export = function(db: any) {
	var product = db.define("Product", {
		name: { type: "text"},
		price: { type: "number" }
	});
	product.hasOne ("event", db.models.Event, {}, {reverse: "Products"} );
	product.hasMany("discounts", db.models.Discount, {}, {reverse: "product"});
};