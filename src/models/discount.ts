"use strict";
export = function(db: any) {
	var discount = db.define("Discount", {
		name: { type: "text"},
		amount: { type: "number" }
	});
	discount.hasOne ("product", db.models.Product, {}, {reverse: "discounts"} );
};