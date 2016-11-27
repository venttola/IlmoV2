"use strict";

export = function(db: any) {
	var payment = db.define("Payment", {
		name: { type: "text"},
		price: { type: "number" }
	});
	payment.hasOne ("event", db.models.Event, {reverse: "Products"} );
	payment.hasOne ("payee", db.models.User);
};